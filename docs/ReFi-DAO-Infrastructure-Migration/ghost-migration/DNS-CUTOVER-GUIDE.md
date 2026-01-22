# DNS Cutover Guide

## Overview

This guide covers the DNS cutover process to point blog.refidao.com to the Railway Ghost deployment.

## Prerequisites

- Railway Ghost deployment: https://ghost-production-616f.up.railway.app
- DNS management access for refidao.com domain
- All migration tasks completed
- Testing completed and verified

## Pre-Cutover Checklist

Before changing DNS, verify:

- [ ] All 243 posts migrated and verified
- [ ] Images uploaded and accessible
- [ ] Theme applied and tested
- [ ] Settings configured
- [ ] Navigation menu configured
- [ ] RSS feed working: https://ghost-production-616f.up.railway.app/rss/
- [ ] Search functionality working
- [ ] Performance acceptable (< 3s page load)
- [ ] Cross-browser testing completed
- [ ] Backup of old Ghost instance created

## Step 1: Get Railway Domain Information

1. **Access Railway Dashboard**
   - Go to: https://railway.app
   - Navigate to project: `e826dec7-c9e6-44cf-bc0c-77df53289e97`

2. **Get Domain Information**
   - Go to **Settings → Domains**
   - Note the Railway-provided domain
   - Or get custom domain configuration

3. **Configure Custom Domain in Railway**
   - Add custom domain: `blog.refidao.com`
   - Railway will provide DNS records needed

## Step 2: Prepare DNS Records

### Current DNS (Old Instance)

Document current DNS records for blog.refidao.com:
- Record type (A, CNAME, etc.)
- Current value
- TTL

### New DNS (Railway)

Railway typically requires:
- **CNAME record** pointing to Railway domain
- Or **A record** pointing to Railway IP

## Step 3: Update DNS Records

### Option A: CNAME Record (Recommended)

1. **Access DNS Management**
   - Log into domain registrar/DNS provider
   - Navigate to DNS settings for refidao.com

2. **Update CNAME Record**
   - Find existing `blog` record
   - Change type to CNAME (if not already)
   - Update value to Railway domain:
     ```
     Name: blog
     Type: CNAME
     Value: <railway-domain>.up.railway.app
     TTL: 300 (or default)
     ```
   - Save changes

### Option B: A Record

If Railway provides IP addresses:
```
Name: blog
Type: A
Value: <railway-ip-address>
TTL: 300
```

## Step 4: SSL Certificate

Railway automatically provisions SSL certificates:

1. **Wait for SSL**
   - Railway will detect domain
   - SSL certificate will be provisioned automatically
   - Usually takes 5-15 minutes

2. **Verify SSL**
   - Visit: https://blog.refidao.com
   - Check SSL certificate is valid
   - Verify HTTPS redirect works

## Step 5: DNS Propagation

DNS changes can take time to propagate:

1. **Propagation Time**
   - Typically: 5 minutes to 48 hours
   - Average: 1-4 hours
   - Check propagation status: https://www.whatsmydns.net

2. **Monitor Propagation**
   - Use DNS checker tools
   - Test from multiple locations
   - Check different DNS servers

## Step 6: Post-Cutover Verification

After DNS propagates:

### Task 6.1: Basic Functionality

1. **Homepage**
   - Visit: https://blog.refidao.com
   - Verify site loads
   - Check SSL certificate

2. **Posts**
   - Visit several posts
   - Verify content loads
   - Check images display

3. **RSS Feed**
   - Visit: https://blog.refidao.com/rss/
   - Verify feed loads
   - Test in RSS reader

### Task 6.2: Advanced Features

1. **Search**
   - Test search functionality
   - Verify results

2. **Navigation**
   - Test all menu items
   - Verify links work

3. **Performance**
   - Check page load times
   - Verify images load quickly

### Task 6.3: Monitoring

1. **Railway Logs**
   - Monitor Railway logs for errors
   - Check for any issues

2. **Analytics**
   - Verify analytics tracking
   - Check for traffic

3. **Error Monitoring**
   - Check for 404 errors
   - Monitor broken links

## Step 7: Update Environment Variables

After DNS cutover, update Ghost environment:

1. **Update Ghost URL**
   - In Railway: Settings → Variables
   - Update `url` variable:
     ```
     url=https://blog.refidao.com
     ```
   - Redeploy if needed

2. **Verify Configuration**
   - Check Ghost admin works
   - Verify API endpoints

## Step 8: Redirect Old URLs (Optional)

If old Ghost instance had different URL structure:

1. **Set Up Redirects**
   - Configure redirects in old instance
   - Or use Railway redirects
   - Redirect old URLs to new URLs

2. **Update External Links**
   - Update any hardcoded URLs
   - Update integrations
   - Update documentation

## Rollback Plan

If issues occur:

1. **Immediate Rollback**
   - Revert DNS changes
   - Point back to old instance
   - Verify old instance still works

2. **Investigate Issues**
   - Check Railway logs
   - Identify problem
   - Fix issues

3. **Retry Cutover**
   - After fixes applied
   - Update DNS again
   - Monitor closely

## Post-Cutover Tasks

1. **Monitor for 24-48 Hours**
   - Watch for errors
   - Check performance
   - Monitor user feedback

2. **Update Documentation**
   - Document final configuration
   - Update team documentation
   - Archive migration files

3. **Cancel Old Ghost**
   - After 1-2 weeks of stable operation
   - Export final backup
   - Cancel managed Ghost subscription

## Troubleshooting

### DNS Not Propagating
- Check DNS records are correct
- Verify TTL settings
- Wait longer (up to 48 hours)

### SSL Certificate Issues
- Check domain is verified in Railway
- Wait for certificate provisioning
- Contact Railway support if needed

### Site Not Loading
- Check Railway deployment is online
- Verify DNS records
- Check Railway logs

### Images Not Loading
- Verify image migration completed
- Check image URLs updated
- Verify storage configuration

## Notes

- Keep old Ghost instance running during transition
- Test thoroughly before cutover
- Have rollback plan ready
- Monitor closely after cutover
