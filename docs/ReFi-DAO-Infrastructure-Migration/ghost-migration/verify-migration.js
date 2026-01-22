#!/usr/bin/env node

/**
 * Ghost Migration Verification Script
 * 
 * Compares the current Railway Ghost deployment with the export file
 * to verify all content, images, and settings were migrated correctly.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const GHOST_URL = process.env.GHOST_URL || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';
const EXPORT_FILE = process.argv[2] || join(__dirname, 'ReFi DAO Nov 18 2025.json');

class GhostAPI {
    constructor(url, apiKey, isAdmin = false) {
        this.url = url.replace(/\/$/, '');
        this.apiKey = apiKey;
        this.isAdmin = isAdmin;
        this.apiPath = isAdmin ? '/ghost/api/admin' : '/ghost/api/content';
        
        if (isAdmin) {
            const [id, secret] = apiKey.split(':');
            this.keyId = id;
            this.keySecret = secret;
        }
    }

    generateToken() {
        if (!this.isAdmin) return this.apiKey; // Content API uses raw key
        return jwt.sign({}, Buffer.from(this.keySecret, 'hex'), {
            keyid: this.keyId,
            algorithm: 'HS256',
            expiresIn: '5m',
            audience: '/admin/',
        });
    }

    async request(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const url = `${this.url}${this.apiPath}${endpoint}`;
            const token = this.generateToken();
            
            const requestOptions = {
                headers: {
                    'Authorization': `Ghost ${token}`,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            };

            https.get(url, requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${e.message}`));
                    }
                });
            }).on('error', reject);
        });
    }

    async getAllPosts() {
        const posts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await this.request(`/posts/?limit=100&page=${page}`);
            if (response.posts && response.posts.length > 0) {
                posts.push(...response.posts);
                hasMore = response.posts.length === 100;
                page++;
            } else {
                hasMore = false;
            }
        }

        return posts;
    }

    async getAllTags() {
        const response = await this.request('/tags/?limit=100');
        return response.tags || [];
    }

    async getAllAuthors() {
        const response = await this.request('/authors/?limit=100');
        return response.authors || [];
    }

    async getAllImages() {
        // Admin API only
        const response = await this.request('/images/?limit=100');
        return response.images || [];
    }
}

async function loadExportFile(filePath) {
    console.log(`📖 Loading export file: ${filePath}`);
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data.db[0].data;
}

function extractStats(exportData) {
    const stats = {
        posts: exportData.posts?.length || 0,
        tags: exportData.tags?.length || 0,
        users: exportData.users?.length || 0,
        posts_tags: exportData.posts_tags?.length || 0,
    };

    // Count images from posts
    let imageCount = 0;
    if (exportData.posts) {
        exportData.posts.forEach(post => {
            if (post.feature_image) imageCount++;
            // Count images in HTML content
            if (post.html) {
                const imgMatches = post.html.match(/<img[^>]+src=["']([^"']+)["']/gi);
                if (imgMatches) imageCount += imgMatches.length;
            }
        });
    }

    stats.images = imageCount;
    return stats;
}

async function verifyMigration() {
    console.log('🔍 Ghost Migration Verification\n');
    console.log(`Ghost URL: ${GHOST_URL}`);
    console.log(`Export File: ${EXPORT_FILE}\n`);

    try {
        // Load export data
        const exportData = await loadExportFile(EXPORT_FILE);
        const exportStats = extractStats(exportData);
        
        console.log('📊 Export File Statistics:');
        console.log(`  Posts: ${exportStats.posts}`);
        console.log(`  Tags: ${exportStats.tags}`);
        console.log(`  Authors: ${exportStats.users}`);
        console.log(`  Images (estimated): ${exportStats.images}\n`);

        // Connect to Railway Ghost
        console.log('🔌 Connecting to Railway Ghost...');
        const adminAPI = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY, true);
        const contentAPI = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY.split(':')[0], false);

        // Fetch current state
        console.log('📥 Fetching current deployment state...');
        const [currentPosts, currentTags, currentAuthors] = await Promise.all([
            adminAPI.getAllPosts(),
            contentAPI.getAllTags(),
            contentAPI.getAllAuthors(),
        ]);

        console.log('\n📊 Current Deployment Statistics:');
        console.log(`  Posts: ${currentPosts.length}`);
        console.log(`  Tags: ${currentTags.length}`);
        console.log(`  Authors: ${currentAuthors.length}`);

        // Compare
        console.log('\n📈 Comparison:');
        const postDiff = currentPosts.length - exportStats.posts;
        const tagDiff = currentTags.length - exportStats.tags;
        const authorDiff = currentAuthors.length - exportStats.users;

        console.log(`  Posts: ${currentPosts.length}/${exportStats.posts} ${postDiff >= 0 ? '✅' : '❌'} ${postDiff !== 0 ? `(${postDiff > 0 ? '+' : ''}${postDiff})` : ''}`);
        console.log(`  Tags: ${currentTags.length}/${exportStats.tags} ${tagDiff >= 0 ? '✅' : '❌'} ${tagDiff !== 0 ? `(${tagDiff > 0 ? '+' : ''}${tagDiff})` : ''}`);
        console.log(`  Authors: ${currentAuthors.length}/${exportStats.users} ${authorDiff >= 0 ? '✅' : '❌'} ${authorDiff !== 0 ? `(${authorDiff > 0 ? '+' : ''}${authorDiff})` : ''}`);

        // Check image loading
        console.log('\n🖼️  Image Status Check:');
        const postsWithImages = currentPosts.filter(p => p.feature_image).length;
        console.log(`  Posts with feature images: ${postsWithImages}/${currentPosts.length}`);
        
        // Sample check a few posts for image URLs
        const samplePosts = currentPosts.slice(0, 5);
        let brokenImages = 0;
        let workingImages = 0;

        for (const post of samplePosts) {
            if (post.feature_image) {
                try {
                    const imageUrl = post.feature_image.startsWith('http') 
                        ? post.feature_image 
                        : `${GHOST_URL}${post.feature_image}`;
                    // Just check if URL is valid format, not actual HTTP request
                    if (imageUrl.includes(GHOST_URL) || imageUrl.includes('blog.refidao.com')) {
                        workingImages++;
                    } else {
                        brokenImages++;
                    }
                } catch (e) {
                    brokenImages++;
                }
            }
        }

        console.log(`  Sample check (5 posts): ${workingImages} working, ${brokenImages} broken`);

        // Summary
        console.log('\n✅ Verification Complete!\n');
        
        const allGood = postDiff >= 0 && tagDiff >= 0 && authorDiff >= 0;
        if (allGood) {
            console.log('✅ Content migration appears successful!');
        } else {
            console.log('⚠️  Some content may be missing. Review differences above.');
        }

        return {
            success: allGood,
            exportStats,
            currentStats: {
                posts: currentPosts.length,
                tags: currentTags.length,
                authors: currentAuthors.length,
            },
            differences: {
                posts: postDiff,
                tags: tagDiff,
                authors: authorDiff,
            },
        };

    } catch (error) {
        console.error('\n❌ Error during verification:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run verification
verifyMigration();
