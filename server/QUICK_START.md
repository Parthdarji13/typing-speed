# ⚡ Quick Start - Backend Setup

## 🎯 5-Minute Setup

### 1. Get MongoDB (Free)

**MongoDB Atlas (Cloud):**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster (FREE tier)
4. Create database user (save password!)
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string: Click "Connect" → "Connect your application"
7. Copy string, replace `<password>` with your password

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Create .env File

Create `server/.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### 4. Switch to MongoDB Version

```bash
cd server
# Backup Firebase version
mv src/index.js src/index.firebase.js
# Use MongoDB version
mv src/index.mongodb.js src/index.js
```

### 5. Start Server

```bash
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
Typing backend listening on http://localhost:4000
```

### 6. Test It

Open browser: http://localhost:4000/health

Should show: `{"status":"ok","service":"typing-backend","database":"mongodb"}`

---

## ✅ Done!

Your backend is running! 🎉

**Next:** Connect your frontend to `http://localhost:4000`

---

## 📚 Full Guide

See `BACKEND_SETUP.md` for detailed instructions.

