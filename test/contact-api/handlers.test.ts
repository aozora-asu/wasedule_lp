import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPublicContactHandler,
  clientNetwork,
} from "../../lib/contact-api/public-handler";
import { createLegacyContactHandler } from "../../lib/contact-api/legacy-handler";
import {
  MAX_BODY_BYTES,
  readContact,
  validateContact,
} from "../../lib/contact-api/validation";

const payload = {
  name: "早大生",
  email: "student@example.com",
  subject: "ご相談",
  body: "あ".repeat(20),
  sentFrom: "app" as const,
  userEnv: "test-app-info",
};
const env = {
  CONTACT_PUBLIC_API_ENABLED: "true",
  VERCEL: "1",
  UPSTASH_REDIS_REST_URL: "https://example.com",
  UPSTASH_REDIS_REST_TOKEN: "fixture-token",
  CONTACT_RATE_LIMIT_HMAC_KEY: "fixture-only-hmac-key-at-least-32-characters",
};
function request(
  value: unknown = payload,
  headers: Record<string, string> = {},
) {
  return new Request("https://example.com/api/app/v2/contact", {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
      "x-vercel-forwarded-for": "192.0.2.1",
      ...headers,
    },
  });
}
function setup(
  options: {
    result?: unknown;
    error?: boolean;
    process?: (value: typeof payload) => Promise<{ success: boolean }>;
    config?: Record<string, string | undefined>;
    timeout?: number;
  } = {},
) {
  const commands: unknown[][] = [];
  let deliveries = 0;
  const handler = createPublicContactHandler({
    env: options.config ?? env,
    fetcher: async (_url, init) => {
      commands.push(JSON.parse(init!.body as string));
      if (options.error) throw new Error("fixture-private-upstream-error");
      return Response.json({
        result: commands.at(-1)![0] === "EVAL" ? (options.result ?? [1, 0]) : 1,
      });
    },
    process: async (value) => {
      deliveries++;
      return options.process
        ? options.process(value as typeof payload)
        : { success: true };
    },
    deliveryTimeoutMs: options.timeout,
  });
  return { handler, commands, deliveries: () => deliveries };
}

test("鍵なしで既存の6項目を受け付け、成功後に同時実行枠を解放する", async () => {
  const state = setup({
    process: async (value) => {
      assert.deepEqual(value, payload);
      return { success: true };
    },
  });
  const response = await state.handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(
    state.commands.map((command) => command[0]),
    ["EVAL", "ZREM"],
  );
  assert.equal(state.deliveries(), 1);
  const keys = state.commands[0].slice(3, 9).join(" ");
  for (const value of [payload.email, payload.body, "192.0.2.1"])
    assert.ok(!keys.includes(value));
});

test("サーバー設定不足・無効化・非Vercel環境は配送せず503", async () => {
  for (const key of Object.keys(env)) {
    const config: Record<string, string | undefined> = { ...env };
    delete config[key];
    const state = setup({ config });
    assert.equal((await state.handler(request())).status, 503, key);
    assert.equal(state.deliveries(), 0);
    assert.equal(state.commands.length, 0);
  }
  for (const config of [
    { ...env, CONTACT_PUBLIC_API_ENABLED: "false" },
    { ...env, UPSTASH_REDIS_REST_URL: "http://example.com" },
    { ...env, CONTACT_RATE_LIMIT_HMAC_KEY: "short" },
  ]) {
    assert.equal((await setup({ config }).handler(request())).status, 503);
  }
});

test("不正入力・型・未知項目・ヘッダー注入・長さを配送前に拒否", async () => {
  for (const value of [
    null,
    [],
    {},
    { ...payload, email: "a@@b.c" },
    { ...payload, body: "あ".repeat(19) },
    { ...payload, subject: "subject\r\nBcc: injected" },
    { ...payload, body: 20 },
    { ...payload, name: " " },
    { ...payload, name: "a".repeat(201) },
    { ...payload, email: "a".repeat(250) + "@example.com" },
    { ...payload, subject: "a".repeat(201) },
    { ...payload, body: "a".repeat(10001) },
    { ...payload, userEnv: "a".repeat(4001) },
    { ...payload, sentFrom: "landing" },
    { ...payload, to: "other@example.com" },
  ]) {
    const state = setup();
    assert.equal((await state.handler(request(value))).status, 400);
    assert.equal(state.commands.length, 0);
    assert.equal(state.deliveries(), 0);
  }
  assert.equal(
    validateContact({ ...payload, name: " 早大生 " }).name,
    "早大生",
  );
});

