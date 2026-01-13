# Railway CLI Implementation Status

## ✅ Completed Tasks

### Phase 1: Setup & Verification Scripts

1. **✅ Railway CLI Installation Check**
   - Verified Railway CLI is installed (v4.23.0)
   - Created setup script: `railway-cli-setup.sh`

2. **✅ Verification Script Created**
   - Created `railway-cli-verify.sh` to check:
     - Authentication status
     - Project link
     - Cloudinary environment variables
     - Service status
     - Cloudinary installation in build logs
     - Storage errors (ENOSPC)

3. **✅ Export Script Created**
   - Created `railway-export-vars.sh` to export all environment variables before service recreation

4. **✅ Dockerfile Verified**
   - Confirmed `ghost-railway/Dockerfile` exists and includes Cloudinary adapter installation
   - Dockerfile correctly installs `ghost-storage-cloudinary`

5. **✅ Cloudinary Test Script Created**
   - Created `test-cloudinary-setup.js` to verify Cloudinary is working after fix

6. **✅ Documentation Created**
   - Created `RAILWAY-CLI-GUIDE.md` with comprehensive instructions

## ⏳ Pending Tasks (Require Manual Authentication)

### Task 1.1: Authenticate Railway CLI

**Status:** ⏳ Requires manual execution

**Action Required:**
```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
./railway-cli-setup.sh
```

Or manually:
```bash
railway login
railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97
```

**Why:** Railway CLI requires interactive browser authentication that cannot be automated.

### Task 1.2: Verify Cloudinary Installation

**Status:** ⏳ Waiting for authentication

**After authentication, run:**
```bash
./railway-cli-verify.sh
```

**This will check:**
- ✅ Cloudinary adapter in build logs (`npm install ghost-storage-cloudinary`)
- ✅ Environment variables are set correctly
- ✅ Service status and logs
- ✅ ENOSPC errors

### Task 1.3: Verify Environment Variables

**Status:** ⏳ Waiting for authentication

**After authentication, run:**
```bash
railway variables
```

**Verify these exist:**
- `storage__active=cloudinary`
- `storage__cloudinary__cloud_name=dvrjmfhzw`
- `storage__cloudinary__api_key=416117346651538`
- `storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET`

### Task 1.4: Check Service Status & Logs

**Status:** ⏳ Waiting for authentication

**After authentication, run:**
```bash
railway status
railway logs --follow
```

**Look for:**
- ENOSPC errors
- Cloudinary initialization messages
- Ghost startup errors

## Phase 2: Fix Storage Issue

### Current Status

- **Service Status:** 502 Bad Gateway (crashing)
- **Error:** `ENOSPC: no space left on device`
- **Root Cause:** Railway volume is full from previous image uploads

### Option A: Volume Management (If Available)

**After authentication, check:**
```bash
railway volume --help
```

If volume commands exist, try:
```bash
railway volume list
railway volume inspect <volume-id>
```

**Note:** Railway CLI may not support volume management. If not, proceed to Option B.

### Option B: Recreate Service (Recommended)

**Steps:**

1. **Export current configuration:**
   ```bash
   ./railway-export-vars.sh
   ```

2. **In Railway Dashboard:**
   - Go to project: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
   - Click "+ New" → "Service"
   - Connect to GitHub: `ReFiDAO/ReFi-DAO-Website`
   - Set **Root Directory:** `ghost-railway`
   - Set **Branch:** `docs`
   - Railway will use `ghost-railway/Dockerfile`

3. **Link to new service:**
   ```bash
   railway link -p <new-service-id>
   ```

4. **Set environment variables:**
   ```bash
   railway variables set storage__active=cloudinary
   railway variables set storage__cloudinary__cloud_name=dvrjmfhzw
   railway variables set storage__cloudinary__api_key=416117346651538
   railway variables set storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET
   
   # Copy all other variables from old service
   # (Check Railway dashboard → Variables tab)
   ```

5. **Connect to same MySQL database** (from Railway dashboard)

6. **Deploy:**
   ```bash
   railway up
   ```

7. **Monitor:**
   ```bash
   railway logs --follow
   ```

8. **Verify no ENOSPC errors:**
   ```bash
   railway logs --tail 200 | grep -i "ENOSPC\|no space"
   ```

9. **Delete old service** (Railway dashboard → Settings → Danger Zone)

## Phase 3: Verify Fix

### Task 3.1: Check Service Health

**After service is running:**
```bash
railway status
railway logs --follow
```

**Verify:**
- ✅ No ENOSPC errors
- ✅ Ghost starts successfully
- ✅ Cloudinary adapter initialized

### Task 3.2: Test Image Upload

**Test Cloudinary setup:**
```bash
node test-cloudinary-setup.js \
  --url https://ghost-production-616f.up.railway.app \
  --admin-key <your-admin-api-key>
```

**Or test via Ghost Admin:**
- Upload a test image
- Verify it goes to Cloudinary (check Cloudinary dashboard)
- Verify image displays correctly on site

### Task 3.3: Monitor Storage

**Check logs for storage operations:**
```bash
railway logs --follow | grep -i storage
```

**Verify:**
- ✅ Images upload to Cloudinary (not local storage)
- ✅ No local storage errors

## Next Steps

1. **Run authentication:** `./railway-cli-setup.sh` or `railway login`
2. **Verify setup:** `./railway-cli-verify.sh`
3. **Export variables:** `./railway-export-vars.sh` (before recreating service)
4. **Recreate service** (if ENOSPC persists)
5. **Test Cloudinary:** `node test-cloudinary-setup.js`

## Files Created

- `railway-cli-setup.sh` - Authentication and project linking
- `railway-cli-verify.sh` - Comprehensive verification script
- `railway-export-vars.sh` - Export environment variables
- `test-cloudinary-setup.js` - Test Cloudinary configuration
- `RAILWAY-CLI-GUIDE.md` - Complete guide with all commands
- `RAILWAY-CLI-IMPLEMENTATION-STATUS.md` - This file

## Notes

- Railway CLI requires interactive authentication (opens browser)
- Database is separate from service - safe to recreate service
- Keep old service running until new one is verified
- All environment variables must be copied to new service
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
