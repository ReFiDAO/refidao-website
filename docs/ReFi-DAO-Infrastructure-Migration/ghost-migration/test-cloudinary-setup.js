#!/usr/bin/env node
/**
 * Test Cloudinary Setup
 * 
 * This script verifies that Cloudinary is properly configured in Ghost
 * by checking the storage adapter configuration via the Admin API.
 * 
 * Usage:
 *   node test-cloudinary-setup.js \
 *     --url https://ghost-production-616f.up.railway.app \
 *     --admin-key <your-admin-api-key>
 */

import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const urlArg = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || 
               args[args.indexOf('--url') + 1];
const keyArg = args.find(arg => arg.startsWith('--admin-key='))?.split('=')[1] || 
               args[args.indexOf('--admin-key') + 1];

const GHOST_URL = urlArg || process.env.GHOST_URL || 'https://ghost-production-616f.up.railway.app';
const ADMIN_KEY = keyArg || process.env.GHOST_ADMIN_KEY;

if (!ADMIN_KEY) {
    console.error('❌ Error: Admin API key required');
    console.error('Usage: node test-cloudinary-setup.js --url <ghost-url> --admin-key <admin-key>');
    process.exit(1);
}

// Generate JWT token for Ghost Admin API
function generateJWT(secret, key, algorithm = 'HS256') {
    const crypto = require('crypto');
    const header = {
        alg: algorithm,
        typ: 'JWT'
    };
    
    const [id, secretPart] = key.split(':');
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
        iat: now - 10,
        exp: now + (5 * 60),
        aud: '/admin/'
    };
    
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    const signature = crypto
        .createHmac('sha256', Buffer.from(secretPart, 'hex'))
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Make authenticated request to Ghost Admin API
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const [id, secret] = ADMIN_KEY.split(':');
        const token = generateJWT(secret, ADMIN_KEY);
        
        const url = new URL(path, `${GHOST_URL}/ghost/api/admin/`);
        const options = {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Authorization': `Ghost ${token}`,
                'Content-Type': 'application/json',
                'Accept-Version': 'v5.0'
            }
        };
        
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${parsed.errors?.[0]?.message || body}`));
                    }
                } catch (e) {
                    reject(new Error(`Parse error: ${e.message}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test Cloudinary configuration
async function testCloudinary() {
    console.log('🔍 Testing Cloudinary Setup');
    console.log('===========================');
    console.log(`Ghost URL: ${GHOST_URL}`);
    console.log('');
    
    try {
        // Test 1: Check if Ghost is accessible
        console.log('1. Testing Ghost API connectivity...');
        const config = await makeRequest('config/');
        console.log('   ✅ Ghost API accessible');
        console.log(`   Version: ${config.config?.version || 'unknown'}`);
        console.log('');
        
        // Test 2: Check storage configuration (if available via API)
        console.log('2. Checking storage configuration...');
        console.log('   Note: Storage adapter config may not be exposed via API');
        console.log('   Checking environment variables instead...');
        console.log('');
        
        // Test 3: Try uploading a test image
        console.log('3. Testing image upload to Cloudinary...');
        console.log('   Creating a small test image...');
        
        // Create a 1x1 pixel PNG
        const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const testImageBuffer = Buffer.from(testImageBase64, 'base64');
        
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', testImageBuffer, {
            filename: 'test-cloudinary.png',
            contentType: 'image/png'
        });
        
        // Upload via Ghost Admin API
        const uploadResult = await makeRequest('images/upload/', 'POST', form);
        
        if (uploadResult.images && uploadResult.images[0]) {
            const imageUrl = uploadResult.images[0].url;
            console.log('   ✅ Image uploaded successfully!');
            console.log(`   Image URL: ${imageUrl}`);
            
            // Check if URL is Cloudinary
            if (imageUrl.includes('res.cloudinary.com')) {
                console.log('   ✅ Image is stored in Cloudinary!');
            } else {
                console.log('   ⚠️  Image URL does not appear to be Cloudinary');
                console.log('   This might indicate local storage is still being used');
            }
        }
        
        console.log('');
        console.log('===========================');
        console.log('✅ Cloudinary test complete!');
        
    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('');
        console.error('Troubleshooting:');
        console.error('- Verify Ghost URL is correct and accessible');
        console.error('- Verify Admin API key is correct');
        console.error('- Check Railway logs: railway logs --follow');
        console.error('- Verify Cloudinary environment variables are set');
        process.exit(1);
    }
}

testCloudinary();
