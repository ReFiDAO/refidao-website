#!/usr/bin/env node

/**
 * Test Image Access Script
 * 
 * Tests if image URLs are actually accessible
 */

import https from 'https';
import http from 'http';
import jwt from 'jsonwebtoken';

const GHOST_URL = process.env.GHOST_URL || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';

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

    async getPosts(limit = 10) {
        const response = await this.request(`/posts/?limit=${limit}&fields=id,title,feature_image`);
        return response.posts || [];
    }
}

function testImageUrl(url) {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) {
            resolve({ accessible: false, error: 'Invalid URL' });
            return;
        }

        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { timeout: 5000 }, (res) => {
            if (res.statusCode === 200) {
                resolve({ accessible: true, statusCode: res.statusCode });
            } else {
                resolve({ accessible: false, statusCode: res.statusCode });
            }
            res.destroy();
        });

        req.on('error', (err) => {
            resolve({ accessible: false, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ accessible: false, error: 'Timeout' });
        });
    });
}

async function testImageAccess() {
    console.log('🧪 Testing Image Access\n');
    console.log(`Ghost URL: ${GHOST_URL}\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);
    
    try {
        const posts = await api.getPosts(10);
        console.log(`Testing images from ${posts.length} posts...\n`);

        let accessible = 0;
        let inaccessible = 0;
        const issues = [];

        for (const post of posts) {
            if (post.feature_image) {
                console.log(`Testing: ${post.title.substring(0, 50)}...`);
                console.log(`  URL: ${post.feature_image}`);
                
                const result = await testImageUrl(post.feature_image);
                
                if (result.accessible) {
                    console.log(`  ✅ Accessible (${result.statusCode})\n`);
                    accessible++;
                } else {
                    console.log(`  ❌ Not accessible: ${result.error || `Status ${result.statusCode}`}\n`);
                    inaccessible++;
                    issues.push({
                        post: post.title,
                        url: post.feature_image,
                        error: result.error || `Status ${result.statusCode}`,
                    });
                }
            }
        }

        console.log('\n📊 Results:');
        console.log(`  Accessible: ${accessible}`);
        console.log(`  Inaccessible: ${inaccessible}`);

        if (issues.length > 0) {
            console.log('\n⚠️  Issues found:');
            issues.forEach((issue, idx) => {
                console.log(`  ${idx + 1}. ${issue.post}`);
                console.log(`     URL: ${issue.url}`);
                console.log(`     Error: ${issue.error}\n`);
            });
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testImageAccess();
