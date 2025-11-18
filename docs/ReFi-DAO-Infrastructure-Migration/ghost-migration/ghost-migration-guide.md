# Ghost Migration Guide - Railway/Render Deployment

## Overview

This guide covers migrating Ghost CMS from managed hosting ($144/month) to Railway.app or Render.com ($5-20/month), reducing costs by ~$120-130/month.

## Prerequisites

- Access to current Ghost managed instance
- Railway.app or Render.com account
- Domain access (blog.refidao.com)
- DNS management access

## Option A: Railway.app (Recommended)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended for easy integration)
3. Verify email

### Step 2: Deploy Ghost Template

1. Click "New Project"
2. Select "Deploy from GitHub" or "Deploy Template"
3. Search for "Ghost" template
4. Click "Deploy"

**Alternative:** Use Ghost's official Docker image:
- Select "Deploy from Docker"
- Use image: `ghost:latest`
- Configure environment variables (see below)

### Step 3: Configure Environment Variables

Set these in Railway dashboard → Variables:

```
NODE_ENV=production
url=https://blog.refidao.com
database__client=mysql
database__connection__host=<railway-mysql-host>
database__connection__port=3306
database__connection__user=<railway-mysql-user>
database__connection__password=<railway-mysql-password>
database__connection__database=ghost
```

### Step 4: Set Up Database

**Option A: Railway MySQL Plugin**
1. Add MySQL service to project
2. Railway automatically provides connection details
3. Use these in Ghost environment variables

**Option B: External Database**
- Use existing MySQL/PostgreSQL instance
- Or set up managed database separately

### Step 5: Configure Domain

1. In Railway project → Settings → Domains
2. Add custom domain: `blog.refidao.com`
3. Railway provides DNS records to add
4. Add CNAME record in DNS:
   - Name: `blog`
   - Value: `<railway-provided-domain>`
5. Railway automatically provisions SSL certificate

### Step 6: Export Content from Managed Ghost

1. Log into current Ghost admin: https://<current-ghost-url>/ghost
2. Go to Settings → Labs
3. Click "Export your content"
4. Download JSON file
5. Download all images/media from content/images directory

### Step 7: Import Content to Railway Ghost

1. Access Railway Ghost admin: https://blog.refidao.com/ghost
2. Complete initial setup (create admin account)
3. Go to Settings → Labs
4. Click "Import content"
5. Upload JSON export file
6. Upload images to content/images directory (via SFTP or Railway file system)

### Step 8: Migrate Theme

1. Export theme from current Ghost:
   - Settings → Design → Download theme
2. Import to Railway Ghost:
   - Settings → Design → Upload theme
3. Activate theme

### Step 9: Update Integrations

1. Update RSS feed URL in website (if hardcoded)
2. Update email service (if using Ghost's email)
3. Test all integrations
4. Update any API keys/webhooks

### Step 10: Testing & Validation

- [ ] All posts render correctly
- [ ] RSS feed works: https://blog.refidao.com/rss/
- [ ] Images load properly
- [ ] Theme displays correctly
- [ ] Search functionality works
- [ ] Email notifications work (if configured)
- [ ] Performance is acceptable

### Step 11: DNS Cutover

1. Update DNS records
2. Wait for propagation (can take up to 48 hours)
3. Monitor Railway logs for errors
4. Test from multiple locations

### Step 12: Cancel Managed Ghost

1. Verify Railway Ghost is working perfectly
2. Export final backup from managed Ghost
3. Cancel managed Ghost subscription
4. Update any remaining references

## Option B: Render.com (Alternative)

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Verify email

### Step 2: Deploy Ghost

1. Click "New" → "Web Service"
2. Connect GitHub repository (or use Render's Ghost template)
3. Configure:
   - Build Command: `npm install -g ghost-cli && ghost install`
   - Start Command: `ghost start`
   - Environment: Docker

### Step 3: Configure Environment

Same environment variables as Railway (see above)

### Step 4: Set Up Database

1. Create PostgreSQL database in Render
2. Use connection string in Ghost config
3. Render provides connection details automatically

### Step 5: Follow Steps 5-12 from Railway Guide

Same process for content migration, domain setup, and cutover.

## Cost Comparison

**Current:**
- Ghost Managed: $144/month

**New:**
- Railway/Render: $5-20/month (pay-as-you-go)
- Database: Included or $5-10/month

**Savings:** ~$120-130/month

## Maintenance

### Regular Tasks

- **Weekly:** Check Railway/Render logs for errors
- **Monthly:** Update Ghost version (Railway/Render can auto-update)
- **Quarterly:** Review costs and optimize

### Backups

Railway/Render provide automatic backups, but also:
- Export Ghost content monthly
- Backup database separately
- Store backups in GitHub or cloud storage

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify environment variables
   - Check database is running
   - Verify network connectivity

2. **SSL Certificate Issues**
   - Wait for DNS propagation
   - Check DNS records are correct
   - Railway/Render auto-provisions SSL

3. **Image Upload Issues**
   - Check file permissions
   - Verify storage configuration
   - Use external storage (S3) for production

4. **Performance Issues**
   - Upgrade Railway/Render plan
   - Enable CDN for images
   - Optimize Ghost settings

## Support Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Ghost Docs: https://ghost.org/docs
- Ghost Community: https://forum.ghost.org

## Migration Checklist

- [ ] Railway/Render account created
- [ ] Ghost deployed
- [ ] Database configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Content exported from managed Ghost
- [ ] Content imported to new Ghost
- [ ] Theme migrated
- [ ] Integrations updated
- [ ] Testing complete
- [ ] DNS cutover complete
- [ ] Managed Ghost cancelled
- [ ] Documentation updated

## Timeline Estimate

- Setup: 2-3 hours
- Content migration: 1-2 hours
- Testing: 1-2 hours
- DNS cutover: 1-48 hours (propagation)
- **Total: 1-2 days**

---

**Last Updated:** January 2025  
**Status:** Ready for implementation

