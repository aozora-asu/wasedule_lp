"use server";

import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

type SendEmailResponse = {
  data: { id: string } | null;
  error: Error | null;
};

type SendEmailParams = {
  subject: string;
  name: string;
  email: string;
  body: string;
};

export async function sendContactEmail({
  subject,
  name,
  email,
  body,
}: SendEmailParams): Promise<SendEmailResponse> {
  const from = process.env.CONTACT_EMAIL_FROM || ""; //TODO エラー処理
  const to = process.env.CONTACT_EMAIL_TO || "";
  const subject = subject;
  const react = EmailTemplate({ name, email, body });

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
    });

    if (error) {
      console.log(error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}
