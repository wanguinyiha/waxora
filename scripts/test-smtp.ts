import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
const envFile = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

async function test() {
  console.log("SMTP_HOST:", env.SMTP_HOST);
  console.log("SMTP_PORT:", env.SMTP_PORT);
  console.log("SMTP_USER:", env.SMTP_USER);
  console.log("SMTP_PASSWORD:", env.SMTP_PASSWORD ? "****set****" : "MISSING");

  try {
    console.log("\nVerifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection successful!");

    console.log("\nSending test email...");
    const info = await transporter.sendMail({
      from: env.SMTP_USER,
      to: env.SMTP_USER,
      subject: "Waxora SMTP Test",
      text: "SMTP is working successfully.",
    });
    console.log("Email sent! Message ID:", info.messageId);
  } catch (err) {
    console.error("SMTP error:", err);
  }
}

test();
