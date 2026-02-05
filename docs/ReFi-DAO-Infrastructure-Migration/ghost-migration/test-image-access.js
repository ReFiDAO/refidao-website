#!/usr/bin/env node

/**
 * Test Image Access Script
 * 
 * Tests if image URLs are actually accessible
 */

import https from 'https';
import http from 'http';
import jwt from 'jsonwebtoken';
import { writeFileSync } from 'fs';

// Parse command-line arguments
function parseArgs() {
    const args = {
        url: process.env.GHOST_URL,
        'admin-key': process.env.GHOST_ADMIN_KEY,
        limit: 10,
        output: null,
    };

    for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i].startsWith('--')) {
            const key = process.argv[i].replace('--', '').replace(/-/g, '-');
            const value = process.argv[i + 1];
            if (value && !value.startsWith('--')) {
                args[key] = value;
                i++;
            } else {
                args[key] = true;
            }
        }
    }
    return args;
}

const cliArgs = parseArgs();
const GHOST_URL = cliArgs.url || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = cliArgs['admin-key'] || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';
const LIMIT = parseInt(cliArgs.limit) || 10;
const OUTPUT_FILE = cliArgs.output;

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
        const response = await this.request(`/posts/?limit=${limit}&formats=html,mobiledoc&fields=id,title,feature_image,html,mobiledoc`);
        return response.posts || [];
    }
}

function extractImageUrls(html) {
    if (!html) return [];
    const urls = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

function extractMobiledocImages(mobiledoc) {
    if (!mobiledoc) return [];
    const urls = [];
    try {
        const doc = typeof mobiledoc === 'string' ? JSON.parse(mobiledoc) : mobiledoc;
        if (doc.cards && Array.isArray(doc.cards)) {
            doc.cards.forEach(card => {
                if (card && Array.isArray(card)) {
                    const [cardName, cardData] = card;
                    if (cardName === 'image' && cardData && cardData.src) {
                        urls.push(cardData.src);
                    }
                }
            });
        }
    } catch (e) {
        // Ignore parsing errors
    }
    return urls;
}

function testImageUrl(url) {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) {
            resolve({ accessible: false, error: 'Invalid URL' });
            return;
        }

        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { timeout: 10000 }, (res) => {
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
    console.log(`Ghost URL: ${GHOST_URL}`);
    console.log(`Testing up to ${LIMIT} posts\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);
    
    try {
        const posts = await api.getPosts(LIMIT);
        console.log(`📥 Fetched ${posts.length} posts\n`);

        const allImages = [];
        const results = {
            timestamp: new Date().toISOString(),
            ghostUrl: GHOST_URL,
            postsTested: posts.length,
            totalImages: 0,
            accessible: 0,
            inaccessible: 0,
            issues: [],
        };

        // Collect all images
        for (const post of posts) {
            const postImages = [];
            
            // Feature image
            if (post.feature_image) {
                postImages.push({
                    type: 'feature_image',
                    url: post.feature_image,
                    postTitle: post.title,
                    postSlug: post.slug,
                });
            }

            // HTML images
            const htmlImages = extractImageUrls(post.html);
            htmlImages.forEach(url => {
                postImages.push({
                    type: 'html_content',
                    url: url,
                    postTitle: post.title,
                    postSlug: post.slug,
                });
            });

            // Mobiledoc images
            const mobiledocImages = extractMobiledocImages(post.mobiledoc);
            mobiledocImages.forEach(url => {
                postImages.push({
                    type: 'mobiledoc',
                    url: url,
                    postTitle: post.title,
                    postSlug: post.slug,
                });
            });

            allImages.push(...postImages);
        }

        // Remove duplicates
        const uniqueImages = new Map();
        allImages.forEach(img => {
            if (!uniqueImages.has(img.url)) {
                uniqueImages.set(img.url, img);
            }
        });

        results.totalImages = uniqueImages.size;
        console.log(`📸 Found ${results.totalImages} unique images to test\n`);

        // Test each image
        let tested = 0;
        for (const [url, imgInfo] of uniqueImages) {
            tested++;
            process.stdout.write(`\rTesting ${tested}/${results.totalImages}: ${imgInfo.postTitle.substring(0, 30)}...`);
            
            const result = await testImageUrl(url);
            
            if (result.accessible) {
                results.accessible++;
            } else {
                results.inaccessible++;
                results.issues.push({
                    ...imgInfo,
                    error: result.error || `Status ${result.statusCode}`,
                    statusCode: result.statusCode,
                });
            }
        }

        console.log('\n\n📊 Results:');
        console.log(`  Total images: ${results.totalImages}`);
        console.log(`  Accessible: ${results.accessible} ✅`);
        console.log(`  Inaccessible: ${results.inaccessible} ❌`);

        // Check Cloudinary usage
        const cloudinaryCount = Array.from(uniqueImages.keys()).filter(url => 
            url.includes('res.cloudinary.com')
        ).length;
        console.log(`  Cloudinary URLs: ${cloudinaryCount}`);

        if (results.issues.length > 0) {
            console.log('\n⚠️  Issues found:');
            results.issues.slice(0, 20).forEach((issue, idx) => {
                console.log(`  ${idx + 1}. ${issue.postTitle} (${issue.type})`);
                console.log(`     URL: ${issue.url}`);
                console.log(`     Error: ${issue.error}\n`);
            });
            if (results.issues.length > 20) {
                console.log(`  ... and ${results.issues.length - 20} more`);
            }
        }

        // Save report if output file specified
        if (OUTPUT_FILE) {
            writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
            console.log(`\n💾 Report saved to: ${OUTPUT_FILE}`);
        }

        return results;

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testImageAccess();
