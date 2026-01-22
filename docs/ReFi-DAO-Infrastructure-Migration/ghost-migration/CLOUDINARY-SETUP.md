# Cloudinary Setup for Ghost on Railway

## Quick Setup (5 minutes)

### Step 1: Sign Up for Cloudinary (Free)

1. Go to https://cloudinary.com/users/register/free
2. Sign up with email (no credit card required)
3. Verify your email
4. You'll see your dashboard with credentials

### Step 2: Get Your Credentials

From Cloudinary dashboard, note:
- **Cloud Name** (e.g., `dxyz1234`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Configure Railway Environment Variables

1. Go to Railway dashboard: https://railway.app
2. Select your Ghost project: `e826dec7-c9e6-44cf-bc0c-77df53289e97`
3. Go to **Variables** tab
4. Add these environment variables:

```bash
# Storage Configuration
storage__active=cloudinary
storage__cloudinary__cloud_name=your-cloud-name-here
storage__cloudinary__api_key=your-api-key-here
storage__cloudinary__api_secret=your-api-secret-here
```

**Important:** Replace `your-cloud-name-here`, `your-api-key-here`, and `your-api-secret-here` with your actual Cloudinary credentials.

### Step 4: Install Cloudinary Storage Adapter

Since Railway uses Ghost Docker image, you need to install the adapter. Two options:

#### Option A: Custom Dockerfile (Recommended)

1. Create `Dockerfile` in your Railway project root:
   ```dockerfile
   FROM ghost:latest
   
   # Install Cloudinary storage adapter
   RUN npm install ghost-storage-cloudinary --save
   
   # Copy custom config if needed
   # COPY config.production.json /var/lib/ghost/config.production.json
   ```

2. Railway will automatically detect and use the Dockerfile
3. Redeploy the service

#### Option B: Use Railway Nixpacks (If Available)

If Railway supports runtime installation, add to `package.json`:
```json
{
  "dependencies": {
    "ghost-storage-cloudinary": "^2.2.0"
  }
}
```

### Step 5: Verify Configuration

1. Restart Railway Ghost service
2. Go to Ghost Admin: https://ghost-production-616f.up.railway.app/ghost
3. Try uploading a test image
4. Check if it uploads to Cloudinary (image URL will be `res.cloudinary.com`)

### Step 6: Resume Image Migration

Once Cloudinary is working:

```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node upload-ghost-images.js \
  https://ghost-production-616f.up.railway.app \
  6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f \
  downloaded-images
```

Images will now upload to Cloudinary instead of Railway storage!

## Troubleshooting

### Images Still Uploading to Railway

**Problem:** Ghost still using local storage

**Solution:**
1. Verify environment variables are set correctly
2. Check Dockerfile includes `npm install ghost-storage-cloudinary`
3. Restart Railway service
4. Check Ghost logs for storage adapter errors

### Storage Adapter Not Found

**Problem:** `Cannot find module 'ghost-storage-cloudinary'`

**Solution:**
1. Ensure Dockerfile includes installation step
2. Rebuild Docker image
3. Check Railway build logs

### Environment Variables Not Working

**Problem:** Ghost not reading storage config from env vars

**Solution:**
1. Use format: `storage__active=cloudinary` (double underscore)
2. Ensure all three variables are set:
   - `storage__active`
   - `storage__cloudinary__cloud_name`
   - `storage__cloudinary__api_key`
   - `storage__cloudinary__api_secret`
3. Restart service after adding variables

## Alternative: Manual Config File

If environment variables don't work, create `config.production.json`:

```json
{
  "storage": {
    "active": "cloudinary",
    "cloudinary": {
      "cloud_name": "your-cloud-name",
      "api_key": "your-api-key",
      "api_secret": "your-api-secret"
    }
  }
}
```

Then update Dockerfile:
```dockerfile
FROM ghost:latest
RUN npm install ghost-storage-cloudinary --save
COPY config.production.json /var/lib/ghost/config.production.json
```

## Benefits After Setup

✅ **No storage limits** - Upload all 1,838 images  
✅ **Faster loading** - Cloudinary CDN delivers images globally  
✅ **Automatic optimization** - Images optimized automatically  
✅ **Free forever** - 25GB storage, 25GB bandwidth/month  
✅ **Better performance** - Reduced Railway storage usage  

## Cost

**Free Tier Includes:**
- 25GB storage (free forever)
- 25GB bandwidth/month (free forever)
- CDN included
- Image optimization included

**If you exceed free tier:**
- Storage: $0.10/GB/month
- Bandwidth: $0.10/GB/month

For 1,838 images (~500MB-1GB), you'll stay well within free tier!

## Next Steps

1. ✅ Sign up for Cloudinary (free)
2. ✅ Configure Railway environment variables
3. ✅ Install storage adapter (Dockerfile)
4. ✅ Restart Railway service
5. ✅ Resume image upload
6. ✅ Update image references in posts

## Support

- Cloudinary Docs: https://cloudinary.com/documentation
- Ghost Storage Adapters: https://ghost.org/docs/storage/
- Railway Support: https://railway.app/help
