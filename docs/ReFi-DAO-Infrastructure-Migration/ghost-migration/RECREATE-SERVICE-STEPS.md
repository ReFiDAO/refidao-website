# Steps to Recreate Ghost Service with Cloudinary

## Current Problem

- ✅ Cloudinary environment variables are set
- ❌ Cloudinary adapter NOT installed (Dockerfile not being used)
- ❌ ENOSPC errors (volume full)
- ❌ Service crashing on startup

## Solution: Recreate Service with Correct Configuration

### Step 1: Export Current Configuration ✅

Variables have been exported to: `railway-vars-current.txt`

### Step 2: Create New Ghost Service in Railway Dashboard

1. **Go to Railway Dashboard:**
   - Project: "ReFi Blog"
   - Environment: "production"

2. **Click "+ New" → "Service"**

3. **Select "GitHub Repo"**

4. **Configure Repository:**
   - Repository: `ReFiDAO/ReFi-DAO-Website`
   - **Root Directory:** `ghost-railway` ⚠️ **IMPORTANT**
   - **Branch:** `docs` (or `main` if Dockerfile is there)
   - Service Name: `ghost-new` (or any name)

5. **Railway will automatically:**
   - Detect `ghost-railway/Dockerfile`
   - Build with Cloudinary adapter
   - Deploy the service

### Step 3: Set Environment Variables

After the service is created, set all environment variables:

**Via Railway Dashboard:**
1. Go to new service → "Variables" tab
2. Add all variables from `railway-vars-current.txt`
3. **Make sure these Cloudinary variables are set:**
   - `storage__active=cloudinary`
   - `storage__cloudinary__cloud_name=dvrjmfhzw`
   - `storage__cloudinary__api_key=416117346651538`
   - `storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET`

**Or via CLI (after linking to new service):**
```bash
railway link -p <new-service-id>
railway variables set storage__active=cloudinary
railway variables set storage__cloudinary__cloud_name=dvrjmfhzw
railway variables set storage__cloudinary__api_key=416117346651538
railway variables set storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET
# ... add all other variables from railway-vars-current.txt
```

### Step 4: Connect to Same MySQL Database

1. **Note the database connection details** from the old service
2. **In new service**, set the same database variables:
   - `database__client=mysql`
   - `database__connection__host=<same-host>`
   - `database__connection__port=<same-port>`
   - `database__connection__user=<same-user>`
   - `database__connection__password=<same-password>`
   - `database__connection__database=<same-database>`

### Step 5: Monitor Deployment

**Via CLI:**
```bash
railway link -p <new-service-id>
railway logs --follow
```

**Look for:**
- ✅ `npm install ghost-storage-cloudinary` in build logs
- ✅ Build completes successfully
- ✅ Ghost starts without ENOSPC errors
- ✅ Cloudinary adapter initialized

### Step 6: Verify Cloudinary is Working

**Check logs for Cloudinary:**
```bash
railway logs --tail 100 | grep -i cloudinary
```

**Test image upload:**
- Go to Ghost Admin: `https://<new-service-url>/ghost`
- Upload a test image
- Check Cloudinary dashboard to confirm it's stored there
- Verify image displays correctly on site

### Step 7: Update DNS (When Ready)

Once new service is verified:
1. Update DNS to point to new service URL
2. Or update Railway custom domain to point to new service

### Step 8: Delete Old Service

**After everything is verified:**
1. Go to old "ghost" service
2. Settings → Danger Zone → Delete Service
3. **Note:** Database is separate, so it's safe to delete

## Why This Works

- ✅ **Fresh volume** = no storage issues
- ✅ **Cloudinary configured** = all new uploads go to Cloudinary
- ✅ **Database separate** = all content safe
- ✅ **Same configuration** = everything works identically
- ✅ **Dockerfile used** = Cloudinary adapter installed

## Quick Checklist

- [ ] Variables exported to `railway-vars-current.txt`
- [ ] New service created with Root Directory: `ghost-railway`
- [ ] Branch set correctly (`docs` or `main`)
- [ ] All environment variables copied to new service
- [ ] Database connection configured
- [ ] Deployment successful (check build logs)
- [ ] Cloudinary adapter installed (check logs)
- [ ] No ENOSPC errors
- [ ] Test image upload works
- [ ] Old service deleted (after verification)
