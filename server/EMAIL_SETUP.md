# 📧 Email Setup Guide - Send Username & Password to Users

## ✅ Email is Already Built In!

Your backend already sends emails with username and password when users register. You just need to configure it!

---

## 🎯 How It Works

When a user registers via `/auth/register`:
1. Backend creates account in MongoDB
2. Generates random secure password
3. **Automatically sends email** with:
   - Username
   - Password
   - Login instructions

---

## 📝 Setup Email (Gmail Example)

### Step 1: Enable 2-Factor Authentication

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required for App Passwords)

### Step 2: Generate App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** Typing Speed Backend
3. Click **Generate**
4. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
5. **Remove spaces:** `abcdefghijklmnop`

### Step 3: Add to .env File

In `server/.env`:

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
```

**Important:**
- `SMTP_USER` = Your Gmail address
- `SMTP_PASS` = The 16-character App Password (no spaces)
- `FROM_EMAIL` = Same as SMTP_USER

---

## 📧 Other Email Providers

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
FROM_EMAIL=your-email@outlook.com
```

### Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@yahoo.com
```

### Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@yourdomain.com
```

---

## 🧪 Test Email Sending

### 1. Start Backend

```bash
cd server
npm run dev
```

### 2. Test Registration Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"your-test-email@gmail.com"}'
```

**Using Postman/Thunder Client:**
- Method: `POST`
- URL: `http://localhost:4000/auth/register`
- Body (JSON):
```json
{
  "name": "Test User",
  "email": "your-test-email@gmail.com"
}
```

### 3. Check Email

You should receive an email with:
- Subject: "Your login credentials - Typing Speed"
- Username
- Password
- Login instructions

---

## 📨 Email Template (Current)

The email sent looks like this:

```
Welcome to Typing Speed

Hi username-abc123,

Your account has been created. Use the credentials below to log in:

┌─────────────────────────────┐
│ Username: username-abc123   │
│ Password: xYz9AbC2DeF4Gh     │
└─────────────────────────────┘

For security, please change your password after first login.

— Typing Speed Team
```

---

## 🎨 Customize Email Template

Edit `server/src/email.js` to customize the email:

```javascript
async sendCredentialsEmail({ to, username, password }) {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;text-align:center;color:white">
        <h1 style="margin:0">🎯 Typing Speed Game</h1>
      </div>
      <div style="padding:30px;background:#f9fafb">
        <h2>Welcome, ${username}!</h2>
        <p>Your account has been successfully created.</p>
        
        <div style="background:white;border:2px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0">
          <h3 style="margin-top:0;color:#667eea">Your Login Credentials:</h3>
          <p style="font-size:16px">
            <strong>Username:</strong> <code style="background:#f3f4f6;padding:4px 8px;border-radius:4px">${username}</code>
          </p>
          <p style="font-size:16px">
            <strong>Password:</strong> <code style="background:#f3f4f6;padding:4px 8px;border-radius:4px">${password}</code>
          </p>
        </div>
        
        <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:20px 0">
          <p style="margin:0"><strong>⚠️ Security Tip:</strong> Please change your password after your first login for better security.</p>
        </div>
        
        <p>Start improving your typing speed now!</p>
        <a href="https://your-frontend.vercel.app" style="display:inline-block;background:#667eea;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:20px">
          Go to Typing Speed Game →
        </a>
      </div>
      <div style="padding:20px;text-align:center;color:#6b7280;font-size:12px">
        <p>This is an automated email. Please do not reply.</p>
        <p>— Typing Speed Team</p>
      </div>
    </div>
  `;
  
  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: "🎯 Your Typing Speed Game Login Credentials",
    html,
  });
}
```

---

## 🐛 Troubleshooting

### "Missing SMTP configuration"
- Check all email variables are in `.env` file
- Restart server after adding variables

### "Invalid login credentials"
- For Gmail: Use App Password, not regular password
- Verify 2FA is enabled
- Check password has no spaces

### "Connection timeout"
- Check firewall isn't blocking port 587
- Try port 465 with `secure: true`
- Verify SMTP_HOST is correct

### "Email not received"
- Check spam folder
- Verify email address is correct
- Check SMTP credentials are correct
- Test with different email provider

---

## ✅ Quick Checklist

- [ ] 2FA enabled on email account
- [ ] App Password generated (for Gmail)
- [ ] `.env` file has all SMTP variables
- [ ] Server restarted after adding variables
- [ ] Test registration endpoint
- [ ] Email received successfully

---

## 🚀 Production Setup

For production, use a dedicated email service:

### Option 1: SendGrid (Free tier: 100 emails/day)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### Option 2: Mailgun (Free tier: 5,000 emails/month)
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
FROM_EMAIL=noreply@yourdomain.com
```

### Option 3: AWS SES (Very cheap)
- Set up in AWS Console
- Get SMTP credentials
- Use same format as above

---

## 📝 Complete .env Example

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed

# Server
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
```

---

**Your email system is ready! Users will automatically receive their credentials via email when they register.** 📧✨

