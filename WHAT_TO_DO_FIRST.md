# 🎯 What To Do First - Priority Order

## ✅ Current Status

- ✅ Frontend deployed on Vercel
- ✅ Backend code ready (MongoDB version exists)
- ⚠️ Backend not set up yet
- ⚠️ Frontend not connected to backend

---

## 🚀 Priority Order (Do This First!)

### **STEP 1: Set Up Backend Locally** ⭐ (Do This First!)

**Goal:** Get backend running on your computer

1. **Get MongoDB:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up → Create FREE cluster
   - Create database user
   - Get connection string

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cd server
   # Create .env file with:
   ```
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-speed?retryWrites=true&w=majority
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Switch to MongoDB version:**
   ```bash
   cd server
   mv src/index.js src/index.firebase.js
   mv src/index.mongodb.js src/index.js
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```

6. **Test it:**
   - Open: http://localhost:4000/health
   - Should show: `{"status":"ok","database":"mongodb"}`

**✅ Done when:** Backend runs on `http://localhost:4000`

---

### **STEP 2: Set Up Email (Optional but Recommended)**

**Goal:** Send username/password emails to users

1. **Gmail Setup:**
   - Enable 2FA on Gmail
   - Generate App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

2. **Add to `.env`:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

3. **Test email:**
   ```bash
   curl -X POST http://localhost:4000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"your-email@gmail.com"}'
   ```

**✅ Done when:** You receive test email with credentials

---

### **STEP 3: Connect Frontend to Backend**

**Goal:** Make frontend use backend API instead of localStorage

1. **Create API utility:**
   - File: `src/utils/api.js`
   - Add API functions to call backend

2. **Update frontend:**
   - Replace localStorage calls with API calls
   - Add API URL to `.env`

3. **Test:**
   - Register user from frontend
   - Check if progress saves to MongoDB

**✅ Done when:** Frontend saves/loads data from backend

---

### **STEP 4: Deploy Backend**

**Goal:** Put backend online (Railway/Render)

1. **Choose platform:**
   - Railway (easiest) or Render

2. **Deploy:**
   - Connect GitHub repo
   - Set root directory: `server`
   - Add environment variables
   - Deploy!

3. **Update frontend:**
   - Change API URL to backend URL
   - Redeploy frontend

**✅ Done when:** Backend accessible online

---

## 📋 Quick Checklist

### Phase 1: Backend Setup (Do First!)
- [ ] MongoDB Atlas account created
- [ ] Connection string obtained
- [ ] Backend dependencies installed
- [ ] `.env` file created
- [ ] Switched to MongoDB version
- [ ] Backend runs locally
- [ ] Health check works

### Phase 2: Email Setup
- [ ] Gmail App Password generated
- [ ] Email settings in `.env`
- [ ] Test email received

### Phase 3: Frontend Connection
- [ ] API utility created
- [ ] Frontend calls backend
- [ ] Registration works
- [ ] Progress saves/loads

### Phase 4: Deployment
- [ ] Backend deployed online
- [ ] Frontend updated with backend URL
- [ ] Everything works in production

---

## 🎯 Start Here: Step 1

**Right now, do this:**

1. Open: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create cluster
4. Get connection string
5. Follow Step 1 above

**Time needed:** 10-15 minutes

---

## 📚 Reference Guides

- `server/BACKEND_SETUP.md` - Complete backend guide
- `server/QUICK_START.md` - Quick backend setup
- `server/EMAIL_SETUP.md` - Email configuration
- `server/MONGODB_MIGRATION.md` - MongoDB details

---

**Start with Step 1: Set Up Backend Locally** 🚀

