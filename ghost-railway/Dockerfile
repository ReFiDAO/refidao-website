# Ghost Dockerfile with Cloudinary Storage Adapter
# 
# This Dockerfile extends the official Ghost image and adds
# the Cloudinary storage adapter for external image storage.
#
# Usage:
# 1. Copy this file to your Railway project root
# 2. Railway will automatically detect and use it
# 3. Set environment variables in Railway dashboard
# 4. Redeploy the service

FROM ghost:latest

# Install Cloudinary storage adapter
# This allows Ghost to store images in Cloudinary instead of local storage
RUN npm install ghost-storage-cloudinary --save

# Note: Storage configuration is done via environment variables:
# - storage__active=cloudinary
# - storage__cloudinary__cloud_name=<your-cloud-name>
# - storage__cloudinary__api_key=<your-api-key>
# - storage__cloudinary__api_secret=<your-api-secret>
#
# These should be set in Railway dashboard → Variables

# Expose Ghost port (default: 2368)
EXPOSE 2368

# Use Ghost's default entrypoint
CMD ["node", "current/index.js"]
