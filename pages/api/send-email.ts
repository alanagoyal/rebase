import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

export default async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('yamymayannnn')
    return res.status(405).end();
  }
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const emailData = await resend.emails.send({
      from: req.body.from_email,
      to: [req.body.to_emails],
      subject: req.body.subject,
      html: req.body.body,
    });

    res.status(200).json(emailData);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
}