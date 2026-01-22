# Railway Configuration Steps - Final Setup

## ✅ What's Done

- ✅ `ghost-railway/Dockerfile` created and pushed to GitHub
- ✅ Cloudinary environment variables already set in Railway
- ✅ Ready to configure Railway

## 🎯 Next Steps in Railway Dashboard

### Step 1: Disconnect Docker Image Source

1. Go to Railway dashboard → Your Ghost service
2. **Settings** → **Source** tab
3. Find "Source Image: ghost:alpine"
4. Click **"Disconnect"** button
5. Railway will switch to GitHub source (already connected)

### Step 2: Set Root Directory

1. Still in **Settings** → **Source** tab
2. Find **"Root Directory"** field (currently shows `/`)
3. Change it to: `ghost-railway`
4. Click **Save** or Railway will auto-save

### Step 3: Verify Branch

1. Check **"Branch connected to production"**
2. Should be set to `docs` (where we pushed the directory)
3. If it's `main`, change it to `docs` using the dropdown

### Step 4: Railway Auto-Deploys

- Railway will detect the changes
- It will look for `Dockerfile` in `ghost-railway/` directory
- Build will start automatically
- Watch deployment logs for:
  - ✅ `Building from Dockerfile`
  - ✅ `npm install ghost-storage-cloudinary`
  - ✅ Build completes successfully

### Step 5: Verify Cloudinary

Once deployment completes:

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node test-cloudinary-upload.js
```

Or test in Ghost admin - upload an image and check if URL is `res.cloudinary.com/...`

---

## Why This is Safe

- ✅ **Doesn't break anything:** Quartz Dockerfile stays untouched
- ✅ **Clean separation:** Ghost has its own directory
- ✅ **Uses Railway feature:** Root Directory is designed for this
- ✅ **Reversible:** Can always change Root Directory back or reconnect Docker image
- ✅ **No conflicts:** Website and Ghost deployments completely separate

---

## Troubleshooting

### Railway Doesn't Detect Dockerfile?

1. Check Root Directory is set to `ghost-railway` (not `ghost-railway/`)
2. Verify branch is `docs` (where we pushed)
3. Check deployment logs for errors

### Build Fails?

1. Check logs for specific errors
2. Verify Dockerfile syntax
3. Check if `npm install ghost-storage-cloudinary` runs

### Service Won't Start?

1. Check environment variables are still set
2. Verify Cloudinary credentials are correct
3. Check Railway logs for startup errors

---

## Summary

**What to do now:**
1. Railway → Settings → Source
2. Disconnect `ghost:alpine`
3. Set Root Directory to `ghost-railway`
4. Set branch to `docs` (if not already)
5. Wait for deployment
6. Test Cloudinary!

**Files ready:**
- ✅ `ghost-railway/Dockerfile` - Pushed to `docs` branch
- ✅ Environment variables - Already set in Railway
- ✅ Ready to deploy!

Let me know once you've configured Railway and we'll verify Cloudinary is working! 🚀
