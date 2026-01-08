import nodemailer from "nodemailer";

export function sendCredentialsEmail(to, username, password) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // 🔥 force number
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    transporter.sendMail({
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
    // 🔥 NEVER crash registration because of email
    console.error("❌ Email failed (ignored):", err.message);
  }
}
