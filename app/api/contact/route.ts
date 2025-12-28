import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { postContact } from "@/lib/microcms";
import { sendLineNotification } from "@/lib/line";

const resend = new Resend(process.env.RESEND_API_KEY || "");

type ContactPayload = {
  subject: string;
  name: string;
  email: string;
  body: string;
  sentFrom: "landing" | "app";
  userEnv: string;
};

function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { subject, name, email, body, sentFrom, userEnv } = (payload ??
    {}) as Partial<ContactPayload>;

  if (
    !isNotEmptyString(subject) ||
    !isNotEmptyString(name) ||
    !isNotEmptyString(email) ||
    !isNotEmptyString(body)
  ) {
    return NextResponse.json(
      { ok: false, error: "未入力の必須項目があります" },
      { status: 400 }
    );
  }

  const sentFromValue: ["landing"] | ["app"] = sentFrom === "landing" ? ["landing"] : ["app"];
  const userEnvValue = userEnv || request.headers.get("user-agent") || "unknown";

  const postContactResult = await postContact({
    title: subject,
    name,
    email,
    content: body,
    sentAt: new Date(),
    sentFrom: sentFromValue,
    userEnv: userEnvValue,
  });

  const microCMSDomain = process.env.MICROCMS_DOMAIN || "unknown";

  const lineMessage = `【お問い合わせがありました(${sentFromValue[0]})】
name: ${name}
mail: ${email}
sub: ${subject}
http://${microCMSDomain}.microcms.io/apis/contacts/${postContactResult.id}
===================
${body}`;

  await sendLineNotification(lineMessage);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: RESEND_API_KEY" },
      { status: 500 }
    );
  }

  const from = process.env.CONTACT_EMAIL_FROM;
  if (!from) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: CONTACT_EMAIL_FROM" },
      { status: 500 }
    );
  }

  try {
    const react = EmailTemplate({ name, subject, email, body });

    const { data, error } = await resend.emails.send({
      from: `わせジュールサポート <${from}>`,
      to: email,
      subject: "お問い合わせを受け付けました",
      react,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.log("Error sending email:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
