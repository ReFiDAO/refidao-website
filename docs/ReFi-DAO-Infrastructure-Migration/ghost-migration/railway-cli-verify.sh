#!/bin/bash
# Railway CLI Verification Script
# Run this after: railway login && railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97

set -e

echo "🔍 Railway CLI Verification"
echo "============================"
echo ""

# Check if authenticated
echo "1. Checking authentication..."
if railway whoami > /dev/null 2>&1; then
    echo "   ✅ Authenticated as: $(railway whoami)"
else
    echo "   ❌ Not authenticated. Run: railway login"
    exit 1
fi

# Check project link
echo ""
echo "2. Checking project link..."
if railway status > /dev/null 2>&1; then
    echo "   ✅ Project linked"
else
    echo "   ❌ Not linked. Run: railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97"
    exit 1
fi

# Check environment variables
echo ""
echo "3. Checking Cloudinary environment variables..."
VARS=$(railway variables 2>/dev/null || echo "")

REQUIRED_VARS=(
    "storage__active"
    "storage__cloudinary__cloud_name"
    "storage__cloudinary__api_key"
    "storage__cloudinary__api_secret"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if echo "$VARS" | grep -q "$var"; then
        echo "   ✅ $var is set"
    else
        echo "   ❌ $var is missing"
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "   Missing variables: ${MISSING_VARS[*]}"
    echo "   Set them with: railway variables set <key>=<value>"
fi

# Check service status
echo ""
echo "4. Checking service status..."
railway status

# Get latest deployment logs
echo ""
echo "5. Checking latest deployment logs for Cloudinary installation..."
echo "   (Looking for 'npm install ghost-storage-cloudinary')"
echo ""

# Try to get deployment logs
if railway logs --deployment latest 2>/dev/null | grep -q "ghost-storage-cloudinary"; then
    echo "   ✅ Cloudinary adapter found in build logs"
else
    echo "   ⚠️  Cloudinary adapter not found in latest logs"
    echo "   Checking recent logs..."
    railway logs --tail 100 | grep -i "cloudinary\|storage" || echo "   No Cloudinary-related logs found"
fi

# Check for ENOSPC errors
echo ""
echo "6. Checking for storage errors..."
if railway logs --tail 200 2>/dev/null | grep -q "ENOSPC\|no space left"; then
    echo "   ⚠️  ENOSPC errors detected in logs"
    echo "   This indicates storage is full"
else
    echo "   ✅ No ENOSPC errors in recent logs"
fi

echo ""
echo "============================"
echo "Verification complete!"
echo ""
echo "Next steps:"
echo "- If Cloudinary is installed but ENOSPC errors persist, recreate the service"
echo "- If Cloudinary is not installed, check Dockerfile and redeploy"
echo "- If variables are missing, set them with: railway variables set <key>=<value>"
