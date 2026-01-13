#!/usr/bin/env node

/**
 * Test Cloudinary Upload
 * 
 * Tests if Cloudinary storage is working by uploading a small test image
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GHOST_URL = process.env.GHOST_URL || process.argv[2] || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY || process.argv[3] || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';

class GhostAPI {
    constructor(url, adminKey) {
        this.url = url.replace(/\/$/, '');
        this.adminKey = adminKey;
        const [id, secret] = adminKey.split(':');
        this.keyId = id;
        this.keySecret = secret;
    }

    generateToken() {
        return jwt.sign({}, Buffer.from(this.keySecret, 'hex'), {
            keyid: this.keyId,
            algorithm: 'HS256',
            expiresIn: '5m',
            audience: '/admin/',
        });
    }

    async uploadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            form.append('file', readFileSync(imagePath), {
                filename: 'test-image.png',
                contentType: 'image/png',
            });
            form.append('purpose', 'image');

            const token = this.generateToken();
            const url = new URL(`${this.url}/ghost/api/admin/images/upload/`);
            
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Ghost ${token}`,
                    ...form.getHeaders(),
                },
            };

            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (res.statusCode === 201 || res.statusCode === 200) {
                            resolve(json);
                        } else {
                            reject(new Error(`Upload failed: ${res.statusCode} - ${JSON.stringify(json)}`));
                        }
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${e.message}`));
                    }
                });
            });

            req.on('error', reject);
            form.pipe(req);
        });
    }
}

// Create a minimal 1x1 PNG image for testing
function createTestImage() {
    // Minimal 1x1 transparent PNG (43 bytes)
    const png = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const testImagePath = join(__dirname, 'test-image-cloudinary.png');
    writeFileSync(testImagePath, png);
    return testImagePath;
}

async function testCloudinaryUpload() {
    console.log('🧪 Testing Cloudinary Upload\n');
    console.log(`Ghost URL: ${GHOST_URL}\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);
    
    try {
        // Create test image
        console.log('📝 Creating test image...');
        const testImagePath = createTestImage();
        console.log(`✅ Test image created: ${testImagePath}\n`);

        // Upload test image
        console.log('📤 Uploading test image to Ghost...');
        const result = await api.uploadImage(testImagePath);
        
        const imageUrl = result.images?.[0]?.url || result.url;
        console.log(`✅ Upload successful!\n`);
        console.log(`Image URL: ${imageUrl}\n`);

        // Check if it's Cloudinary
        if (imageUrl.includes('res.cloudinary.com')) {
            console.log('✅ SUCCESS: Cloudinary storage is working!');
            console.log(`   Image is stored at: ${imageUrl}`);
            console.log(`   Cloud Name: ${imageUrl.match(/res\.cloudinary\.com\/([^\/]+)/)?.[1] || 'unknown'}`);
            return { success: true, isCloudinary: true, url: imageUrl };
        } else if (imageUrl.includes('ghost-production-616f.up.railway.app') || imageUrl.includes('blog.refidao.com')) {
            console.log('⚠️  WARNING: Image is still uploading to local storage');
            console.log(`   Image URL: ${imageUrl}`);
            console.log('\n💡 Cloudinary may not be configured correctly.');
            console.log('   Check:');
            console.log('   1. Environment variables are set in Railway');
            console.log('   2. Dockerfile includes Cloudinary adapter');
            console.log('   3. Service was redeployed after changes');
            return { success: true, isCloudinary: false, url: imageUrl };
        } else {
            console.log('⚠️  Image uploaded but URL format is unexpected');
            console.log(`   Image URL: ${imageUrl}`);
            return { success: true, isCloudinary: false, url: imageUrl };
        }

    } catch (error) {
        console.error('\n❌ Upload failed:', error.message);
        if (error.message.includes('ENOSPC')) {
            console.error('\n💡 Railway storage is full. Cloudinary should fix this!');
        }
        return { success: false, error: error.message };
    }
}

testCloudinaryUpload();
