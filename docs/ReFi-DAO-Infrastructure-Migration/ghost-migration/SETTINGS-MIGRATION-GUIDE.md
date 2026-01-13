# Settings Migration Guide

## Overview

This guide covers migrating all Ghost settings from the old managed instance to the Railway deployment.

## Prerequisites

- Access to old Ghost admin: https://blog.refidao.com/ghost
- Access to new Ghost admin: https://ghost-production-616f.up.railway.app/ghost
- List of current settings from old instance

## Step 1: General Settings

### Export from Old Instance

1. Go to **Settings → General**
2. Document:
   - Site title
   - Site description
   - Site logo (download if custom)
   - Site icon (download if custom)
   - Publication language
   - Timezone
   - Publication cover image (download if custom)

### Import to Railway Ghost

1. Go to **Settings → General**
2. Update each setting:
   - **Site title:** "ReFi DAO"
   - **Site description:** [Copy from old instance]
   - **Site logo:** Upload logo file
   - **Site icon:** Upload icon file
   - **Publication language:** [Match old instance]
   - **Timezone:** [Match old instance]
   - **Publication cover:** Upload cover image
3. Save changes

## Step 2: Navigation Menu

### Export from Old Instance

1. Go to **Settings → Navigation**
2. Document navigation structure:
   - Roundups
   - Deep Dives
   - Event Retros
   - Podcasts
   - ReFi Radar
   - Community Stories

### Import to Railway Ghost

1. Go to **Settings → Navigation**
2. Recreate navigation items:
   - Click **Add navigation item**
   - Enter label and URL for each item
   - Drag to reorder if needed
3. Save changes

## Step 3: Social Accounts

### Export from Old Instance

1. Go to **Settings → General**
2. Scroll to **Social accounts**
3. Document:
   - Portal link
   - Contact link
   - Twitter/X
   - Facebook
   - Other social profiles

### Import to Railway Ghost

1. Go to **Settings → General**
2. Scroll to **Social accounts**
3. Add each social account:
   - Enter URL for each platform
   - Save changes

## Step 4: Code Injection

### Export from Old Instance

1. Go to **Settings → Code Injection**
2. Copy:
   - **Site Header** code
   - **Site Footer** code
3. Document any custom CSS or JavaScript

### Import to Railway Ghost

1. Go to **Settings → Code Injection**
2. Paste **Site Header** code
3. Paste **Site Footer** code
4. Save changes

## Step 5: Email Configuration

### Export from Old Instance

1. Go to **Settings → Email**
2. Document:
   - Email service provider
   - SMTP settings (if custom)
   - Newsletter settings

### Import to Railway Ghost

1. Go to **Settings → Email**
2. Configure email service:
   - Use Ghost's email service OR
   - Configure custom SMTP
3. Test email delivery
4. Save changes

## Step 6: Integrations

### Export from Old Instance

1. Go to **Settings → Integrations**
2. Document:
   - Custom integrations
   - Webhooks
   - API keys
   - Third-party services

### Import to Railway Ghost

1. Go to **Settings → Integrations**
2. Set up integrations:
   - Add custom integrations
   - Configure webhooks
   - Update API keys
   - Connect third-party services
3. Test each integration
4. Save changes

## Step 7: Members & Subscriptions

### Export from Old Instance

1. Go to **Settings → Members**
2. Document:
   - Membership settings
   - Subscription settings
   - Payment configuration

### Import to Railway Ghost

1. Go to **Settings → Members**
2. Configure:
   - Membership settings
   - Subscription options
   - Payment integration (Stripe, etc.)
3. Test subscription flow
4. Save changes

## Step 8: Labs & Beta Features

### Export from Old Instance

1. Go to **Settings → Labs**
2. Document:
   - Enabled beta features
   - Experimental features

### Import to Railway Ghost

1. Go to **Settings → Labs**
2. Enable same features:
   - Match beta features from old instance
   - Enable experimental features if needed
3. Save changes

## Verification Checklist

- [ ] General settings match
- [ ] Navigation menu recreated
- [ ] Social accounts configured
- [ ] Code injection applied
- [ ] Email configured and tested
- [ ] Integrations working
- [ ] Members/subscriptions configured
- [ ] Theme settings match
- [ ] All customizations applied

## Notes

- Take screenshots before and after for comparison
- Test each setting after applying
- Keep backup of all settings
- Document any differences or issues
