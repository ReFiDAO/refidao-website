#!/bin/bash
# Railway CLI Setup Script
# Run this first to authenticate and link to the project

set -e

echo "🚂 Railway CLI Setup"
echo "===================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
else
    echo "✅ Railway CLI installed: $(railway --version)"
fi

echo ""
echo "Step 1: Authenticate with Railway"
echo "----------------------------------"
echo "This will open your browser for authentication."
echo ""
read -p "Press Enter to continue with 'railway login'..."
railway login

echo ""
echo "Step 2: Link to Project"
echo "-----------------------"
echo "Linking to project: e826dec7-c9e6-44cf-bc0c-77df53289e97"
railway link -p e826dec7-c9e6-44cf-bc0c-77df53289e97

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next: Run ./railway-cli-verify.sh to verify the configuration"
