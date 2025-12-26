export const sendLineNotification = async (body: string) => {
  const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

  const text = body.trim();

  const response = await fetch(LINE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: process.env.LINE_GROUP_ID,
      messages: [{ type: "text", text: text }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LINE API Error: ${errorText}`);
  }
};
