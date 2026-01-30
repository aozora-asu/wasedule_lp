"use server";
import { processContactInquiry } from "@/lib/contact";

type SendEmailResponse = {
  success: boolean;
};

type SendEmailParams = {
  subject: string;
  name: string;
  email: string;
  body: string;
  token: string | null;
};

export async function contactFormAction({
  subject,
  name,
  email,
  body,
  token,
}: SendEmailParams): Promise<SendEmailResponse> {
  try {
    if(!token) {
      return { success: false };
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return { success: false };
    }

    const { success, error } = await processContactInquiry({
      subject,
      name,
      email,
      body,
      sentFrom: "landing",
      userEnv: "landing page server action",
    });

    if (error != null || !success) {
      console.log(error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