test("JSON以外・不正UTF8・不正JSON・サイズ超過を拒否", async () => {
  assert.equal(
    (await setup().handler(request(payload, { "content-type": "text/plain" })))
      .status,
    415,
  );
  assert.equal(
    (await setup().handler(request(payload, { "content-encoding": "gzip" })))
      .status,
    415,
  );
  assert.equal(
    (
      await setup().handler(
        request(payload, { "content-length": String(MAX_BODY_BYTES + 1) }),
      )
    ).status,
    413,
  );
  for (const body of ["{", new Uint8Array([0xff])]) {
    const req = new Request("https://example.com", {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "x-vercel-forwarded-for": "192.0.2.1",
      },
    });
    assert.equal((await setup().handler(req)).status, 400);
  }
  const state = setup();
  const req = new Request("https://example.com", {
    method: "POST",
    body: " ".repeat(MAX_BODY_BYTES + 1),
    headers: {
      "content-type": "application/json",
      "x-vercel-forwarded-for": "192.0.2.1",
    },
  });
  assert.equal((await state.handler(req)).status, 413);
  assert.equal(state.deliveries(), 0);
});

test("終わらないリクエスト本文を3秒で打ち切る", async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request("https://example.com", {
    method: "POST",
    body: stream,
    duplex: "half",
    headers: { "content-type": "application/json" },
  } as RequestInit);
  await assert.rejects(
    readContact(req),
    (error: unknown) => (error as { status: number }).status === 408,
  );
  assert.equal(cancelled, true);
});

test("転送ヘッダー偽装・未提供・無効アドレスを拒否しIPv6を正規化", async () => {
  for (const ip of ["", "broken", "192.0.2.1, 192.0.2.2", "fe80::1%en0"]) {
    const state = setup();
    assert.equal(
      (
        await state.handler(
          request(payload, {
            "x-vercel-forwarded-for": ip,
            "x-forwarded-for": "192.0.2.9",
          }),
        )
      ).status,
      503,
    );
    assert.equal(state.deliveries(), 0);
  }
  assert.equal(
    clientNetwork(
      request(payload, { "x-vercel-forwarded-for": "::ffff:192.0.2.1" }),
    ),
    "192.0.2.1",
  );
  for (const ip of ["2001:db8::1", "2001:0db8:0000:0000::abcd"])
    assert.equal(
      clientNetwork(request(payload, { "x-vercel-forwarded-for": ip })),
      "2001:0db8:0000:0000::/64",
    );
});

test("共有制限・重複・同時実行拒否は429とRetry-After", async () => {
  const state = setup({ result: [0, 600] });
  const response = await state.handler(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "600");
  assert.equal(state.deliveries(), 0);
});

test("制限基盤の障害・不正応答は無制限配送にせず503", async () => {
  for (const options of [
    { error: true },
    { result: "OK" },
    { result: [2, 0] },
    { result: [0, 0] },
    { result: [1] },
  ]) {
    const state = setup(options);
    const response = await state.handler(request());
    assert.equal(response.status, 503);
    assert.ok(!(await response.text()).includes("fixture-private"));
    assert.equal(state.deliveries(), 0);
  }
});

test("配送失敗・例外・タイムアウトは503で内部エラーを返さない", async () => {
  for (const process of [
    async () => ({ success: false }),
    async () => {
      throw new Error("fixture-private-upstream-error");
    },
  ]) {
    const state = setup({ process });
    const response = await state.handler(request());
    assert.equal(response.status, 503);
    assert.ok(!(await response.text()).includes("fixture-private"));
    assert.equal(state.commands.at(-1)![0], "ZREM");
  }
  const state = setup({
    process: () => new Promise(() => undefined),
    timeout: 5,
  });
  assert.equal((await state.handler(request())).status, 503);
  assert.equal(state.commands.length, 1);
});

test("旧APIは秘密の設定漏れで閉じ、正しい既存ヘッダー・JSONは互換", async () => {
  let calls = 0;
  const process = async (value: unknown) => {
    calls++;
    assert.deepEqual(value, payload);
    return { success: true };
  };
  assert.equal(
    (
      await createLegacyContactHandler({ apiSecret: undefined, process })(
        request(),
      )
    ).status,
    503,
  );
  const handler = createLegacyContactHandler({
    apiSecret: "fixture-legacy-key",
    process,
  });
  assert.equal((await handler(request())).status, 401);
  assert.equal(
    (await handler(request(payload, { "x-api-key": "wrong" }))).status,
    401,
  );
  assert.equal(
    (await handler(request(payload, { "x-api-key": "fixture-legacy-key" })))
      .status,
    200,
  );
  assert.equal(calls, 1);
});

test("旧APIの内部エラー・例外も公開しない", async () => {
  const handler = createLegacyContactHandler({
    apiSecret: "fixture-legacy-key",
    process: async () => {
      throw new Error("fixture-private-upstream-error");
    },
  });
  const response = await handler(
    request(payload, { "x-api-key": "fixture-legacy-key" }),
  );
  assert.equal(response.status, 500);
  assert.ok(!(await response.text()).includes("fixture-private"));
});
