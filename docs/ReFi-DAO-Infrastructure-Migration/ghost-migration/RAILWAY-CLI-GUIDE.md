# Railway CLI Guide - Storage Fix

## Current Status

The Ghost service is crashing with `ENOSPC: no space left on device` errors. We'll use Railway CLI to diagnose and fix this.

## Step 1: Authenticate Railway CLI

**You need to run this manually** (requires browser):

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
./railway-cli-setup.sh
```

Or manually:
```bash
railway login
railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97
```

## Step 2: Verify Current Setup

After authentication, run:

```bash
./railway-cli-verify.sh
```

This will check:
- ✅ Authentication status
- ✅ Project link
- ✅ Cloudinary environment variables
- ✅ Service status
- ✅ Cloudinary installation in build logs
- ✅ Storage errors (ENOSPC)

## Step 3: Export Current Configuration

Before recreating the service, export all variables:

```bash
./railway-export-vars.sh
```

This saves all environment variables to a file for reference.

## Step 4: Fix Storage Issue

### Option A: Check Volume Management (if available)

```bash
railway volume --help
```

If volume commands exist:
```bash
railway volume list
railway volume inspect <volume-id>
```

### Option B: Recreate Service (Recommended)

Since volumes can't be easily cleaned, recreate the service:

1. **In Railway Dashboard:**
   - Go to your project
   - Click "+ New" → "Service"
   - Connect to GitHub repo: `ReFiDAO/ReFi-DAO-Website`
   - Set **Root Directory:** `ghost-railway`
   - Set **Branch:** `docs`
   - Railway will use `ghost-railway/Dockerfile`

2. **Link to new service via CLI:**
   ```bash
   railway link -p <new-service-id>
   ```

3. **Set environment variables:**
   ```bash
   # Use the exported variables file as reference
   railway variables set storage__active=cloudinary
   railway variables set storage__cloudinary__cloud_name=dvrjmfhzw
   railway variables set storage__cloudinary__api_key=416117346651538
   railway variables set storage__cloudinary__api_secret=REDACTED_CLOUDINARY_API_SECRET
   
   # Copy all other variables from the old service
   # (check Railway dashboard → Variables tab)
   ```

4. **Connect to same MySQL database** (from Railway dashboard)

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Monitor deployment:**
   ```bash
   railway logs --follow
   ```

7. **Verify no ENOSPC errors:**
   ```bash
   railway logs --tail 200 | grep -i "ENOSPC\|no space"
   ```

8. **Delete old service** (via Railway dashboard → Settings → Danger Zone)

## Step 5: Verify Fix

```bash
# Check service health
railway status

# View logs
railway logs --follow

# Check for Cloudinary initialization
railway logs --tail 100 | grep -i cloudinary

# Verify no storage errors
railway logs --tail 200 | grep -i "ENOSPC\|storage"
```

## Quick Reference Commands

```bash
# Authentication
railway login
railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97

# Status & Logs
railway status
railway logs --follow
railway logs --tail 100

# Variables
railway variables
railway variables set <key>=<value>

# Deploy
railway up

# Who am I?
railway whoami
```

## Troubleshooting

### "Unauthorized" error
Run `railway login` again (opens browser)

### "Cannot login in non-interactive mode"
You must run `railway login` manually in your terminal (not via script)

### Service still crashing after recreation
- Check Cloudinary variables are set correctly
- Verify Dockerfile is being used (`ghost-railway/Dockerfile`)
- Check build logs for Cloudinary installation
- Verify database connection

### Variables not persisting
- Check variable names match exactly (including double underscores)
- Verify you're linked to the correct service
- Check Railway dashboard → Variables tab
