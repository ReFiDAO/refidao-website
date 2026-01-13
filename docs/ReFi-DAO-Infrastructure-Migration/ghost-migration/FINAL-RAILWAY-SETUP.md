# Final Railway Setup Plan - Using Root Directory

## Analysis from Railway Dashboard

From your Railway screenshot, I can see:
- ✅ Railway is connected to GitHub: `ReFiDAO/ReFi-DAO-Website`
- ✅ Root Directory setting exists: Currently set to `/`
- ✅ Branch: `main`
- ⚠️ Source Image: `ghost:alpine` (needs to be changed to GitHub)

## Best Solution: Use Root Directory + Subdirectory

This keeps everything in one repo but safely separated!

### Step 1: Create Ghost Subdirectory

Create a `ghost-railway/` directory in your repo with the Dockerfile:

```bash
mkdir ghost-railway
# Copy Dockerfile.ghost to ghost-railway/Dockerfile
```

### Step 2: Update Railway Settings

1. **Disconnect Docker Image Source:**
   - Railway → Settings → Source
   - Click "Disconnect" next to `ghost:alpine`

2. **Set Root Directory:**
   - In the "Root Directory" field
   - Change from `/` to `ghost-railway/`
   - This tells Railway to build from that subdirectory

3. **Railway will:**
   - Look for `Dockerfile` in `ghost-railway/` directory
   - Build Ghost with Cloudinary adapter
   - Deploy automatically

### Step 3: Commit and Push

```bash
git add ghost-railway/
git commit -m "Add ghost-railway directory for Railway deployment"
git push
```

Railway will auto-detect and deploy!

---

## Alternative: Simpler Approach

If Root Directory doesn't work as expected:

### Option A: Change Source to GitHub (Safest)

1. **Disconnect Docker Image:**
   - Click "Disconnect" next to `ghost:alpine`
   - Railway will switch to GitHub source

2. **Set Root Directory to subdirectory:**
   - Set to `ghost-railway/`
   - Railway builds from there

3. **Or use main branch with subdirectory:**
   - Keep root directory as `/`
   - But Railway will look for Dockerfile in root (conflicts with Quartz)

### Option B: Create Separate Minimal Repo

If Root Directory doesn't work:

1. Create new repo: `ghost-railway`
2. Add only Dockerfile
3. Connect Railway to that repo
4. Zero impact on main repo

---

## Recommended Steps (Right Now)

### Step 1: Create Ghost Subdirectory

```bash
cd "/Users/luizfernando/Desktop/Workspaces/Zettelkasten/03 Libraries/ReFi-DAO-Website"
mkdir -p ghost-railway
cp docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/Dockerfile ghost-railway/Dockerfile
```

### Step 2: Commit and Push

```bash
git add ghost-railway/
git commit -m "Add ghost-railway directory for Railway Ghost deployment"
git push origin docs  # or main, depending on which branch Railway uses
```

### Step 3: Configure Railway

1. **Disconnect Docker Image:**
   - Settings → Source → Disconnect `ghost:alpine`

2. **Set Root Directory:**
   - Change from `/` to `ghost-railway/`

3. **Railway will auto-deploy:**
   - Detects Dockerfile in `ghost-railway/`
   - Builds Ghost with Cloudinary
   - Deploys automatically

---

## Why This Works

- ✅ **Safe:** Doesn't touch existing Dockerfile (Quartz)
- ✅ **Clean:** Ghost has its own directory
- ✅ **Simple:** Uses Railway's built-in Root Directory feature
- ✅ **Reversible:** Can always switch back
- ✅ **No conflicts:** Website and Ghost deployments separate

---

## Verification

After setup, check Railway deployment logs for:
- ✅ `Building from Dockerfile`
- ✅ `npm install ghost-storage-cloudinary`
- ✅ Build completes successfully
- ✅ Service starts without errors

Then test Cloudinary upload!

---

## Next Steps

1. Create `ghost-railway/` directory with Dockerfile
2. Push to GitHub
3. Configure Railway Root Directory
4. Disconnect Docker image source
5. Railway auto-deploys
6. Verify Cloudinary works
7. Resume image migration!

Let me know when you're ready and I'll help execute this plan!
