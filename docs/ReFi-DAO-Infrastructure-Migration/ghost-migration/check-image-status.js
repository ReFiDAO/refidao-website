#!/usr/bin/env node

/**
 * Check Image Status Script
 * 
 * Examines posts to identify broken image references and image URL patterns
 */

import https from 'https';
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

    async getPosts(limit = 20) {
        const response = await this.request(`/posts/?limit=${limit}&fields=id,title,slug,feature_image,html,url`);
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

function categorizeImageUrl(url) {
    if (!url) return 'none';
    if (url.includes('blog.refidao.com')) return 'old-domain';
    if (url.includes('ghost-production-616f.up.railway.app')) return 'new-domain';
    if (url.startsWith('/content/images/')) return 'relative-path';
    if (url.startsWith('http')) return 'external';
    return 'other';
}

async function checkImageStatus() {
    console.log('🔍 Checking Image Status\n');
    console.log(`Ghost URL: ${GHOST_URL}\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);
    
    try {
        const posts = await api.getPosts(20);
        console.log(`📊 Analyzing ${posts.length} posts...\n`);

        const stats = {
            total: posts.length,
            withFeatureImage: 0,
            withContentImages: 0,
            oldDomainImages: 0,
            newDomainImages: 0,
            relativePathImages: 0,
            externalImages: 0,
            brokenImages: 0,
        };

        const issues = [];

        for (const post of posts) {
            // Check feature image
            if (post.feature_image) {
                stats.withFeatureImage++;
                const featureType = categorizeImageUrl(post.feature_image);
                if (featureType === 'old-domain') stats.oldDomainImages++;
                if (featureType === 'new-domain') stats.newDomainImages++;
                if (featureType === 'relative-path') stats.relativePathImages++;
                if (featureType === 'external') stats.externalImages++;
                
                if (featureType === 'old-domain') {
                    issues.push({
                        post: post.title,
                        type: 'feature_image',
                        url: post.feature_image,
                        issue: 'Points to old domain',
                    });
                }
            }

            // Check content images
            const contentImages = extractImageUrls(post.html);
            if (contentImages.length > 0) {
                stats.withContentImages++;
                contentImages.forEach(url => {
                    const type = categorizeImageUrl(url);
                    if (type === 'old-domain') {
                        stats.oldDomainImages++;
                        issues.push({
                            post: post.title,
                            type: 'content_image',
                            url: url,
                            issue: 'Points to old domain',
                        });
                    }
                    if (type === 'new-domain') stats.newDomainImages++;
                    if (type === 'relative-path') stats.relativePathImages++;
                    if (type === 'external') stats.externalImages++;
                });
            }
        }

        // Print statistics
        console.log('📈 Image Statistics:');
        console.log(`  Total posts analyzed: ${stats.total}`);
        console.log(`  Posts with feature images: ${stats.withFeatureImage}`);
        console.log(`  Posts with content images: ${stats.withContentImages}`);
        console.log(`\n  Image URL Types:`);
        console.log(`    Old domain (blog.refidao.com): ${stats.oldDomainImages}`);
        console.log(`    New domain (railway): ${stats.newDomainImages}`);
        console.log(`    Relative paths: ${stats.relativePathImages}`);
        console.log(`    External URLs: ${stats.externalImages}`);

        // Print issues
        if (issues.length > 0) {
            console.log(`\n⚠️  Found ${issues.length} image issues:\n`);
            issues.slice(0, 10).forEach((issue, idx) => {
                console.log(`  ${idx + 1}. ${issue.post}`);
                console.log(`     Type: ${issue.type}`);
                console.log(`     URL: ${issue.url.substring(0, 80)}...`);
                console.log(`     Issue: ${issue.issue}\n`);
            });
            if (issues.length > 10) {
                console.log(`  ... and ${issues.length - 10} more issues\n`);
            }
        } else {
            console.log('\n✅ No image issues found!');
        }

        // Recommendations
        console.log('\n💡 Recommendations:');
        if (stats.oldDomainImages > 0) {
            console.log(`  - ${stats.oldDomainImages} images still point to old domain`);
            console.log(`  - Need to update image references in posts`);
            console.log(`  - Run update-image-references.js script`);
        }
        if (stats.relativePathImages > 0) {
            console.log(`  - ${stats.relativePathImages} images use relative paths`);
            console.log(`  - These should work if images are in correct location`);
        }
        if (stats.newDomainImages > 0) {
            console.log(`  - ${stats.newDomainImages} images point to new domain`);
            console.log(`  - These should be working correctly`);
        }

        return {
            stats,
            issues,
        };

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

checkImageStatus();
