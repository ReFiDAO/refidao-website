# How to Add Dockerfile to Railway

## Step-by-Step Guide

### First: Check How Your Railway Project is Set Up

In Railway dashboard, check if your Ghost project is:
- **Connected to GitHub** (shows GitHub repo link)
- **Direct deployment** (no GitHub connection)

---

## Option A: Railway Connected to GitHub (Recommended)

If your Railway project is connected to a GitHub repository:

### Step 1: Copy Dockerfile to Your Repository

1. **Locate the Dockerfile**
   - It's at: `docs/ReFi-DAO-Infrastructure-Migration/ghost-migration/Dockerfile`
   - Or use this content:

```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
EXPOSE 2368
CMD ["node", "current/index.js"]
```

### Step 2: Add to Repository Root

1. **Copy Dockerfile to your Railway project's repository root**
   - If Railway is connected to this repo (`ReFi-DAO-Website`), copy it to the root
   - Or create it in the Railway project's GitHub repository root

2. **Commit and Push**
   ```bash
   git add Dockerfile
   git commit -m "Add Dockerfile for Cloudinary storage adapter"
   git push
   ```

### Step 3: Railway Auto-Detects

- Railway will automatically detect the Dockerfile
- It will trigger a new deployment
- Wait 2-5 minutes for deployment to complete

---

## Option B: Railway Direct Deployment (No GitHub)

If Railway is NOT connected to GitHub:

### Step 1: Go to Railway Dashboard

1. Go to https://railway.app
2. Select your Ghost project: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
3. Click on your Ghost service

### Step 2: Access Source/Code Editor

1. Look for **Settings** → **Source** or **Code** tab
2. Or look for **Edit Source** or **File Browser** option
3. Railway should show your project files

### Step 3: Create Dockerfile

1. Click **New File** or **Create File**
2. Name it exactly: `Dockerfile` (capital D, no extension)
3. Paste this content:

```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
EXPOSE 2368
CMD ["node", "current/index.js"]
```

4. **Save** the file

### Step 4: Redeploy

1. Railway should auto-detect the Dockerfile
2. Or manually click **Redeploy** button
3. Wait 2-5 minutes for deployment

---

## Option C: Upload via Railway CLI

If you have Railway CLI set up:

1. **Copy Dockerfile to project directory**
2. **Link to Railway project:**
   ```bash
   railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97
   ```
3. **Railway will detect Dockerfile automatically**

---

## Verify Dockerfile Was Added

After adding Dockerfile, check Railway deployment logs:

1. Go to Railway dashboard
2. Select Ghost service
3. Go to **Deployments** tab
4. Check latest deployment logs
5. Look for:
   - ✅ `Using Dockerfile` or `Building from Dockerfile`
   - ✅ `npm install ghost-storage-cloudinary`
   - ✅ Build completes successfully

---

## Troubleshooting

### Dockerfile Not Detected?

1. **Check filename:** Must be exactly `Dockerfile` (capital D, no extension)
2. **Check location:** Must be in project root (same level as package.json if exists)
3. **Check Railway settings:** Ensure Railway is looking for Dockerfile
4. **Try manual redeploy:** Click Redeploy button

### Build Fails?

1. **Check logs** for specific errors
2. **Verify Dockerfile syntax** is correct
3. **Check npm install** completes successfully
4. **Look for** `ghost-storage-cloudinary` in logs

### Still Not Working?

1. Verify Dockerfile content matches exactly
2. Check Railway deployment logs for errors
3. Ensure environment variables are still set
4. Try redeploying again

---

## After Dockerfile is Added

Once Dockerfile is detected and deployment completes:

1. ✅ Service should start successfully
2. ✅ Cloudinary adapter will be installed
3. ✅ Test image upload should go to Cloudinary
4. ✅ Ready to resume image migration!

---

## Quick Check: Is Railway Connected to GitHub?

**To check:**
1. Go to Railway dashboard
2. Select your Ghost project
3. Look for **Settings** → **Source**
4. Does it show a GitHub repository link?
   - **Yes** → Use Option A (GitHub)
   - **No** → Use Option B (Direct deployment)

Let me know which option applies to your setup!
