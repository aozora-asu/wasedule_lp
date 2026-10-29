import { createPublicContactHandler } from "@/lib/contact-api/public-handler";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return createPublicContactHandler({
    env: process.env,
    process: async (payload) => {
      const { processContactInquiry } = await import("@/lib/contact");
      // メール所有を検証できない匿名APIから任意の宛先への自動返信は行わない。
      return processContactInquiry(payload, { sendReceipt: false });
    },
  })(request);
}
