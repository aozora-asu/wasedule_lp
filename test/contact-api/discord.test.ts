import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

function setup(t: TestContext, status: number) {
  const previous = process.env.DISCORD_WEBHOOK_URL;
  process.env.DISCORD_WEBHOOK_URL = "https://example.com/fixture-webhook";
  t.after(() => {
    if (previous === undefined) delete process.env.DISCORD_WEBHOOK_URL;
    else process.env.DISCORD_WEBHOOK_URL = previous;
  });
  const sent: { content: string; allowed_mentions: { parse: string[] } }[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, init: RequestInit) => {
      sent.push(JSON.parse(init.body as string));
      return new Response(
        status === 204 ? null : "fixture-private-upstream-error",
        { status },
      );
    },
  );
  return sent;
}

const input = {
  title: "ご相談",
  name: "早大生",
  email: "student@example.com",
  content: "😀".repeat(2000),
  sentAt: new Date("2026-10-30T00:00:00Z"),
  sentFrom: ["app"] as ["app"],
  userEnv:
    "PackageInfo(appName: wasedule, buildNumber: 56, packageName: com.wasedule.wase_dule, version: 20.1.1)",
};

test("長文でもOS・アプリバージョンを残し、絵文字を壊さず通知上限に収める", async (t) => {
  const sent = setup(t, 204);
  const { discord } = await import("../../lib/discord");
  await discord.notifyContactSubmission(input);
  assert.equal(sent.length, 1);
  assert.ok(sent[0].content.length <= 2000);
  assert.match(sent[0].content, /\*\*OS\*\*: Android/);
  assert.match(sent[0].content, /\*\*アプリバージョン\*\*: 20\.1\.1/);
  assert.doesNotMatch(sent[0].content, /[\uD800-\uDFFF]/u);
  assert.deepEqual(sent[0].allowed_mentions, { parse: [] });
});

test("Discordの内部エラー本文を例外・ログへ露出しない", async (t) => {
  setup(t, 503);
  const logged = t.mock.method(console, "error", () => undefined);
  const { discord } = await import("../../lib/discord");
  await assert.rejects(discord.notifyContactSubmission(input), {
    message: "Failed to send to Discord",
  });
  assert.equal(logged.mock.callCount(), 0);
});
