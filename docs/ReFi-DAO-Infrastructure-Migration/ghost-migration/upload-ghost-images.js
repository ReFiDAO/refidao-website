#!/usr/bin/env node

/**
 * Upload Ghost Images
 * 
 * Uploads images to Ghost instance using Admin API with JWT authentication
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import http from 'http';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GHOST_URL = process.env.GHOST_URL || process.argv[2] || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY || process.argv[3] || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';
const IMAGES_DIR = process.argv[4] || join(__dirname, 'downloaded-images');
const CONCURRENT_UPLOADS = 3;

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

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
                filename: basename(imagePath),
                contentType: this.getContentType(imagePath),
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

            const client = url.protocol === 'https:' ? https : http;
            const req = client.request(url, options, (res) => {
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

    getContentType(filePath) {
        const ext = extname(filePath).toLowerCase();
        const types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
        };
        return types[ext] || 'application/octet-stream';
    }
}

function getImageFiles(dir) {
    const files = readdirSync(dir);
    return files
        .filter(file => {
            const ext = extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        })
        .map(file => join(dir, file));
}

async function uploadImages() {
    console.log('📤 Uploading Images to Ghost\n');
    console.log(`Ghost URL: ${GHOST_URL}`);
    console.log(`Images directory: ${IMAGES_DIR}\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);

    // Get image files
    const imageFiles = getImageFiles(IMAGES_DIR);
    console.log(`Found ${imageFiles.length} image files\n`);

    const results = {
        uploaded: [],
        failed: [],
    };

    // Upload with concurrency control
    let currentUploads = 0;
    let index = 0;

    async function uploadNext() {
        if (index >= imageFiles.length) {
            return;
        }

        const imagePath = imageFiles[index++];
        const filename = basename(imagePath);
        currentUploads++;

        try {
            console.log(`Uploading ${index}/${imageFiles.length}: ${filename}...`);
            const result = await api.uploadImage(imagePath);
            
            results.uploaded.push({
                filename,
                originalPath: imagePath,
                url: result.images?.[0]?.url || result.url,
                ref: result.images?.[0]?.ref || result.ref,
            });
            
            console.log(`  ✅ Uploaded: ${result.images?.[0]?.url || result.url}`);
        } catch (error) {
            results.failed.push({
                filename,
                error: error.message,
            });
            console.error(`  ❌ Failed: ${error.message}`);
        } finally {
            currentUploads--;
            if (index < imageFiles.length) {
                await uploadNext();
            }
        }
    }

    // Start concurrent uploads
    console.log(`Starting uploads (max ${CONCURRENT_UPLOADS} concurrent)...\n`);
    const uploadPromises = [];
    for (let i = 0; i < CONCURRENT_UPLOADS && i < imageFiles.length; i++) {
        uploadPromises.push(uploadNext());
    }

    await Promise.all(uploadPromises);

    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        ghostUrl: GHOST_URL,
        total: imageFiles.length,
        uploaded: results.uploaded.length,
        failed: results.failed.length,
        uploaded: results.uploaded,
        failed: results.failed,
    };

    const reportPath = join(IMAGES_DIR, 'upload-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    console.log('\n📊 Upload Summary:');
    console.log(`  Total files: ${imageFiles.length}`);
    console.log(`  Uploaded: ${results.uploaded.length} ✅`);
    console.log(`  Failed: ${results.failed.length} ❌`);
    console.log(`\n💾 Report saved to: ${reportPath}`);

    if (results.failed.length > 0) {
        console.log(`\n⚠️  ${results.failed.length} images failed to upload. Check report for details.`);
    }

    return report;
}

uploadImages().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
