# 🚀 Deployment Guide for Typing Speed Game

## Quick Deploy Options

### Option 1: Vercel (Easiest - Recommended) ⭐

**Steps:**
1. **Build your project locally first:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with production files.

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will ask you to login/create account
   - Choose default settings
   - Your site will be live in 2 minutes!

4. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite and deploys automatically

**Advantages:**
- ✅ Free for personal projects
- ✅ Automatic deployments on git push
- ✅ Custom domain support
- ✅ HTTPS automatically
- ✅ Fast CDN

---

### Option 2: Netlify

**Steps:**
1. **Build command:** `npm run build`
2. **Publish directory:** `dist`

**Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy
netlify deploy --prod  # For production
```

**Via Netlify Dashboard:**
- Go to [netlify.com](https://netlify.com)
- Drag and drop your `dist` folder
- Or connect GitHub repo for auto-deploy

---

### Option 3: GitHub Pages

**Steps:**
1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Update vite.config.js:**
   ```js
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     base: '/typing/', // Replace 'typing' with your repo name
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Select `gh-pages` branch
   - Your site: `https://yourusername.github.io/typing/`

---

### Option 4: Firebase Hosting

**Steps:**
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```
   - Select existing project or create new
   - Public directory: `dist`
   - Single-page app: Yes
   - Don't overwrite index.html: No

3. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

---

## Before Deploying - Important Checks ✅

### 1. Set Admin Mode to FALSE
In `src/pages/Levels.jsx`, line 6:
```javascript
const ADMIN_MODE_UNLOCK_IMPOSSIBLE = false; // ✅ Set to false for production
```

### 2. Test Build Locally
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173` to test production build.

### 3. Check for Errors
- Open browser console (F12)
- Check for any errors
- Test all routes work correctly

### 4. Environment Variables (if needed)
If you have API keys or secrets:
- Create `.env.production` file
- Use `import.meta.env.VITE_YOUR_VAR` in code
- Add `.env.production` to `.gitignore` (but document needed vars)

---

## Recommended: Vercel Deployment (Step-by-Step)

### Method A: Via GitHub (Auto-Deploy)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/typing-speed-game.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

3. **Future Updates:**
   - Just push to GitHub
   - Vercel automatically redeploys

### Method B: Via Vercel CLI

1. **Install and login:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - First deploy is preview
   - Run `vercel --prod` for production

---

## Post-Deployment Checklist

- [ ] Test all routes work
- [ ] Test Impossible level unlock logic (should be locked)
- [ ] Check mobile responsiveness
- [ ] Test localStorage (progress saving)
- [ ] Verify all images/assets load
- [ ] Check console for errors
- [ ] Test on different browsers

---

## Troubleshooting

### Build Fails
- Check for TypeScript/ESLint errors
- Run `npm run lint` to find issues
- Make sure all dependencies are in `package.json`

### Routes Not Working (404)
- For Vite: Add `_redirects` file in `public/`:
  ```
  /*    /index.html   200
  ```
- Or configure server to serve `index.html` for all routes

### Assets Not Loading
- Check `vite.config.js` base path
- Ensure all assets are in `public/` or imported correctly

---

## Quick Commands Reference

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod

# Deploy to GitHub Pages
npm run deploy
```

---

## Best Practice: Use Vercel

**Why Vercel?**
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Free tier is generous
- ✅ Fast global CDN
- ✅ Auto-deploy on git push
- ✅ Preview deployments for PRs
- ✅ Custom domains free

**Get Started:**
1. Push code to GitHub
2. Connect to Vercel
3. Deploy in 2 minutes!

