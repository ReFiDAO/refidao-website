# Railway Cloudinary Setup - Step by Step

## Quick Setup Guide

Follow these steps to configure Cloudinary storage for your Ghost deployment on Railway.

## Prerequisites

✅ Cloudinary free account (sign up at https://cloudinary.com/users/register/free)  
✅ Cloudinary credentials (Cloud Name, API Key, API Secret)  
✅ Access to Railway dashboard  

## Step 1: Get Cloudinary Credentials

1. Sign up at https://cloudinary.com/users/register/free (if not done)
2. Log into Cloudinary dashboard
3. Copy these values from the dashboard:
   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 2: Add Dockerfile to Railway Project

### Option A: Via Railway Dashboard (Recommended)

1. Go to Railway dashboard: https://railway.app
2. Select your Ghost project: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
3. Go to **Settings** → **Source**
4. If using GitHub deployment:
   - Add `Dockerfile` to your repository
   - Railway will auto-detect and use it
5. If using Railway's direct deployment:
   - Upload `Dockerfile` via Railway dashboard
   - Or create it in the project root

### Option B: Copy Dockerfile Content

The Dockerfile is located at:
`docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/Dockerfile`

Copy this file to your Railway project root, or create it with this content:

```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
EXPOSE 2368
CMD ["node", "current/index.js"]
```

## Step 3: Configure Railway Environment Variables

1. Go to Railway dashboard
2. Select your Ghost project
3. Go to **Variables** tab
4. Add these environment variables:

```bash
storage__active=cloudinary
storage__cloudinary__cloud_name=YOUR_CLOUD_NAME_HERE
storage__cloudinary__api_key=YOUR_API_KEY_HERE
storage__cloudinary__api_secret=YOUR_API_SECRET_HERE
```

**Important:** 
- Replace `YOUR_CLOUD_NAME_HERE`, `YOUR_API_KEY_HERE`, and `YOUR_API_SECRET_HERE` with your actual Cloudinary credentials
- Use double underscores (`__`) between nested config keys
- No spaces around the `=` sign

## Step 4: Redeploy Ghost Service

1. After adding the Dockerfile and environment variables:
2. Go to **Deployments** tab in Railway
3. Click **Redeploy** or Railway will auto-redeploy
4. Wait for deployment to complete (2-5 minutes)

## Step 5: Verify Cloudinary is Working

1. Go to Ghost Admin: https://ghost-production-616f.up.railway.app/ghost
2. Navigate to **Settings → Labs**
3. Try uploading a test image
4. Check the image URL - it should be:
   - `res.cloudinary.com/your-cloud-name/...` ✅ (Cloudinary)
   - NOT `ghost-production-616f.up.railway.app/content/images/...` ❌ (Local)

## Step 6: Resume Image Migration

Once Cloudinary is verified working:

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node upload-ghost-images.js \
  https://ghost-production-616f.up.railway.app \
  6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
  downloaded-images
```

Images will now upload to Cloudinary without storage limits! 🎉

## Troubleshooting

### Images Still Uploading Locally

**Problem:** Ghost still using Railway storage

**Solutions:**
1. Verify environment variables are set correctly (check spelling)
2. Ensure Dockerfile includes `npm install ghost-storage-cloudinary`
3. Check Railway deployment logs for errors
4. Restart Railway service
5. Verify Cloudinary credentials are correct

### Storage Adapter Not Found

**Problem:** `Cannot find module 'ghost-storage-cloudinary'`

**Solutions:**
1. Check Dockerfile includes installation step
2. Rebuild Docker image (redeploy)
3. Check Railway build logs for npm install errors

### Environment Variables Not Working

**Problem:** Ghost not reading storage config

**Solutions:**
1. Use exact format: `storage__active=cloudinary` (double underscore)
2. Ensure all four variables are set:
   - `storage__active`
   - `storage__cloudinary__cloud_name`
   - `storage__cloudinary__api_key`
   - `storage__cloudinary__api_secret`
3. Restart service after adding variables
4. Check variable names match exactly (case-sensitive)

### Deployment Fails

**Problem:** Railway deployment fails

**Solutions:**
1. Check Dockerfile syntax is correct
2. Verify Ghost base image is available
3. Check Railway logs for specific errors
4. Ensure npm install completes successfully

## Verification Checklist

- [ ] Cloudinary account created
- [ ] Credentials copied from dashboard
- [ ] Dockerfile added to Railway project
- [ ] Environment variables set in Railway
- [ ] Service redeployed successfully
- [ ] Test image uploads to Cloudinary
- [ ] Image URL shows `res.cloudinary.com`
- [ ] Ready to resume image migration

## Next Steps After Setup

1. ✅ Verify Cloudinary is working
2. ✅ Resume image upload script
3. ✅ Update image references in posts
4. ✅ Test image loading on site
5. ✅ Monitor Cloudinary usage (should stay within free tier)

## Support Resources

- Cloudinary Docs: https://cloudinary.com/documentation
- Ghost Storage: https://ghost.org/docs/storage/
- Railway Docs: https://docs.railway.app
- Cloudinary Setup Guide: `CLOUDINARY-SETUP.md`
