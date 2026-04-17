import { Resend } from "resend";
import { ContactPostInput, postContact } from "./microcms";
import { EmailTemplate } from "@/components/email-template";
import { contactSpreadsheet } from "./google-apps-script";
import { discord } from "./discord";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.CONTACT_EMAIL_FROM;

export type ContactPayload = {
  subject: string;
  name: string;
  email: string;
  body: string;
  sentFrom: "landing" | "app";
  userEnv: string;
};

export async function processContactInquiry(payload: ContactPayload) {
  const { subject, name, email, body, sentFrom, userEnv } = payload;
  try {
    const dataToSave: ContactPostInput = {
      title: subject,
      name,
      email,
      content: body,
      sentAt: new Date(),
      sentFrom: sentFrom === "landing" ? ["landing"] : ["app"],
      userEnv,
    };

    // お問い合わせ内容をmicroCMSに保存
    await postContact(dataToSave);

    // お問い合わせ内容をGoogleスプレッドシートに保存
    await contactSpreadsheet.create(dataToSave);

    // LINE通知送信
    // const lineMessage = getLineMessage({
    //   ...payload,
    //   microCMSDomain: process.env.MICROCMS_DOMAIN || "unknown",
    //   microCMSItemId: postContactResult.id,
    // });
    // await sendLineNotification(lineMessage);

    // Discord通知送信
    await discord.notifyContactSubmission(dataToSave);

    // ユーザーへの自動返信メール送信
    const react = EmailTemplate({ name, subject, email, body });
    if (!from) {
      throw new Error("CONTACT_EMAIL_FROM is not defined");
    }
    const data = await resend.emails.send({
      from: `わせジュールサポート <${from}>`,
      to: email,
      subject: "お問い合わせを受け付けました",
      react,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}