# 🚀 Backend Setup Guide - Step by Step

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB account (free Atlas account or local MongoDB)

---

## Step 1: Get MongoDB Connection String

### Option A: MongoDB Atlas (Cloud - Recommended) ⭐

1. **Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. **Sign up** for free account (or login)
3. **Create a new cluster:**
   - Click "Create" or "Build a Database"
   - Choose **FREE** tier (M0 Sandbox)
   - Select a cloud provider and region
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `typing-admin` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist IP Address:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your IP: `0.0.0.0/0`
   - Click "Confirm"

6. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your database user password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority`

### Option B: Local MongoDB

1. **Install MongoDB:**
   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Install and start MongoDB service
   - Connection string: `mongodb://localhost:27017/typing-speed`

---

## Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- `express` - Web server
- `mongoose` - MongoDB driver
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `nodemailer` - Email service
- `dotenv` - Environment variables

---

## Step 3: Create Environment File

Create a `.env` file in the `server/` folder:

```bash
cd server
# Create .env file
```

**Copy this template and fill in your values:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority

# Server Configuration
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Email Configuration (for sending credentials)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

### Email Setup (Gmail Example):

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Typing Speed Backend"
   - Copy the 16-character password
   - Use this as `SMTP_PASS`

---

## Step 4: Switch to MongoDB Version

You have two backend files:
- `index.js` - Old Firebase version
- `index.mongodb.js` - New MongoDB version

**Option A: Replace the file (Recommended)**
```bash
cd server
# Backup old Firebase version
mv src/index.js src/index.firebase.js
# Use MongoDB version
mv src/index.mongodb.js src/index.js
```

**Option B: Update package.json**
```json
{
  "scripts": {
    "start": "node src/index.mongodb.js",
    "dev": "nodemon --quiet src/index.mongodb.js"
  }
}
```

---

## Step 5: Test the Backend

### Start the server:

```bash
cd server
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
Typing backend listening on http://localhost:4000
Using MongoDB database
```

### Test the API:

**1. Health Check:**
```bash
curl http://localhost:4000/health
```
Should return: `{"status":"ok","service":"typing-backend","database":"mongodb"}`

**2. Test Registration:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

Should return: `{"message":"Credentials sent to email",...}`

**3. Test Progress:**
```bash
# Get progress
curl http://localhost:4000/api/progress-by-email/test@example.com

# Save progress
curl -X POST http://localhost:4000/api/progress-by-email/test@example.com \
  -H "Content-Type: application/json" \
  -d '{"progress":{"easy":{"level1":{"completed":true}}}}}'
```

---

## Step 6: Connect Frontend to Backend

Update your frontend to use the backend API instead of localStorage.

**Create API utility file:** `src/utils/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = {
  async register(name, email) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    return res.json();
  },

  async getProgress(email) {
    const res = await fetch(`${API_BASE_URL}/api/progress-by-email/${email}`);
    return res.json();
  },

  async saveProgress(email, progress) {
    const res = await fetch(`${API_BASE_URL}/api/progress-by-email/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress }),
    });
    return res.json();
  },
};
```

**Add to frontend `.env`:**
```env
VITE_API_URL=http://localhost:4000
```

---

## Step 7: Deploy Backend

### Option A: Railway (Easiest) ⭐

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Add Service** → "Empty Service"
6. **Settings:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
7. **Add Environment Variables:**
   - `MONGODB_URI` (your MongoDB connection string)
   - `PORT` (Railway auto-sets this)
   - `CORS_ORIGIN` (your frontend URL)
   - Email settings (SMTP_HOST, etc.)
8. **Deploy!**

### Option B: Render

1. **Go to [render.com](https://render.com)**
2. **Create New Web Service**
3. **Connect GitHub repository**
4. **Settings:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. **Add Environment Variables** (same as Railway)
6. **Deploy!**

### Option C: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd server
heroku create typing-speed-backend

# Add MongoDB addon (or use your own)
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set MONGODB_URI=your-connection-string
heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app

# Deploy
git push heroku main
```

---

## 📝 Quick Start Checklist

- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] `.env` file created with MongoDB URI
- [ ] Dependencies installed (`npm install`)
- [ ] Switched to MongoDB version (`index.mongodb.js` → `index.js`)
- [ ] Email settings configured (optional for testing)
- [ ] Server starts successfully (`npm run dev`)
- [ ] Health check works (`/health` endpoint)
- [ ] Test registration works
- [ ] Backend deployed (Railway/Render/Heroku)

---

## 🐛 Troubleshooting

### "MongoDB connection error"
- Check your connection string
- Verify password is correct (no `<password>` placeholder)
- Check IP is whitelisted in Atlas
- Verify database name in connection string

### "Port already in use"
- Change `PORT` in `.env` to different number (e.g., 4001)
- Or kill process using port 4000

### "Email sending fails"
- Check SMTP credentials
- For Gmail: Use App Password, not regular password
- Verify 2FA is enabled

### "CORS errors"
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- For production: `CORS_ORIGIN=https://your-frontend.vercel.app`

---

## 🎯 Next Steps

1. ✅ Backend running locally
2. ✅ Test all endpoints
3. ✅ Connect frontend to backend
4. ✅ Deploy backend
5. ✅ Update frontend API URL for production

---

## 📚 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/register` | Register user (sends email) |
| GET | `/api/progress-by-email/:email` | Get user progress |
| POST | `/api/progress-by-email/:email` | Save user progress |
| GET | `/api/levels` | Get available levels |

---

**Your backend is ready! 🚀**

