import { isIP } from "node:net";
import type { ContactPayload } from "../contact";
import { ContactInputError, readContact } from "./validation";
import { createLimiter, type LimiterConfig } from "./redis-limiter";

function configuration(
  env: Readonly<Record<string, string | undefined>>,
): LimiterConfig | null {
  if (
    env.CONTACT_PUBLIC_API_ENABLED !== "true" ||
    env.VERCEL !== "1" ||
    !env.UPSTASH_REDIS_REST_URL ||
    !env.UPSTASH_REDIS_REST_TOKEN ||
    !env.CONTACT_RATE_LIMIT_HMAC_KEY ||
    env.CONTACT_RATE_LIMIT_HMAC_KEY.length < 32
  )
    return null;
  try {
    const url = new URL(env.UPSTASH_REDIS_REST_URL);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
  } catch {
    return null;
  }
  return {
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
    hmacKey: env.CONTACT_RATE_LIMIT_HMAC_KEY,
    namespace: `wasedule:contact:v2:${env.VERCEL_ENV === "production" ? "production" : "preview"}`,
  };
}

export function clientNetwork(request: Request): string | null {
  // Vercelが上書きするヘッダーのみ使用する。別環境でこの信頼条件を流用しない。
  const ip = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (!ip || ip.includes("%") || !isIP(ip)) return null;
  if (isIP(ip) === 4) return ip;
  const normalized = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const mapped = /^::ffff:([\da-f]+):([\da-f]+)$/.exec(normalized);
  if (mapped) {
    const high = parseInt(mapped[1], 16),
      low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join(".");
  }
  // IPv6の一時アドレス切替で制限を回避されないよう、/64単位で数える。
  const [left, right] = normalized.split("::");
  const start = left ? left.split(":") : [];
  const end = right ? right.split(":") : [];
  const groups = normalized.includes("::")
    ? [...start, ...Array(8 - start.length - end.length).fill("0"), ...end]
    : start;
  return `${groups
    .slice(0, 4)
    .map((group) => group.padStart(4, "0"))
    .join(":")}::/64`;
}

type Dependencies = {
  env: Readonly<Record<string, string | undefined>>;
  process: (payload: ContactPayload) => Promise<{ success: boolean }>;
  fetcher?: typeof fetch;
  deliveryTimeoutMs?: number;
};

export function createPublicContactHandler(deps: Dependencies) {
  const config = configuration(deps.env);
  const reserve = config ? createLimiter(config, deps.fetcher) : null;
  const reply = (status: number, retryAfter?: number) =>
    Response.json(
      status === 200
        ? { success: true }
        : {
            success: false,
            error: status === 429 ? "Too many requests" : "Contact unavailable",
          },
      {
        status,
        headers: {
          "Cache-Control": "no-store",
          ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
        },
      },
    );
  return async (request: Request): Promise<Response> => {
    if (!reserve) return reply(503);
    const ip = clientNetwork(request);
    if (!ip) return reply(503);
    try {
      const payload = await readContact(request);
      const reservation = await reserve(ip, payload);
      if (!reservation.allowed) return reply(429, reservation.retryAfter);
      let timer: ReturnType<typeof setTimeout> | undefined;
      let settled = false;
      try {
        const delivery = deps.process(payload).finally(() => {
          settled = true;
        });
        const expired = new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error("Contact delivery timeout")),
            deps.deliveryTimeoutMs ?? 20000,
          );
        });
        const result = await Promise.race([delivery, expired]);
        return reply(result.success ? 200 : 503);
      } finally {
        clearTimeout(timer);
        // タイムアウト時に外部処理が続く可能性があるため、同時実行枠はlease満了まで保持する。
        if (settled) {
          try {
            await reservation.release();
          } catch {
            console.warn("contact_capacity_release_failed");
          }
        }
      }
    } catch (error) {
      // 外部サービスの例外には秘密や問い合わせ本文を含むため、応答・ログに載せない。
      return reply(error instanceof ContactInputError ? error.status : 503);
    }
  };
}
