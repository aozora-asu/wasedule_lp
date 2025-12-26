import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY || "");

type ContactPayload = {
  subject: string;
  name: string;
  email: string;
  body: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const { subject, name, email, body } = (payload ?? {}) as Partial<ContactPayload>;

  if (
    !isNonEmptyString(subject) ||
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(body)
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: RESEND_API_KEY" },
      { status: 500 },
    );
  }

  const from = process.env.CONTACT_EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!from || !to) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: CONTACT_EMAIL_FROM/TO" },
      { status: 500 },
    );
  }

  try {
    const react = EmailTemplate({ name, email, body });

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
