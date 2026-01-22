# Quick Start - Railway CLI Storage Fix

## 🚀 Fast Track (5 Steps)

1. **Authenticate:**
   ```bash
   cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
   railway login
   railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97
   ```

2. **Verify Setup:**
   ```bash
   ./railway-cli-verify.sh
   ```

3. **Export Variables (before recreating):**
   ```bash
   ./railway-export-vars.sh
   ```

4. **Recreate Service** (if ENOSPC errors persist):
   - Railway Dashboard → "+ New" → "Service"
   - GitHub: `ReFiDAO/ReFi-DAO-Website`
   - Root Directory: `ghost-railway`
   - Branch: `docs`
   - Copy all environment variables
   - Connect to same MySQL database

5. **Test:**
   ```bash
   railway logs --follow
   node test-cloudinary-setup.js --url <ghost-url> --admin-key <key>
   ```

## 📋 Current Status

- ✅ Railway CLI installed (v4.23.0)
- ✅ Dockerfile with Cloudinary adapter ready
- ✅ Verification scripts created
- ⏳ **Waiting for:** Railway CLI authentication
- ❌ Service status: 502 (crashing with ENOSPC)

## 🔧 Common Commands

```bash
# Status
railway status
railway logs --follow

# Variables
railway variables
railway variables set <key>=<value>

# Deploy
railway up

# Verify
./railway-cli-verify.sh
```

## 📚 Full Documentation

- `RAILWAY-CLI-GUIDE.md` - Complete guide
- `RAILWAY-CLI-IMPLEMENTATION-STATUS.md` - Detailed status
