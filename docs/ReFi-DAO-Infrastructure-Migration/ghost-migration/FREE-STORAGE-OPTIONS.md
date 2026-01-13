# Free Storage Options for Ghost Images

## Overview

Railway's free tier has limited storage. Here are **free** options to store Ghost images externally, eliminating storage limits.

## Best Free Options

### 1. Cloudinary (Recommended) ⭐

**Free Tier:**
- ✅ **25GB storage** (free forever)
- ✅ **25GB bandwidth/month** (free forever)
- ✅ **CDN included** (fast global delivery)
- ✅ **Image optimization** (automatic)
- ✅ **Easy Ghost integration**

**Setup:**
1. Sign up at https://cloudinary.com (free)
2. Get your credentials from dashboard
3. Install Ghost storage adapter:
   ```bash
   npm install ghost-storage-cloudinary
   ```
4. Configure in Ghost `config.production.json`:
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

**Pros:**
- Most generous free tier
- Built-in CDN
- Image optimization
- Easy setup
- No credit card required

**Cons:**
- Requires code changes (storage adapter)

---

### 2. Google Drive (Free)

**Free Tier:**
- ✅ **15GB storage** (free forever)
- ✅ **Unlimited bandwidth** (free)
- ✅ **No credit card required**

**Setup:**
1. Use Ghost-Google-Drive adapter: https://github.com/ghost-storage-adapter/ghost-google-drive
2. Follow adapter documentation
3. Configure in Ghost config

**Pros:**
- Free storage
- No bandwidth limits
- Familiar interface

**Cons:**
- Requires custom adapter setup
- Slightly more complex
- May have rate limits

---

### 3. Backblaze B2 (Free Tier)

**Free Tier:**
- ✅ **10GB storage** (free forever)
- ✅ **1GB download/day** (free)
- ✅ **S3-compatible API**

**Setup:**
1. Sign up at https://www.backblaze.com/b2/sign-up.html
2. Create a bucket
3. Get access keys
4. Configure Ghost with S3 adapter:
   ```json
   {
     "storage": {
       "active": "s3",
       "s3": {
         "accessKeyId": "your-key-id",
         "secretAccessKey": "your-secret",
         "bucket": "your-bucket-name",
         "region": "us-west-000",
         "endpoint": "https://s3.us-west-000.backblazeb2.com"
       }
     }
   }
   ```

**Pros:**
- S3-compatible (works with Ghost's built-in S3 adapter)
- No credit card required
- Pay-as-you-go after free tier

**Cons:**
- Smaller free tier than Cloudinary
- Download limits

---

### 4. AWS S3 (Free Tier - 12 months)

**Free Tier:**
- ✅ **5GB storage** (first 12 months)
- ✅ **20,000 GET requests/month** (first 12 months)
- ⚠️ **Requires credit card** (but won't charge if you stay within limits)

**Setup:**
1. Sign up for AWS (requires credit card)
2. Create S3 bucket
3. Configure Ghost:
   ```json
   {
     "storage": {
       "active": "s3",
       "s3": {
         "accessKeyId": "your-access-key",
         "secretAccessKey": "your-secret-key",
         "bucket": "your-bucket-name",
         "region": "us-east-1"
       }
     }
   }
   ```

**Pros:**
- Works with Ghost's built-in S3 adapter
- Industry standard
- Reliable

**Cons:**
- Requires credit card
- Only free for 12 months
- Smaller free tier

---

## Comparison Table

| Option | Free Storage | Free Bandwidth | CDN | Setup Difficulty | Best For |
|--------|--------------|----------------|-----|------------------|----------|
| **Cloudinary** | 25GB | 25GB/month | ✅ | Easy | **Best overall** |
| **Google Drive** | 15GB | Unlimited | ❌ | Medium | Simple setup |
| **Backblaze B2** | 10GB | 1GB/day | ❌ | Easy | S3 compatibility |
| **AWS S3** | 5GB | 20K requests | ❌ | Easy | Short-term |

## Recommended Solution: Cloudinary

**Why Cloudinary?**
1. ✅ Largest free tier (25GB)
2. ✅ Built-in CDN (faster loading)
3. ✅ Image optimization (smaller files)
4. ✅ Easy Ghost integration
5. ✅ No credit card required
6. ✅ Free forever (not just 12 months)

## Implementation Steps

### Step 1: Sign Up for Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Sign up (free, no credit card)
3. Get credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Configure Ghost on Railway

Since Ghost on Railway uses Docker, you need to:

**Option A: Use Environment Variables (Easier)**

Add to Railway environment variables:
```bash
storage__active=cloudinary
storage__cloudinary__cloud_name=your-cloud-name
storage__cloudinary__api_key=your-api-key
storage__cloudinary__api_secret=your-api-secret
```

**Option B: Custom Dockerfile (More Control)**

1. Create `Dockerfile`:
   ```dockerfile
   FROM ghost:latest
   RUN npm install ghost-storage-cloudinary
   ```

2. Update Railway to use custom Dockerfile

### Step 3: Restart Railway Deployment

1. Go to Railway dashboard
2. Restart the Ghost service
3. Verify storage is working

### Step 4: Resume Image Upload

Once Cloudinary is configured:
```bash
cd docs/ReFi-DAO-Infrastructure-Migration/ghost-migration
node upload-ghost-images.js https://ghost-production-616f.up.railway.app <admin-key> downloaded-images
```

Images will now upload to Cloudinary instead of Railway storage!

## Alternative: Quick Fix (Clean Up Railway Storage)

If you want to stick with Railway storage temporarily:

1. **Check current storage usage** in Railway dashboard
2. **Delete old/unused files** if any
3. **Upload images in smaller batches** (e.g., 50 at a time)
4. **Monitor storage** and clean up as needed

This is a temporary solution - external storage is better long-term.

## Cost Comparison

| Solution | Monthly Cost | Storage | Notes |
|----------|--------------|---------|-------|
| **Cloudinary Free** | $0 | 25GB | Best option |
| **Google Drive Free** | $0 | 15GB | Good option |
| **Backblaze B2 Free** | $0 | 10GB | Good option |
| **Railway Upgrade** | $5-20 | Varies | Paid option |
| **AWS S3** | $0 (12mo) | 5GB | Then ~$0.023/GB |

## Next Steps

1. **Choose Cloudinary** (recommended)
2. **Sign up** for free account
3. **Configure Ghost** with Cloudinary
4. **Resume image upload** - images will go to Cloudinary
5. **Update image references** in posts

## Notes

- Cloudinary free tier is generous and should handle your 1,838 images easily
- Images will load faster with Cloudinary's CDN
- No storage limits = no more upload errors
- Can always upgrade Cloudinary later if needed (but free tier is usually enough)
