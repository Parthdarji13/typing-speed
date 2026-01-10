import fetch from "node-fetch";

export async function sendCredentialsEmail(to, username, password) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.FROM_NAME || "Typing Speed Challenge",
        email: process.env.FROM_EMAIL,
      },
      to: [{ email: to }],
      subject: "Your Typing Speed Account Credentials",
      htmlContent: `
        <h2>Welcome to Typing Speed Challenge 🎯</h2>
        <p>Your account has been created successfully.</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please keep this information safe.</p>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo API error: ${err}`);
  }

  return true;
}
