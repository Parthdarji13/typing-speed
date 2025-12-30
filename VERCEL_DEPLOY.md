# 🚀 Deploy to Vercel - Step by Step Guide

## ✅ Your Project is Already Configured!

You already have `vercel.json` with SPA routing configured - perfect!

---

## Method 1: Deploy via Vercel Website (Easiest) ⭐

### Step 1: Push to GitHub (if not already done)

```bash
# Check if you have a remote
git remote -v

# If no remote, add one:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code
git add .
git commit -m "Ready for deployment"
git push --set-upstream origin main
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up or log in (use GitHub account for easy connection)

2. **Click "Add New Project"**
   - Or click "Import Project" if you see it

3. **Import Your GitHub Repository**
   - Select your repository from the list
   - Or paste the GitHub URL

4. **Configure Project Settings**
   Vercel will auto-detect:
   - ✅ Framework Preset: **Vite**
   - ✅ Build Command: `npm run build` (auto-detected)
   - ✅ Output Directory: `dist` (auto-detected)
   - ✅ Install Command: `npm install` (auto-detected)

   **You don't need to change anything!** Just click **"Deploy"**

5. **Wait for Deployment**
   - Build takes 1-3 minutes
   - You'll see build logs in real-time
   - When done, you'll get a live URL like: `https://your-project-name.vercel.app`

6. **Done! 🎉**
   - Your site is live!
   - Every time you push to GitHub, Vercel auto-deploys

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```
- This opens browser for authentication

### Step 3: Deploy

```bash
# First deployment (preview)
vercel

# Production deployment
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (first time)
- Project name? (Press Enter for default)
- Directory? (Press Enter for current directory)
- Override settings? **No**

### Step 4: Your Site is Live!

You'll get a URL like: `https://your-project-name.vercel.app`

---

## ✅ Pre-Deployment Checklist

- [x] Admin mode set to `false` in `Levels.jsx`
- [x] `vercel.json` exists with SPA routing
- [x] `package.json` has build script
- [ ] Code pushed to GitHub
- [ ] Test build locally: `npm run build`

---

## 🧪 Test Build Locally First

Before deploying, test your production build:

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` and test:
- All routes work
- Impossible level is locked (admin mode off)
- Progress saving works
- No console errors

---

## 📝 Your Current Configuration

✅ **vercel.json** - Already configured for SPA routing
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ **package.json** - Has build script
```json
"scripts": {
  "build": "vite build"
}
```

✅ **vite.config.js** - Standard Vite config (no changes needed)

---

## 🎯 Quick Deploy Commands

```bash
# 1. Build locally (test first)
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 3. Deploy to Vercel (choose one method)
# Method A: Via website (recommended)
# - Go to vercel.com and import repo

# Method B: Via CLI
vercel --prod
```

---

## 🔄 Auto-Deployments

Once connected to GitHub:
- ✅ Every `git push` to main branch = automatic deployment
- ✅ Pull requests = preview deployments
- ✅ Instant rollback if needed

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. Free SSL certificate automatically!

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally to see errors
- Fix any TypeScript/ESLint errors

### Routes Return 404
- ✅ Your `vercel.json` already handles this!
- If still issues, check that rewrites are correct

### Assets Not Loading
- Check `vite.config.js` - no base path needed for Vercel
- Ensure all assets are in `public/` folder

### Environment Variables
- Go to Vercel Dashboard → Settings → Environment Variables
- Add any needed variables
- Redeploy after adding

---

## 📊 Deployment Status

After deployment, you can:
- View deployment logs
- See deployment history
- Rollback to previous version
- View analytics
- Set up custom domain

---

## 🎉 You're All Set!

Your project is ready to deploy. Just:
1. Push to GitHub
2. Import to Vercel
3. Deploy!

**Estimated time: 5 minutes** ⚡

