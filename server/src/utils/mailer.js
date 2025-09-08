// server/src/utils/sendMail.js
import nodemailer from "nodemailer";

export async function sendMail({ to, subject, html, replyTo }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP not configured in environment");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // verify SMTP connection
  await transporter.verify();

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `"Portfolio" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });
}
