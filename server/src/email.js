import nodemailer from "nodemailer";

export async function sendCredentialsEmail(to, username, password) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

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
}
