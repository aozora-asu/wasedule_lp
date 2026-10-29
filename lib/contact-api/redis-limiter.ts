import { createHmac, randomUUID } from "node:crypto";
import type { ContactPayload } from "../contact";

// 同時実行でも上限を超えないよう、検査と予約を1回のLua実行で確定する。
// 時刻もRedisから取得し、アプリサーバー間の時計差の影響を避ける。
export const RESERVE_SCRIPT = `
local t = redis.call('TIME')
local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
redis.call('ZREMRANGEBYSCORE', KEYS[6], '-inf', now)
local duplicate = redis.call('PTTL', KEYS[5])
if duplicate > 0 then return {0, math.ceil(duplicate / 1000)} end
local limits = {5, 20, 3, 1000}
local windows = {600000, 86400000, 3600000, 86400000}
local retry = 0
for i = 1, 4 do
  if tonumber(redis.call('GET', KEYS[i]) or '0') >= limits[i] then
    retry = math.max(retry, math.ceil(redis.call('PTTL', KEYS[i]) / 1000), 1)
  end
end
if retry > 0 then return {0, retry} end
if redis.call('ZCARD', KEYS[6]) >= 10 then return {0, 120} end
for i = 1, 4 do
  local count = redis.call('INCR', KEYS[i])
  if count == 1 then redis.call('PEXPIRE', KEYS[i], windows[i]) end
end
redis.call('SET', KEYS[5], ARGV[1], 'PX', 600000)
redis.call('ZADD', KEYS[6], now + 120000, ARGV[1])
redis.call('PEXPIRE', KEYS[6], 120000)
return {1, 0}
`;

export type Reservation =
  | { allowed: false; retryAfter: number }
  | { allowed: true; release: () => Promise<void> };

export type LimiterConfig = {
  url: string;
  token: string;
  hmacKey: string;
  namespace: string;
};

export function createLimiter(
  config: LimiterConfig,
  fetcher: typeof fetch = fetch,
) {
  const digest = (label: string) =>
    createHmac("sha256", config.hmacKey).update(label).digest("hex");
  async function command(parts: (string | number)[]): Promise<unknown> {
    const response = await fetcher(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(parts),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
      redirect: "error",
    });
    if (!response.ok) throw new Error("Contact limiter unavailable");
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== "object" ||
      "error" in data ||
      !("result" in data)
    ) {
      throw new Error("Invalid contact limiter response");
    }
    return (data as { result: unknown }).result;
  }
  return async (ip: string, payload: ContactPayload): Promise<Reservation> => {
    // 生のIP・メール・本文を制限ストアやログに残さない。
    const email = payload.email.toLowerCase();
    const keys = [
      `ip10m:${digest(`ip:${ip}`)}`,
      `ipday:${digest(`ip:${ip}`)}`,
      `email:${digest(`email:${email}`)}`,
      "total",
      `duplicate:${digest(JSON.stringify([email, payload.subject, payload.body]))}`,
      "active",
    ].map((key) => `${config.namespace}:${key}`);
    const id = randomUUID();
    const result = await command([
      "EVAL",
      RESERVE_SCRIPT,
      keys.length,
      ...keys,
      id,
    ]);
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      !Number.isInteger(result[0]) ||
      !Number.isInteger(result[1]) ||
      ![0, 1].includes(result[0]) ||
      result[1] < 0 ||
      (result[0] === 0 && result[1] < 1)
    ) {
      throw new Error("Invalid contact limiter response");
    }
    if (result[0] === 0) return { allowed: false, retryAfter: result[1] };
    return {
      allowed: true,
      // 失敗・部分保存時も重複予約は残し、即時再送による二重配送を防ぐ。
      release: async () => {
        await command(["ZREM", keys[5], id]);
      },
    };
  };
}
