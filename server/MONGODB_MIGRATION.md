# 🔄 MongoDB Migration Guide

## What Changed?

✅ **Replaced Firebase with MongoDB**
- Removed: `firebase-admin` SDK
- Added: `mongoose` for MongoDB
- Added: `bcryptjs` for password hashing

## 📦 New Dependencies

```bash
npm install mongoose bcryptjs
npm uninstall firebase-admin
```

## 🗄️ Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  name: String,
  username: String (unique),
  password: String (hashed),
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Progress Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  email: String (indexed),
  progress: {
    easy: { level1: {...}, level2: {...}, level3: {...} },
    medium: { level1: {...}, level2: {...}, level3: {...} },
    hard: { level1: {...}, level2: {...}, level3: {...} },
    impossible: { level1: {...} },
    totalCompleted: Number,
    totalLevels: Number,
    lastPlayed: Date
  },
  updatedAt: Date
}
```

## 🔧 Setup Instructions

### 1. Get MongoDB Connection String

**Option A: MongoDB Atlas (Cloud - Free)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Connection string: `mongodb://localhost:27017/typing-speed`

### 2. Environment Variables

Create/update `.env` file in `server/` folder:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority

# Server
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Email (keep existing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

### 3. Update package.json

The dependencies are already updated. Just run:

```bash
cd server
npm install
```

### 4. Use MongoDB Version

**Option A: Replace the file**
```bash
# Backup old file
mv src/index.js src/index.firebase.js

# Use MongoDB version
mv src/index.mongodb.js src/index.js
```

**Option B: Update package.json script**
```json
{
  "scripts": {
    "start": "node src/index.mongodb.js",
    "dev": "nodemon --quiet src/index.mongodb.js"
  }
}
```

### 5. Test the Server

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
Typing backend listening on http://localhost:4000
Using MongoDB database
```

## 🔄 API Endpoints (Same as Before)

All endpoints work the same way:

- `POST /auth/register` - Register user (now uses MongoDB)
- `GET /api/progress-by-email/:email` - Get progress (now from MongoDB)
- `POST /api/progress-by-email/:email` - Save progress (now to MongoDB)
- `GET /api/levels` - Get levels (unchanged)
- `GET /health` - Health check (now shows "mongodb")

## ✅ Benefits of MongoDB

1. **More Control** - Full control over database structure
2. **Flexible Schema** - Easy to modify data structure
3. **Better Queries** - Rich querying capabilities
4. **No Vendor Lock-in** - Can migrate to any MongoDB provider
5. **Free Tier** - MongoDB Atlas free tier is generous

## 🚀 Deployment

### Deploy Backend to Railway/Render

1. **Railway:**
   - Connect GitHub repo
   - Set `MONGODB_URI` environment variable
   - Deploy!

2. **Render:**
   - Create new Web Service
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Add `MONGODB_URI` environment variable

## 📝 Migration Checklist

- [ ] Install new dependencies (`mongoose`, `bcryptjs`)
- [ ] Remove `firebase-admin` dependency
- [ ] Set up MongoDB (Atlas or local)
- [ ] Add `MONGODB_URI` to `.env`
- [ ] Replace `index.js` with MongoDB version
- [ ] Test registration endpoint
- [ ] Test progress save/load endpoints
- [ ] Deploy backend
- [ ] Update frontend API URL (if needed)

## 🔐 Security Notes

- Passwords are automatically hashed using bcrypt
- Email is stored in lowercase for consistency
- Username is unique and auto-generated
- All user data is validated before saving

