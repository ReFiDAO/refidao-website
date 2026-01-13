# Railway Cloudinary Setup Plan

## Current Situation Analysis

From Railway documentation and your setup:

1. **Current Source:** `ghost:alpine` Docker image (direct deployment)
2. **Railway Connected:** Already connected to `ReFi-DAO-Website` GitHub repo
3. **Branch:** Set to `main` branch
4. **Dockerfile Status:** `Dockerfile.ghost` exists in `docs` branch, not `main`
5. **Railway Limitation:** Railway looks for `Dockerfile` by default (not `Dockerfile.ghost`)

## Problem

Railway auto-detects `Dockerfile` in the repo root, but:
- We have `Dockerfile` for Quartz (website)
- We have `Dockerfile.ghost` for Ghost (blog)
- Railway can't use both

## Solution Options (Ranked by Safety)

### Option 1: Create Separate Minimal Repo (SAFEST) ⭐

**Why:** Completely isolates Ghost deployment from website repo

**Steps:**
1. Create new GitHub repo: `ghost-railway` (or similar)
2. Add only `Dockerfile.ghost` (rename to `Dockerfile`)
3. Connect Railway to this new repo
4. Railway will auto-detect Dockerfile and build Ghost with Cloudinary

**Pros:**
- ✅ Zero risk to existing website
- ✅ Clean separation
- ✅ Easy to manage
- ✅ No conflicts

**Cons:**
- ⚠️ Need to create new repo (2 minutes)

---

### Option 2: Use Subdirectory Approach (If Supported)

**Steps:**
1. Check if Railway supports "Root Directory" setting
2. Create `ghost/` subdirectory in repo
3. Move `Dockerfile.ghost` to `ghost/Dockerfile`
4. Set Railway root directory to `ghost/`
5. Railway will build from that directory

**Pros:**
- ✅ Keeps everything in one repo
- ✅ No new repo needed

**Cons:**
- ⚠️ May not be supported by Railway
- ⚠️ Need to verify Railway supports this

---

### Option 3: Push Dockerfile.ghost to Main as Dockerfile (RISKIER)

**Steps:**
1. Backup current `Dockerfile` (Quartz)
2. Rename `Dockerfile.ghost` → `Dockerfile` 
3. Push to `main` branch
4. Railway will use it for Ghost
5. Website deployments might break (if they use Dockerfile)

**Pros:**
- ✅ Quick solution
- ✅ No new repo

**Cons:**
- ❌ Could break website deployments
- ❌ Need to manage two Dockerfiles
- ❌ Risk of conflicts

---

### Option 4: Change Source to GitHub (Current Setup)

**Since Railway is already connected to GitHub:**

1. Railway is connected to `ReFi-DAO-Website` repo
2. Change branch from `main` to `docs` (where Dockerfile.ghost is)
3. Rename `Dockerfile.ghost` → `Dockerfile` in `docs` branch
4. Railway will detect and use it

**Pros:**
- ✅ Already connected
- ✅ Just need branch change

**Cons:**
- ⚠️ Need to rename file
- ⚠️ Might affect other deployments using `docs` branch

---

## Recommended Plan: Option 1 (Separate Repo)

### Step 1: Create Minimal Ghost Repo

```bash
# Create new directory
mkdir ghost-railway
cd ghost-railway

# Create Dockerfile (from Dockerfile.ghost)
cat > Dockerfile << 'EOF'
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
EXPOSE 2368
CMD ["node", "current/index.js"]
EOF

# Initialize git
git init
git add Dockerfile
git commit -m "Ghost Dockerfile with Cloudinary"
```

### Step 2: Push to GitHub

1. Create new repo on GitHub: `ghost-railway`
2. Push the Dockerfile:
```bash
git remote add origin https://github.com/ReFiDAO/ghost-railway.git
git push -u origin main
```

### Step 3: Connect Railway to New Repo

1. Railway dashboard → Ghost service
2. Settings → Source
3. Disconnect current source
4. Connect to `ghost-railway` repo
5. Railway will auto-detect Dockerfile and deploy

### Step 4: Verify

1. Watch deployment logs for `npm install ghost-storage-cloudinary`
2. Test Cloudinary upload
3. Resume image migration

---

## Why This is Safest

- ✅ **Zero impact** on existing website repo
- ✅ **Clean separation** - Ghost has its own repo
- ✅ **Easy to manage** - One Dockerfile, one purpose
- ✅ **No conflicts** - Website and Ghost deployments independent
- ✅ **Reversible** - Can always switch back to `ghost:alpine`

---

## Alternative: Check Railway Root Directory Setting

From your screenshot, I see Railway has a "Root Directory" setting. Let's check if we can use that:

1. In Railway → Settings → Source
2. Look for "Root Directory" field
3. If it exists, we could:
   - Create `ghost/` directory
   - Put Dockerfile there
   - Set root directory to `ghost/`
   - Railway builds from that directory

This would keep everything in one repo!

---

## Decision Point

**Choose based on:**
- **Want absolute safety?** → Option 1 (separate repo)
- **Want everything in one repo?** → Check if Railway supports root directory
- **Want quickest solution?** → Option 4 (use docs branch, rename file)

Which approach do you prefer? I recommend Option 1 for maximum safety!
