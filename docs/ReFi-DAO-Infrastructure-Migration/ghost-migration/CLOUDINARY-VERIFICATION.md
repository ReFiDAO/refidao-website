# Cloudinary Verification Steps

## Current Status

You've completed:
- ✅ Signed up for Cloudinary
- ✅ Added environment variables to Railway
- ✅ Redeployed service

## Next Steps to Verify

### Step 1: Check Railway Deployment Status

1. Go to Railway dashboard: https://railway.app
2. Select your Ghost project
3. Check **Deployments** tab:
   - Is deployment showing as "Active" or "Building"?
   - Check logs for any errors
   - Look for: `npm install ghost-storage-cloudinary` in logs

### Step 2: Verify Environment Variables

In Railway dashboard → Variables, confirm these are set:
- ✅ `storage__active=cloudinary`
- ✅ `storage__cloudinary__cloud_name=dvrjmfhzw`
- ✅ `storage__cloudinary__api_key=416117346651538`
- ✅ `storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET`

### Step 3: Check Dockerfile

Ensure Dockerfile is present in Railway project:
- Should contain: `RUN npm install ghost-storage-cloudinary --save`
- Railway should detect it automatically

### Step 4: Test Cloudinary Upload

Once deployment is complete:

**Option A: Test via Ghost Admin (Easiest)**
1. Go to: https://ghost-production-616f.up.railway.app/ghost
2. Log into Ghost admin
3. Go to any post editor or Settings → Labs
4. Upload a test image
5. Check the image URL:
   - ✅ **Success:** URL should be `res.cloudinary.com/dvrjmfhzw/...`
   - ❌ **Not working:** URL would be `ghost-production-616f.up.railway.app/content/images/...`

**Option B: Test via Script**
```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node test-cloudinary-upload.js
```

## Troubleshooting

### Service Returns 502 Error

**Possible causes:**
1. Service is still deploying (wait 2-5 minutes)
2. Service crashed due to configuration error
3. Dockerfile issue preventing build

**Solutions:**
1. Check Railway deployment logs
2. Look for errors in build logs
3. Verify Dockerfile syntax is correct
4. Check if `ghost-storage-cloudinary` package installed successfully

### Images Still Uploading Locally

**Check:**
1. Environment variables are set correctly (double underscores)
2. Dockerfile includes Cloudinary adapter installation
3. Service was redeployed after adding variables
4. No errors in Railway logs

**Fix:**
1. Double-check variable names use `__` not `_`
2. Ensure Dockerfile is in project root
3. Redeploy service
4. Test again

### Build Fails

**Check Railway logs for:**
- npm install errors
- Package not found errors
- Syntax errors in Dockerfile

**Fix:**
- Verify Dockerfile content is correct
- Check npm registry is accessible
- Try redeploying

## Once Cloudinary is Verified Working

After confirming images upload to Cloudinary:

1. **Resume Image Migration:**
   ```bash
   cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
   node upload-ghost-images.js \
     https://ghost-production-616f.up.railway.app \
     6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
     downloaded-images
   ```

2. **Update Image References:**
   ```bash
   node update-image-references.js \
     https://ghost-production-616f.up.railway.app \
     6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
     https://blog.refidao.com \
     downloaded-images/upload-report.json
   ```

## What to Check Now

1. ✅ Is Railway deployment showing as "Active"?
2. ✅ Are there any errors in Railway logs?
3. ✅ Can you access Ghost admin at https://ghost-production-616f.up.railway.app/ghost?
4. ✅ If yes, try uploading a test image and check the URL

Let me know what you see in Railway logs or Ghost admin!
