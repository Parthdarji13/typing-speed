import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10_000, // 10 seconds
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

export async function sendCredentialsEmail(to, username, password) {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: "Your Typing Speed Account Credentials",
      html: `
        <h2>Welcome to Typing Speed Challenge 🎯</h2>
        <p>Your account has been created.</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please keep this information safe.</p>
      `,
    });
  } catch (err) {
    // 🔥 CRITICAL: swallow email errors
    console.error("EMAIL SEND FAILED:", err.message);
  }
}
