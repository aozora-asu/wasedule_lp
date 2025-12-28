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
};

export async function contactFormAction({
  subject,
  name,
  email,
  body,
}: SendEmailParams): Promise<SendEmailResponse> {
  try {
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
