import nodemailer from "nodemailer";

export function createMailer() {
	const {
		SMTP_HOST,
		SMTP_PORT,
		SMTP_USER,
		SMTP_PASS,
		FROM_EMAIL,
	} = process.env;

	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
		throw new Error("Missing SMTP configuration in environment");
	}

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: Number(SMTP_PORT) === 465,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
	});

	return {
		async sendSetPasswordEmail({ to, username, link }) {
			const html = `
				<div style="font-family:Arial,sans-serif;line-height:1.6">
					<h2>Welcome to Typing Speed</h2>
					<p>Hi ${username},</p>
					<p>Your account has been created.</p>
					<p>— Typing Speed Team</p>
				</div>
			`;
			await transporter.sendMail({
				from: FROM_EMAIL,
				to,
				subject: "Your account - Typing Speed",
				html,
			});
		},
		async sendCredentialsEmail({ to, username, password }) {
			const html = `
				<div style="font-family:Arial,sans-serif;line-height:1.6">
					<h2>Welcome to Typing Speed</h2>
					<p>Hi ${username},</p>
					<p>Your account has been created. Use the credentials below to log in:</p>
					<div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:12px 0">
						<p style="margin:6px 0"><strong>Username:</strong> ${username}</p>
						<p style="margin:6px 0"><strong>Password:</strong> ${password}</p>
					</div>
					<p>For security, please change your password after first login.</p>
					<p>— Typing Speed Team</p>
				</div>
			`;
			await transporter.sendMail({
				from: FROM_EMAIL,
				to,
				subject: "Your login credentials - Typing Speed",
				html,
			});
		},
	};
}


