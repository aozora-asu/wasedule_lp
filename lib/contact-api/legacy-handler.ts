import type { ContactPayload } from "../contact";

export const legacyCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export function createLegacyContactHandler(deps: {
  apiSecret: string | undefined;
  process: (payload: ContactPayload) => Promise<{ success: boolean }>;
}) {
  const reply = (status: number, value: object) =>
    Response.json(value, { status, headers: legacyCorsHeaders });
  return async (request: Request) => {
    // 秘密の設定漏れを匿名公開として扱わない。旧アプリの正しいキーは引き続き受理する。
    if (!deps.apiSecret) return reply(503, { error: "Contact unavailable" });
    if (request.headers.get("x-api-key") !== deps.apiSecret)
      return reply(401, { error: "Unauthorized" });
    try {
      const payload = await request.json();
      const { subject, name, email, body, sentFrom, userEnv } = (payload ??
        {}) as Partial<ContactPayload>;
      if (
        ![subject, name, email, body].every(
          (value) => typeof value === "string" && value.trim().length > 0,
        )
      ) {
        return reply(400, { ok: false, error: "Invalid request" });
      }
      const result = await deps.process({
        subject: subject!,
        name: name!,
        email: email!,
        body: body!,
        sentFrom: sentFrom || "app",
        userEnv: userEnv || "unknown",
      });
      if (!result.success)
        return reply(500, { error: "Internal Server Error" });
      return reply(200, { success: true });
    } catch {
      // 問い合わせ本文や配送サービスの秘密を含みうる例外は外へ出さない。
      return reply(500, { error: "Internal Server Error" });
    }
  };
}
