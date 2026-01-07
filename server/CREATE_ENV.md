# 🔧 Create .env File - Quick Guide

## Your MongoDB Connection String

You provided:
```
mongodb+srv://parthdarjin_db_user:<db_password>@cluster0.r62lyoy.mongodb.net/?appName=Cluster0
```

## ✅ Create .env File

**Create a file named `.env` in the `server/` folder** with this content:

```env
MONGODB_URI=mongodb+srv://parthdarjin_db_user:YOUR_PASSWORD_HERE@cluster0.r62lyoy.mongodb.net/typing-speed?retryWrites=true&w=majority
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

**Important:**
1. Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password
2. Added database name: `/typing-speed` (before the `?`)
3. Added connection options: `?retryWrites=true&w=majority`

## 📝 Steps

1. **Open `server/` folder**
2. **Create new file** named `.env` (no extension, just `.env`)
3. **Copy this content:**
   ```env
   MONGODB_URI=mongodb+srv://parthdarjin_db_user:YOUR_PASSWORD@cluster0.r62lyoy.mongodb.net/typing-speed?retryWrites=true&w=majority
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   ```
4. **Replace `YOUR_PASSWORD`** with your MongoDB password
5. **Save the file**

## 🚀 Then Start Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
Typing backend listening on http://localhost:4000
```

## ⚠️ Password Special Characters

If your password has special characters like `@`, `#`, `%`, etc., you need to URL-encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- `&` becomes `%26`
- `+` becomes `%2B`
- `=` becomes `%3D`

Or use this online tool: https://www.urlencoder.org/

---

**Once .env is created, start the server!** 🚀



