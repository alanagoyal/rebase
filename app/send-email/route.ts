import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

interface CreateEmailResponse {
  statusCode: number;
  message: string;
}
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    const payload = {
      from: body.from_email,
      to: body.to_emails,
      subject: body.subject,
      html: body.body,
    };

    const emailData = await resend.emails.send(payload);

    return NextResponse.json(emailData);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
