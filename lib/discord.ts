import { ContactPostInput } from "./microcms";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  throw new Error("DISCORD_WEBHOOK_URL is not defined");
}

const notifyContactSubmission = async (
  data: ContactPostInput,
) => {
  const content = [
    `**件名**: ${data.title}`,
    `**氏名**: ${data.name}`,
    `**連絡先**: ${data.email}`,
    `**内容**:\n${data.content}`,
    `**送信元**: ${data.sentFrom && data.sentFrom[0] === "app" ? "アプリ" : "ウェブ"}`,
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
