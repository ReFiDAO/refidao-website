#!/usr/bin/env node

/**
 * Verify Cloudinary Setup
 * 
 * Tests if Cloudinary storage is properly configured in Ghost
 */

import https from 'https';
import jwt from 'jsonwebtoken';

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

    async request(endpoint) {
        return new Promise((resolve, reject) => {
            const url = `${this.url}/ghost/api/admin${endpoint}`;
            const token = this.generateToken();
            
            https.get(url, {
                headers: {
                    'Authorization': `Ghost ${token}`,
                },
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Failed to parse: ${e.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    async getPosts(limit = 5) {
        const response = await this.request(`/posts/?limit=${limit}&fields=id,title,feature_image`);
        return response.posts || [];
    }
}

function checkImageUrl(url) {
    if (!url) return { type: 'none', isCloudinary: false };
    
    if (url.includes('res.cloudinary.com')) {
        return { type: 'cloudinary', isCloudinary: true };
    }
    
    if (url.includes('ghost-production-616f.up.railway.app') || url.includes('blog.refidao.com')) {
        return { type: 'local', isCloudinary: false };
    }
    
    return { type: 'external', isCloudinary: false };
}

async function verifyCloudinarySetup() {
    console.log('🔍 Verifying Cloudinary Setup\n');
    console.log(`Ghost URL: ${GHOST_URL}\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);
    
    try {
        console.log('📥 Fetching recent posts to check image storage...');
        const posts = await api.getPosts(10);
        
        if (posts.length === 0) {
            console.log('⚠️  No posts found. Cannot verify storage.');
            return;
        }

        console.log(`\n📊 Checking ${posts.length} posts for image storage type...\n`);

        let cloudinaryCount = 0;
        let localCount = 0;
        let externalCount = 0;
        let noneCount = 0;

        for (const post of posts) {
            if (post.feature_image) {
                const check = checkImageUrl(post.feature_image);
                
                if (check.isCloudinary) {
                    cloudinaryCount++;
                    console.log(`  ✅ ${post.title.substring(0, 50)}...`);
                    console.log(`     Storage: Cloudinary (${post.feature_image.substring(0, 60)}...)\n`);
                } else if (check.type === 'local') {
                    localCount++;
                    console.log(`  ⚠️  ${post.title.substring(0, 50)}...`);
                    console.log(`     Storage: Local (${check.type})\n`);
                } else if (check.type === 'external') {
                    externalCount++;
                } else {
                    noneCount++;
                }
            }
        }

        console.log('\n📈 Storage Summary:');
        console.log(`  Cloudinary: ${cloudinaryCount} ✅`);
        console.log(`  Local: ${localCount} ⚠️`);
        console.log(`  External: ${externalCount}`);
        console.log(`  None: ${noneCount}`);

        if (cloudinaryCount > 0) {
            console.log('\n✅ Cloudinary storage is working!');
            console.log('   New images will be stored in Cloudinary.');
        } else if (localCount > 0) {
            console.log('\n⚠️  Cloudinary storage may not be configured yet.');
            console.log('   Images are still being stored locally.');
            console.log('\n💡 Check:');
            console.log('   1. Environment variables are set in Railway');
            console.log('   2. Dockerfile includes Cloudinary adapter');
            console.log('   3. Service has been redeployed');
        } else {
            console.log('\n💡 No images found to verify.');
            console.log('   Try uploading a test image in Ghost admin.');
        }

        return {
            cloudinary: cloudinaryCount,
            local: localCount,
            external: externalCount,
            none: noneCount,
            isConfigured: cloudinaryCount > 0,
        };

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

verifyCloudinarySetup();
