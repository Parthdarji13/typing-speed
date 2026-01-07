# ⚡ Setup MongoDB Connection - Right Now!

## ✅ What You Have

- ✅ Mongoose installed
- ✅ MongoDB connection code (`mongodb.js`)
- ✅ MongoDB server file (`index.mongodb.js`)
- ✅ User and Progress models

## 🎯 What To Do Now

### Step 1: Create `.env` File

Create `server/.env` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

**Replace:**
- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password
- `cluster.mongodb.net` - Your cluster URL

### Step 2: Switch to MongoDB Version

```bash
cd server
# Backup Firebase version
mv src/index.js src/index.firebase.js
# Use MongoDB version
mv src/index.mongodb.js src/index.js
```

### Step 3: Install Dependencies (if not done)

```bash
cd server
npm install
```

### Step 4: Start Server

```bash
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
Typing backend listening on http://localhost:4000
Using MongoDB database
```

### Step 5: Test Connection

Open browser: http://localhost:4000/health

Should return:
```json
{
  "status": "ok",
  "service": "typing-backend",
  "database": "mongodb"
}
```

---

## 🐛 If Connection Fails

### Error: "MONGODB_URI environment variable is required"
- Check `.env` file exists in `server/` folder
- Check `MONGODB_URI` is spelled correctly
- Restart server after creating `.env`

### Error: "MongoServerError: Authentication failed"
- Check username and password in connection string
- Verify password has no special characters (or URL-encode them)
- Check database user exists in MongoDB Atlas

### Error: "MongoNetworkError"
- Check IP is whitelisted in MongoDB Atlas
- Go to Network Access → Add IP Address → `0.0.0.0/0` (allow all)

---

## ✅ Success Checklist

- [ ] `.env` file created with `MONGODB_URI`
- [ ] Switched to MongoDB version (`index.mongodb.js` → `index.js`)
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] See "✅ Connected to MongoDB" message
- [ ] Health check returns `{"database":"mongodb"}`

---

**Once you see "✅ Connected to MongoDB", you're ready!** 🎉



