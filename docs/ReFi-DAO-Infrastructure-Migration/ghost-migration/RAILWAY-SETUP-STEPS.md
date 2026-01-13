# Railway Setup Steps - Cloudinary Configuration

## Your Cloudinary Credentials (Configured)

✅ Cloud Name: `dvrjmfhzw`  
✅ API Key: `416117346651538`  
✅ API Secret: `REDACTED_CLOUDINARY_API_SECRET` (configured)

## Step-by-Step Railway Configuration

### Step 1: Add Environment Variables to Railway

1. **Go to Railway Dashboard**
   - Open https://railway.app
   - Log in if needed

2. **Select Your Ghost Project**
   - Project ID: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
   - Or find "Ghost" project in your dashboard

3. **Go to Variables Tab**
   - Click on your Ghost service
   - Click **Variables** tab (or **Settings → Variables**)

4. **Add These 4 Variables**
   Copy and paste each line exactly as shown:

   ```
   storage__active=cloudinary
   storage__cloudinary__cloud_name=dvrjmfhzw
   storage__cloudinary__api_key=416117346651538
   storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET
   ```

   **Important:**
   - Add each line as a separate variable
   - Use double underscores (`__`) - not single underscores
   - No spaces around the `=` sign
   - Copy the values exactly as shown above

5. **Save Variables**
   - Click **Save** or Railway will auto-save
   - Variables are now configured ✅

### Step 2: Add Dockerfile to Railway

You have two options:

#### Option A: If Railway is Connected to GitHub (Recommended)

1. **Copy Dockerfile to Repository**
   - The Dockerfile is at: `docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/Dockerfile`
   - Copy it to your Railway project's repository root
   - Commit and push to GitHub
   - Railway will auto-detect and use it

#### Option B: If Railway is Direct Deployment

1. **Go to Railway Dashboard**
   - Select your Ghost service
   - Go to **Settings → Source**

2. **Add Dockerfile**
   - Click **New File** or **Edit Source**
   - Create file named `Dockerfile`
   - Paste this content:

   ```dockerfile
   FROM ghost:latest
   RUN npm install ghost-storage-cloudinary --save
   EXPOSE 2368
   CMD ["node", "current/index.js"]
   ```

   - Save the file

### Step 3: Redeploy Service

1. **Trigger Redeployment**
   - Railway will auto-redeploy when Dockerfile is added
   - Or manually click **Redeploy** button
   - Wait 2-5 minutes for deployment to complete

2. **Monitor Deployment**
   - Watch the deployment logs
   - Should see: `npm install ghost-storage-cloudinary`
   - Should complete successfully

### Step 4: Verify Cloudinary is Working

#### Option A: Test in Ghost Admin

1. Go to: https://ghost-production-616f.up.railway.app/ghost
2. Log into Ghost admin
3. Go to **Settings → Labs** (or any post editor)
4. Upload a test image
5. Check the image URL:
   - ✅ Should be: `res.cloudinary.com/dvrjmfhzw/...`
   - ❌ Should NOT be: `ghost-production-616f.up.railway.app/content/images/...`

#### Option B: Run Verification Script

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node verify-cloudinary-setup.js
```

Should show: `✅ Cloudinary storage is working!`

### Step 5: Resume Image Migration

Once Cloudinary is verified working:

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node upload-ghost-images.js \
  https://ghost-production-616f.up.railway.app \
  6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
  downloaded-images
```

Images will now upload to Cloudinary - no storage limits! 🎉

## Troubleshooting

### Variables Not Working?

1. Check variable names use double underscores (`__`)
2. Verify all 4 variables are added
3. Ensure no extra spaces around `=`
4. Restart service after adding variables

### Dockerfile Not Detected?

1. Ensure Dockerfile is in project root
2. Check file is named exactly `Dockerfile` (capital D, no extension)
3. Verify Railway is connected to correct repository
4. Try manual redeploy

### Images Still Uploading Locally?

1. Verify environment variables are set correctly
2. Check Railway logs for errors
3. Ensure service was redeployed after changes
4. Try uploading a new test image

## Security Reminder

⚠️ **Important:** The file `railway-env-vars-CONFIGURED.txt` contains your API Secret.  
- Keep it private
- Don't commit to public repositories
- Consider deleting it after setup is complete

## Next Steps After Setup

1. ✅ Cloudinary configured
2. ✅ Test image uploads to Cloudinary
3. ⏭️ Resume image migration (upload all images)
4. ⏭️ Update image references in posts
5. ⏭️ Complete theme migration
6. ⏭️ Complete settings migration
7. ⏭️ DNS cutover

## Need Help?

- Check Railway deployment logs
- Run verification script: `node verify-cloudinary-setup.js`
- See `railway-cloudinary-setup.md` for detailed troubleshooting
