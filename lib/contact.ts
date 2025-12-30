import { Resend } from "resend";
import { sendLineNotification } from "./line";
import { postContact } from "./microcms";
import { EmailTemplate } from "@/components/email-template";

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
    const postContactResult = await postContact({
      title: subject,
      name,
      email,
      content: body,
      sentAt: new Date(),
      sentFrom: sentFrom === "landing" ? ["landing"] : ["app"],
      userEnv,
    });

    const microCMSDomain = process.env.MICROCMS_DOMAIN || "unknown";

    const lineMessage = getLineMessage({
      ...payload,
      microCMSDomain,
      microCMSItemId: postContactResult.id,
    });

    await sendLineNotification(lineMessage);

    const react = EmailTemplate({ name, subject, email, body });

    if(!from) {
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

const getLineMessage = ({
  subject,
  name,
  email,
  body,
  sentFrom,
  microCMSDomain,
  microCMSItemId,
}: ContactPayload & {
  microCMSDomain: string;
  microCMSItemId: string;
}) => `【お問い合わせがありました(${sentFrom})】
name: ${name}
mail: ${email}
sub: ${subject}
http://${microCMSDomain}.microcms.io/apis/contacts/${microCMSItemId}
===================
${body}`;
