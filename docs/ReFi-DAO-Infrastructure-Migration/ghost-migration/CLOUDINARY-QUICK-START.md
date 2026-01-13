# Cloudinary Quick Start Guide

## 🚀 Setup in 5 Minutes

Follow these steps to configure Cloudinary storage for Ghost on Railway.

## Step 1: Sign Up for Cloudinary (2 minutes)

1. Go to https://cloudinary.com/users/register/free
2. Sign up with email (no credit card required)
3. Verify your email
4. Log into dashboard and copy these credentials:
   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 2: Add Dockerfile to Railway (1 minute)

### Option A: If Railway is connected to GitHub
1. Copy `Dockerfile` from this directory to your Railway project repository
2. Commit and push - Railway will auto-detect it

### Option B: If Railway is direct deployment
1. Go to Railway dashboard → Your Ghost project
2. Go to **Settings → Source**
3. Upload or create `Dockerfile` with this content:
   ```dockerfile
   FROM ghost:latest
   RUN npm install ghost-storage-cloudinary --save
   EXPOSE 2368
   CMD ["node", "current/index.js"]
   ```

## Step 3: Add Environment Variables (1 minute)

1. Go to Railway dashboard → Your Ghost project
2. Go to **Variables** tab
3. Add these 4 variables (copy from `railway-env-vars-template.txt`):

```bash
storage__active=cloudinary
storage__cloudinary__cloud_name=YOUR_CLOUD_NAME
storage__cloudinary__api_key=YOUR_API_KEY
storage__cloudinary__api_secret=YOUR_API_SECRET
```

**Replace the placeholders with your actual Cloudinary credentials!**

## Step 4: Redeploy (1 minute)

1. Railway will auto-redeploy when you add the Dockerfile
2. Or manually click **Redeploy** in Railway dashboard
3. Wait 2-5 minutes for deployment to complete

## Step 5: Verify It Works (1 minute)

### Option A: Test in Ghost Admin
1. Go to https://ghost-production-616f.up.railway.app/ghost
2. Upload a test image
3. Check image URL - should be `res.cloudinary.com/...` ✅

### Option B: Run Verification Script
```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node verify-cloudinary-setup.js
```

Should show: `✅ Cloudinary storage is working!`

## Step 6: Resume Image Migration

Once verified, upload all images:

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node upload-ghost-images.js \
  https://ghost-production-616f.up.railway.app \
  6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
  downloaded-images
```

Images will upload to Cloudinary - no storage limits! 🎉

## Files Created

- ✅ `Dockerfile` - Custom Ghost image with Cloudinary adapter
- ✅ `railway-cloudinary-setup.md` - Detailed setup guide
- ✅ `railway-env-vars-template.txt` - Environment variables template
- ✅ `verify-cloudinary-setup.js` - Verification script
- ✅ `CLOUDINARY-QUICK-START.md` - This file

## Troubleshooting

### Images Still Uploading Locally?

1. Check environment variables are set correctly
2. Verify Dockerfile includes Cloudinary adapter
3. Ensure service was redeployed after changes
4. Check Railway logs for errors

### Need Help?

- See `railway-cloudinary-setup.md` for detailed troubleshooting
- See `CLOUDINARY-SETUP.md` for comprehensive guide
- Check Railway deployment logs

## What's Next?

1. ✅ Cloudinary configured
2. ✅ Images uploading to Cloudinary
3. ⏭️ Update image references in posts
4. ⏭️ Complete theme migration
5. ⏭️ Complete settings migration
6. ⏭️ DNS cutover

## Cost

**Free Forever:**
- 25GB storage
- 25GB bandwidth/month
- CDN included
- Image optimization included

Your 1,838 images (~500MB-1GB) will stay well within the free tier! 🎉
