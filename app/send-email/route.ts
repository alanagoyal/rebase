import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request, res: NextResponse) {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
    const body = await req.json()
    console.log(body)
    const payload = {
        from: body.from_email,
        to: body.to_emails,
        subject: body.subject,
        html: body.body,
      }
      console.log(payload)
    const emailData = await resend.emails.send(payload);

    return NextResponse.json({ success: emailData?.statusCode < 300, result: emailData, payload: payload }, { status: emailData?.statusCode, statusText: emailData.message })
}
