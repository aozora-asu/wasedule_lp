import { ContactPostInput } from "./microcms";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  throw new Error("DISCORD_WEBHOOK_URL is not defined");
}

const notifyContactSubmission = async (
  data: ContactPostInput,
) => {
  const isApp = data.sentFrom?.[0] === "app";
  const appVersion = isApp
    ? data.userEnv?.match(/(?:^|[,(])\s*version:\s*([^,)]+)/)?.[1].trim()
    : undefined;
  const packageName = isApp
    ? data.userEnv?.match(/(?:^|[,(])\s*packageName:\s*([^,)]+)/)?.[1].trim()
    : undefined;
  const os = packageName === "com.example.wasedule"
    ? "iOS"
    : packageName === "com.wasedule.wase_dule"
      ? "Android"
      : undefined;

  const content = [
    `**件名**: ${data.title}`,
    `**氏名**: ${data.name}`,
    `**連絡先**: ${data.email}`,
    `**内容**:\n${data.content}`,
    `**送信元**: ${isApp ? "アプリ" : "ウェブ"}`,
    os && `**OS**: ${os}`,
    appVersion && `**アプリバージョン**: ${appVersion}`,
  ]
    .filter(Boolean)
    .join("\n");
  const payload = {
    content: `🔔 **新規お問い合わせ**
-----------------------------------
${content}
-----------------------------------`,
    allowed_mentions: {
      parse: [],
    },
  };

  const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(
      "Failed to send Discord notification:",
      await response.text(),
    );
    throw new Error("Failed to send to Discord");
  }
};

export const discord = { notifyContactSubmission };
