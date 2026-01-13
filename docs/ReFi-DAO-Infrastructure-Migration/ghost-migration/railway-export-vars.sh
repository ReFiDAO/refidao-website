#!/bin/bash
# Export Railway Environment Variables
# Run this to save all current variables before recreating the service

set -e

OUTPUT_FILE="railway-vars-export-$(date +%Y%m%d-%H%M%S).txt"

echo "📥 Exporting Railway Environment Variables"
echo "=========================================="
echo ""

# Check authentication
if ! railway whoami > /dev/null 2>&1; then
    echo "❌ Not authenticated. Run: railway login"
    exit 1
fi

# Export variables
echo "Exporting variables to: $OUTPUT_FILE"
railway variables > "$OUTPUT_FILE"

echo ""
echo "✅ Variables exported!"
echo ""
echo "File: $OUTPUT_FILE"
echo ""
echo "Review this file and use it to set variables in the new service:"
echo "  railway variables set <key>=<value>"
