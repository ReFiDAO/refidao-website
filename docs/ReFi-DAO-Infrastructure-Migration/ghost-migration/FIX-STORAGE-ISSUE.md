# Fix Railway Storage Issue - ENOSPC Error

## Problem

Ghost is starting but crashing immediately with:
```
Error: ENOSPC: no space left on device, write
```

This means Railway's volume is full, even though Cloudinary should be handling storage.

## Root Cause

Ghost might still be trying to write logs or temporary files to the local volume, even with Cloudinary configured. The volume is completely full.

## Solutions

### Solution 1: Clean Up Railway Volume (Quick Fix)

1. **Go to Railway Dashboard**
   - Select your Ghost service
   - Look for **Volumes** or **Storage** section
   - Check volume usage

2. **Delete Old Files** (if possible)
   - Remove old logs
   - Clear temporary files
   - Delete unused images

3. **Or Delete and Recreate Volume**
   - Delete the volume (data will be lost, but database is separate)
   - Railway will create a new empty volume
   - Ghost will start fresh

### Solution 2: Verify Cloudinary is Active

The issue might be that Cloudinary isn't fully active yet. Check:

1. **Verify Environment Variables**
   - Railway → Variables
   - Ensure all 4 Cloudinary variables are set correctly
   - Check for typos

2. **Check Ghost Configuration**
   - Ghost might need a restart after Cloudinary config
   - Or configuration might not be applied

### Solution 3: Increase Railway Storage (Temporary)

If you need immediate fix:

1. **Upgrade Railway Plan**
   - More storage available
   - Temporary solution until Cloudinary is fully working

2. **Or Use Railway Volume Expansion** (if available)

### Solution 4: Ensure Cloudinary Handles All Storage

Ghost might be writing logs locally. We need to ensure Cloudinary is handling ALL storage, not just images.

---

## Immediate Action Plan

### Step 1: Check if Cloudinary is Working

Even though Ghost is crashing, let's see if Cloudinary adapter is installed:

1. Check Railway build logs for:
   - ✅ `npm install ghost-storage-cloudinary` (should appear)
   - ✅ Build completes successfully

2. Check if Cloudinary variables are being read:
   - Railway → Variables → Verify all 4 are set
   - Check for any errors in logs about reading variables

### Step 2: Clean Volume or Restart Fresh

**Option A: Delete Volume (Safest if Database is Separate)**
1. Railway → Ghost service → Volumes
2. Delete the volume
3. Railway will create new empty volume
4. Ghost will start fresh
5. Cloudinary will handle all new storage

**Option B: Clean Up Files**
1. If Railway provides file browser
2. Delete old logs/images
3. Free up space

### Step 3: Verify Cloudinary Configuration

After volume cleanup, verify:
1. Ghost starts successfully
2. Test image upload goes to Cloudinary
3. Check image URL is `res.cloudinary.com/...`

---

## Why This Happened

- Railway volume filled up from previous image uploads
- Even with Cloudinary configured, Ghost might write logs/temp files locally
- Volume needs cleanup before Cloudinary can take over

---

## Next Steps

1. **Clean up Railway volume** (delete and recreate, or delete old files)
2. **Verify Cloudinary is active** (check environment variables)
3. **Test image upload** (should go to Cloudinary, not local storage)
4. **Resume image migration** (once Cloudinary is confirmed working)

---

## Quick Fix: Delete Volume

Since your database is separate (MySQL service), deleting the Ghost volume is safe:

1. Railway → Ghost service
2. Find **Volumes** section
3. Delete the volume
4. Railway creates new empty volume
5. Ghost restarts with Cloudinary
6. All new storage goes to Cloudinary ✅

This is the fastest way to resolve the storage issue!
