# Troubleshooting 502 Error - Ghost Not Starting

## Issue
Ghost service is returning 502 errors, meaning the application isn't responding.

## Common Causes & Solutions

### 1. Dockerfile Not Added or Not Detected

**Check:**
- Is Dockerfile in your Railway project?
- Did Railway detect it during deployment?

**Solution:**
- Ensure Dockerfile exists in project root
- Check Railway deployment logs for Dockerfile detection
- If using GitHub, ensure Dockerfile is committed and pushed

### 2. Cloudinary Package Installation Failed

**Check Railway logs for:**
```
npm install ghost-storage-cloudinary
```

**If you see errors:**
- npm registry issues
- Package not found
- Network errors

**Solution:**
- Check npm registry is accessible
- Verify package name is correct: `ghost-storage-cloudinary`
- Try redeploying

### 3. Environment Variable Issues

**Check:**
- Are all 4 variables set correctly?
- Using double underscores (`__`)?
- No typos in variable names?

**Common mistakes:**
- `storage_active` instead of `storage__active` ❌
- `storage_cloudinary_cloud_name` instead of `storage__cloudinary__cloud_name` ❌
- Missing variables

**Solution:**
- Verify all variables in Railway dashboard
- Use exact format: `storage__active=cloudinary`
- Double-check variable names match exactly

### 4. Ghost Configuration Error

**Check Railway logs for:**
- Ghost startup errors
- Configuration parsing errors
- Storage adapter errors

**Solution:**
- Check if Ghost can read environment variables
- Verify storage configuration format
- Check for syntax errors

## Immediate Steps to Fix

### Step 1: Check Railway Logs

1. Go to Railway dashboard
2. Select Ghost service
3. Click **Logs** tab
4. Look for:
   - Build errors
   - Startup errors
   - npm install errors
   - Configuration errors

### Step 2: Verify Dockerfile

Ensure Dockerfile content is exactly:
```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
EXPOSE 2368
CMD ["node", "current/index.js"]
```

### Step 3: Verify Environment Variables

In Railway → Variables, check these exact names:
```
storage__active
storage__cloudinary__cloud_name
storage__cloudinary__api_key
storage__cloudinary__api_secret
```

### Step 4: Try Without Cloudinary First

If service won't start, temporarily remove Cloudinary config:
1. Remove or comment out storage variables
2. Redeploy
3. If service starts, issue is with Cloudinary config
4. If service still fails, issue is elsewhere

### Step 5: Check Service Health

In Railway dashboard:
- Is service showing as "Active"?
- Are there any restart loops?
- Check resource usage (CPU/Memory)

## Alternative: Manual Configuration File

If environment variables aren't working, try config file:

1. Create `config.production.json`:
```json
{
  "storage": {
    "active": "cloudinary",
    "cloudinary": {
      "cloud_name": "dvrjmfhzw",
      "api_key": "416117346651538",
      "api_secret": "REDACTED_CLOUDINARY_API_SECRET"
    }
  }
}
```

2. Update Dockerfile:
```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
COPY config.production.json /var/lib/ghost/config.production.json
EXPOSE 2368
CMD ["node", "current/index.js"]
```

## What to Share

Please check Railway logs and share:
1. **Build logs** - Any errors during `npm install`?
2. **Runtime logs** - Any errors when Ghost starts?
3. **Service status** - Is it showing as Active or restarting?
4. **Dockerfile** - Is it detected and used?

This will help identify the exact issue!
