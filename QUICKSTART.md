# 🚀 Quick Start: Deploy MOLECULAI

Choose your deployment method:

## ⚡ Fastest: One-Click Vercel Deploy (Recommended)

1. Click this button:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaakaind/MOLECULAI.github.io)

2. Connect your GitHub account

3. Configure:
   - Project name: `moleculai` (or your choice)
   - Environment variable: `JWT_SECRET=your-secure-32-char-secret`

4. Click **Deploy**

5. ✅ Done! Your site will be live at `moleculai-xyz.vercel.app`

**Time: ~2 minutes**

---

## 🔧 Manual Vercel Deploy

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

### Steps

1. **Fork or Clone this repository**

2. **Validate deployment setup**
   ```bash
   npm install
   npm run validate
   ```

3. **Go to [vercel.com](https://vercel.com)**
   - Click "Add New Project"
   - Import your repository
   - Vercel auto-detects configuration

4. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `JWT_SECRET` = `<your-secure-secret>`
   - Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

5. **Deploy**
   - Click "Deploy"
   - Wait ~1-2 minutes
   - ✅ Your site is live!

**Time: ~5 minutes**

---

## 🌐 GitHub Pages (Static Only)

Already configured! Just push to `main` branch.

**Features:**
- ✅ Molecule visualization
- ❌ No authentication
- ❌ Cannot save work

**URL:** `https://your-username.github.io/MOLECULAI.github.io/`

**Time: ~30 seconds**

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `npm install` runs successfully
- [ ] `npm test` passes
- [ ] `npm run validate` passes
- [ ] You have a secure `JWT_SECRET` ready (32+ characters)

---

## 🔑 Generate JWT Secret

```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 32

# Method 3: Online (less secure)
# Visit: https://www.uuidgenerator.net/
```

**⚠️ Important:** Never commit your JWT secret to Git!

---

## 🧪 Test Your Deployment

After deploying, test these endpoints:

```bash
# Replace YOUR_URL with your actual deployment URL

# Health check
curl https://YOUR_URL.vercel.app/api/health

# Get molecules
curl https://YOUR_URL.vercel.app/api/molecules

# Get specific molecule
curl https://YOUR_URL.vercel.app/api/molecules?id=water
```

Expected response from health:
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T...",
  "environment": "vercel-serverless"
}
```

---

## 🔄 Update Deployment

To update your deployed application:

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Vercel auto-deploys** (if connected to GitHub)

Or redeploy manually:
```bash
vercel --prod
```

---

## 🆘 Troubleshooting

### Issue: API returns 404
- **Solution**: Check `vercel.json` is properly configured
- Verify API files are in `/api` directory

### Issue: "JWT_SECRET must be set"
- **Solution**: Add `JWT_SECRET` in Vercel Dashboard → Project Settings → Environment Variables

### Issue: Molecules don't load
- **Solution**: 
  - Check `/api/molecules` endpoint works
  - Verify `mcp-server` directory is included in deployment
  - For GitHub Pages: Uses embedded data (automatic)

### Issue: Authentication doesn't work
- **Solution**: Auth is only available on full-stack deployments (Vercel, not GitHub Pages)

---

## 📚 Need More Help?

- **Detailed Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Testing Guide:** [TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md)
- **Main README:** [README.md](README.md)
- **GitHub Issues:** [Report a problem](https://github.com/aaakaind/MOLECULAI.github.io/issues)

---

## 🎯 What's Included

After deployment, you'll have:

- ✅ Molecular visualization with 3D graphics
- ✅ Multiple molecule database
- ✅ Various rendering styles
- ✅ User authentication (Vercel only)
- ✅ Save/load visualizations (Vercel only)
- ✅ REST API for molecule data
- ✅ Automatic HTTPS
- ✅ CDN distribution

---

## 🎉 Success!

Once deployed:
1. Visit your URL
2. Try viewing different molecules
3. Register an account (Vercel deployment)
4. Save your favorite views
5. Share with colleagues!

**Enjoy MOLECULAI! 🧪**
