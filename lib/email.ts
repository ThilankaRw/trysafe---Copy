import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendReactEmail({
  to,
  subject,
  emailTemplate,
}: {
  to: string;
  subject: string;
  emailTemplate: ReactElement;
}) {
  try {
    // Convert React component to HTML string
    const html = await render(emailTemplate);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Example usage:
/*
await sendEmail({
  to: "recipient@example.com",
  subject: "Test Email",
  html: "<h1>Hello</h1><p>This is a test email</p>"
});
*/
