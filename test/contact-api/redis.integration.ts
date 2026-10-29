import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { test } from "node:test";
import { createLimiter } from "../../lib/contact-api/redis-limiter";

const socket = process.env.CONTACT_TEST_REDIS_SOCKET;
const cli = process.env.CONTACT_TEST_REDIS_CLI ?? "redis-cli";
if (!socket)
  throw new Error(
    "CONTACT_TEST_REDIS_SOCKET is required for isolated Redis integration tests",
  );
const execute = promisify(execFile);
async function command(parts: (string | number)[]) {
  const result = await execute(cli, [
    "--json",
    "-s",
    socket!,
    ...parts.map(String),
  ]);
  return JSON.parse(result.stdout);
}
const payload = {
  name: "早大生",
  email: "student@example.com",
  subject: "ご相談",
  body: "あ".repeat(20),
  sentFrom: "app" as const,
  userEnv: "test-app-info",
};
function setup() {
  const namespace = `contact-test:${randomUUID()}`;
  const hmacKey = "fixture-only-hmac-key-at-least-32-characters";
  const reserve = createLimiter(
    { url: "https://example.com", token: "fixture-token", hmacKey, namespace },
    async (_url, init) => {
      const parts = JSON.parse(init!.body as string);
      return Response.json({ result: await command(parts) });
    },
  );
  const digest = (text: string) =>
    createHmac("sha256", hmacKey).update(text).digest("hex");
  return { reserve, namespace, digest };
}

test("同一IPから50同時要求でも10分あたり5件を超えない", async () => {
  const { reserve } = setup();
  const results = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      reserve("192.0.2.1", { ...payload, email: `student${i}@example.com` }),
    ),
  );
  assert.equal(results.filter((result) => result.allowed).length, 5);
  for (const result of results) if (result.allowed) await result.release();
});

test("メール別上限はIP・本文を変えても1時間あたり3件", async () => {
  const { reserve } = setup();
  for (let i = 0; i < 3; i++) {
    const result = await reserve(`192.0.2.${i + 1}`, {
      ...payload,
      body: payload.body + i,
    });
    assert.equal(result.allowed, true);
    if (result.allowed) await result.release();
  }
  const denied = await reserve("192.0.2.9", {
    ...payload,
    body: payload.body + "new",
  });
  assert.equal(denied.allowed, false);
  if (!denied.allowed) assert.ok(denied.retryAfter > 3500);
});

test("IP日次上限と全体日次上限を原子的に守る", async () => {
  const { reserve, namespace, digest } = setup();
  await command([
    "PSETEX",
    `${namespace}:ipday:${digest("ip:192.0.2.1")}`,
    86400000,
    20,
  ]);
  assert.equal((await reserve("192.0.2.1", payload)).allowed, false);
  await command(["PSETEX", `${namespace}:total`, 86400000, 999]);
  const results = await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      reserve(`192.0.2.${i + 2}`, {
        ...payload,
        email: `student${i}@example.com`,
      }),
    ),
  );
  assert.equal(results.filter((result) => result.allowed).length, 1);
  assert.equal(await command(["GET", `${namespace}:total`]), "1000");
});

test("重複抑止はIP変更・枠解放後も10分間維持される", async () => {
  const { reserve } = setup();
  const first = await reserve("192.0.2.1", payload);
  assert.equal(first.allowed, true);
  if (first.allowed) await first.release();
  const duplicate = await reserve("192.0.2.2", {
    ...payload,
    name: "別名",
    userEnv: "changed",
  });
  assert.equal(duplicate.allowed, false);
  if (!duplicate.allowed) assert.ok(duplicate.retryAfter > 590);
});

test("共有の同時配送は10件まで、期限切れleaseは回収される", async () => {
  const { reserve, namespace } = setup();
  const results = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      reserve(`192.0.2.${i + 1}`, {
        ...payload,
        email: `student${i}@example.com`,
      }),
    ),
  );
  assert.equal(results.filter((result) => result.allowed).length, 10);
  const active: string[] = await command([
    "ZRANGE",
    `${namespace}:active`,
    0,
    -1,
  ]);
  for (const id of active)
    await command(["ZADD", `${namespace}:active`, 0, id]);
  const next = await reserve("192.0.2.100", {
    ...payload,
    email: "other@example.com",
  });
  assert.equal(next.allowed, true);
});
