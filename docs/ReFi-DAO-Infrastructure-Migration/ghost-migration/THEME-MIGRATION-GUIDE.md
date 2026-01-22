# Theme Migration Guide

## Overview

This guide covers migrating the Ghost theme from the old managed instance to the Railway deployment.

## Prerequisites

- Access to old Ghost admin: https://blog.refidao.com/ghost
- Access to new Ghost admin: https://ghost-production-616f.up.railway.app/ghost
- Theme export file (ZIP)

## Step 1: Export Theme from Old Instance

1. **Access Old Ghost Admin**
   - Navigate to: https://blog.refidao.com/ghost
   - Log in with admin credentials

2. **Export Theme**
   - Go to **Settings → Design**
   - Find the active theme
   - Click **Download** (or **Actions → Download**)
   - Save the ZIP file locally
   - Note the theme name and version

3. **Document Customizations**
   - Check **Settings → Code Injection** for:
     - Site Header code
     - Site Footer code
   - Check **Settings → Design → Theme Settings** for custom settings
   - Take screenshots of the current design for reference

## Step 2: Import Theme to Railway Ghost

1. **Access Railway Ghost Admin**
   - Navigate to: https://ghost-production-616f.up.railway.app/ghost
   - Log in with admin credentials

2. **Upload Theme**
   - Go to **Settings → Design**
   - Click **Change theme**
   - Click **Upload theme**
   - Select the theme ZIP file
   - Wait for upload to complete

3. **Activate Theme**
   - Once uploaded, click **Activate** on the theme
   - Theme should now be active

## Step 3: Apply Customizations

1. **Code Injection**
   - Go to **Settings → Code Injection**
   - Add Site Header code (from old instance)
   - Add Site Footer code (from old instance)
   - Save changes

2. **Theme Settings**
   - Go to **Settings → Design**
   - Click on the active theme to open settings
   - Configure theme settings to match old instance
   - Save changes

3. **Navigation Menu**
   - Go to **Settings → Navigation**
   - Recreate navigation structure:
     - Roundups
     - Deep Dives
     - Event Retros
     - Podcasts
     - ReFi Radar
     - Community Stories
   - Save changes

## Step 4: Verify Theme

1. **Homepage**
   - Visit: https://ghost-production-616f.up.railway.app
   - Check layout matches original
   - Verify images and styling

2. **Post Pages**
   - Visit several post pages
   - Check post layout
   - Verify typography and spacing

3. **Responsive Design**
   - Test on mobile devices
   - Test on tablet
   - Test on desktop
   - Verify responsive breakpoints work

4. **Custom Code**
   - Verify analytics scripts load (if added)
   - Check custom JavaScript works
   - Verify custom CSS applies correctly

## Troubleshooting

### Theme Not Uploading
- Check file size (Ghost has limits)
- Verify ZIP file is valid
- Check Ghost version compatibility

### Theme Looks Different
- Compare theme settings side-by-side
- Check for missing custom code injections
- Verify all assets loaded correctly

### Custom Code Not Working
- Check browser console for errors
- Verify code injection syntax
- Test code in isolation

## Notes

- Keep backup of theme ZIP file
- Document any customizations made
- Test thoroughly before DNS cutover
