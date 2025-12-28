import { ContactPayload, processContactInquiry } from "@/lib/contact";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// プリフライトリクエストの処理
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const API_SECRET = process.env.APP_API_SECRET;

function isNotEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    // 1. APIキー認証
    const authHeader = request.headers.get("x-api-key");
    if (API_SECRET && authHeader !== API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. 中身チェック
    const payload = await request.json();
    const { subject, name, email, body, sentFrom, userEnv } = (payload ??
      {}) as Partial<ContactPayload>;
    if (
      !isNotEmptyString(subject) ||
      !isNotEmptyString(name) ||
      !isNotEmptyString(email) ||
      !isNotEmptyString(body)
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid request" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. メール送信
    const result = await processContactInquiry({
      subject,
      name,
      email,
      body,
      sentFrom: sentFrom || "app",
      userEnv: userEnv || "unknown",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
