#!/usr/bin/env node

/**
 * Update Image References in Ghost Posts
 * 
 * Updates image URLs in posts to point to new Ghost instance URLs
 */

import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command-line arguments
function parseArgs() {
    const args = {
        url: process.env.GHOST_URL,
        'admin-key': process.env.GHOST_ADMIN_KEY,
        'old-url': 'https://blog.refidao.com',
        'new-url': null, // Cloudinary base URL if needed
        inventory: join(__dirname, 'downloaded-images', 'upload-report.json'),
        'dry-run': false,
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
        } else if (i === 2) {
            args.url = process.argv[i];
        } else if (i === 3) {
            args['admin-key'] = process.argv[i];
        }
    }
    return args;
}

const cliArgs = parseArgs();
const GHOST_URL = cliArgs.url || 'https://ghost-production-616f.up.railway.app';
const GHOST_ADMIN_KEY = cliArgs['admin-key'] || '6929c401a0ccca000169ed2c:5952e13e963f181604f119deec1fbfc2cbded159ce96473aef92a5d3b8e0c39f';
const OLD_URL = cliArgs['old-url'] || 'https://blog.refidao.com';
const NEW_URL_BASE = cliArgs['new-url']; // Optional: Cloudinary base URL
const UPLOAD_REPORT = cliArgs.inventory || join(__dirname, 'downloaded-images', 'upload-report.json');
const DRY_RUN = cliArgs['dry-run'] || false;

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

    async request(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const url = `${this.url}/ghost/api/admin${endpoint}`;
            const token = this.generateToken();
            
            const requestOptions = {
                method: options.method || 'GET',
                headers: {
                    'Authorization': `Ghost ${token}`,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            };

            if (options.body) {
                requestOptions.body = JSON.stringify(options.body);
            }

            const req = https.request(url, requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(json);
                        } else {
                            reject(new Error(`API error: ${res.statusCode} - ${JSON.stringify(json)}`));
                        }
                    } catch (e) {
                        reject(new Error(`Failed to parse: ${e.message}`));
                    }
                });
            });

            req.on('error', reject);
            if (options.body) {
                req.write(JSON.stringify(options.body));
            }
            req.end();
        });
    }

    async getPost(postId) {
        const response = await this.request(`/posts/${postId}/?formats=html,mobiledoc`);
        return response.posts[0];
    }

    async updatePost(postId, postData) {
        return this.request(`/posts/${postId}/`, {
            method: 'PUT',
            body: { posts: [postData] },
        });
    }

    async getAllPosts() {
        const posts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await this.request(`/posts/?limit=100&page=${page}&formats=html,mobiledoc`);
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
}

function extractFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return basename(urlObj.pathname).split('?')[0].split('#')[0];
    } catch (e) {
        const parts = url.split('/');
        return parts[parts.length - 1].split('?')[0].split('#')[0];
    }
}

function normalizeFilename(filename) {
    return filename.toLowerCase().replace(/[^a-z0-9.-]/g, '');
}

function buildUrlMapping(uploadReport) {
    const mapping = new Map();
    
    if (uploadReport.uploaded) {
        uploadReport.uploaded.forEach(item => {
            const filename = normalizeFilename(item.filename);
            const url = item.url;
            
            // Map by filename
            mapping.set(filename, url);
            
            // Map by URL filename (in case filename differs)
            const urlFilename = normalizeFilename(extractFilenameFromUrl(url));
            if (urlFilename !== filename) {
                mapping.set(urlFilename, url);
            }
            
            // Map by original URL if different
            if (item.originalUrl) {
                const originalFilename = normalizeFilename(extractFilenameFromUrl(item.originalUrl));
                mapping.set(originalFilename, url);
            }
        });
    }

    return mapping;
}

function replaceImageUrls(html, urlMapping, oldBaseUrls) {
    if (!html) return html;
    
    let updated = html;
    const oldUrls = Array.isArray(oldBaseUrls) ? oldBaseUrls : [oldBaseUrls];
    
    // Replace old domain URLs (blog.refidao.com, old Railway domains, etc.)
    oldUrls.forEach(oldBaseUrl => {
        // Full URLs with old domain
        updated = updated.replace(
            new RegExp(oldBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/content/images/[^"\'\\s<>]+', 'gi'),
            (match) => {
                // Skip if already Cloudinary URL
                if (match.includes('res.cloudinary.com')) return match;
                
                const filename = normalizeFilename(extractFilenameFromUrl(match));
                const newUrl = urlMapping.get(filename);
                return newUrl || match;
            }
        );
        
        // Also handle Railway domains
        updated = updated.replace(
            /https?:\/\/[^\/]+\.up\.railway\.app\/content\/images\/[^"\'\\s<>]+/gi,
            (match) => {
                // Skip if already Cloudinary URL
                if (match.includes('res.cloudinary.com')) return match;
                
                const filename = normalizeFilename(extractFilenameFromUrl(match));
                const newUrl = urlMapping.get(filename);
                return newUrl || match;
            }
        );
    });

    // Replace relative paths
    updated = updated.replace(
        /src=["'](\/content\/images\/[^"']+)["']/gi,
        (match, path) => {
            const filename = normalizeFilename(extractFilenameFromUrl(path));
            const newUrl = urlMapping.get(filename);
            return newUrl ? `src="${newUrl}"` : match;
        }
    );

    return updated;
}

function updateMobiledocImages(mobiledoc, urlMapping, oldBaseUrls) {
    if (!mobiledoc) return mobiledoc;
    
    try {
        const doc = typeof mobiledoc === 'string' ? JSON.parse(mobiledoc) : mobiledoc;
        if (!doc.cards || !Array.isArray(doc.cards)) return mobiledoc;
        
        let updated = false;
        const oldUrls = Array.isArray(oldBaseUrls) ? oldBaseUrls : [oldBaseUrls];
        
        doc.cards.forEach(card => {
            if (card && Array.isArray(card)) {
                const [cardName, cardData] = card;
                
                // Handle image cards
                if (cardName === 'image' && cardData && cardData.src) {
                    const src = cardData.src;
                    
                    // Skip if already Cloudinary URL
                    if (src.includes('res.cloudinary.com')) return;
                    
                    // Check if URL needs updating
                    const needsUpdate = oldUrls.some(oldUrl => 
                        src.includes(oldUrl) || 
                        src.startsWith('/content/images/') ||
                        src.includes('.up.railway.app/content/images/')
                    );
                    
                    if (needsUpdate) {
                        const filename = normalizeFilename(extractFilenameFromUrl(src));
                        const newUrl = urlMapping.get(filename);
                        if (newUrl) {
                            cardData.src = newUrl;
                            updated = true;
                        }
                    }
                }
            }
        });
        
        return updated ? JSON.stringify(doc) : mobiledoc;
    } catch (e) {
        // If mobiledoc parsing fails, return as-is
        return mobiledoc;
    }
}

async function updateImageReferences() {
    console.log('🔄 Updating Image References in Posts\n');
    console.log(`Ghost URL: ${GHOST_URL}`);
    console.log(`Old URL: ${OLD_URL}`);
    console.log(`Upload report: ${UPLOAD_REPORT}`);
    console.log(`Dry run: ${DRY_RUN ? 'YES' : 'NO'}\n`);

    // Load upload report
    console.log('📖 Loading upload report...');
    const uploadReport = JSON.parse(readFileSync(UPLOAD_REPORT, 'utf-8'));
    const urlMapping = buildUrlMapping(uploadReport);
    console.log(`  Loaded ${urlMapping.size} image mappings\n`);

    const api = new GhostAPI(GHOST_URL, GHOST_ADMIN_KEY);

    // Get all posts
    console.log('📥 Fetching posts...');
    const posts = await api.getAllPosts();
    console.log(`  Found ${posts.length} posts\n`);

    const results = {
        updated: [],
        skipped: [],
        failed: [],
    };

    // Build list of old URLs to replace
    const oldUrls = [
        OLD_URL,
        'https://ghost-production-d773.up.railway.app',
        'https://ghost-production-616f.up.railway.app',
    ].filter(Boolean);

    for (const post of posts) {
        let needsUpdate = false;
        const updates = {};

        // Check feature image
        if (post.feature_image) {
            // Skip if already Cloudinary URL
            if (!post.feature_image.includes('res.cloudinary.com')) {
                const filename = normalizeFilename(extractFilenameFromUrl(post.feature_image));
                const newUrl = urlMapping.get(filename);
                
                if (newUrl && post.feature_image !== newUrl) {
                    updates.feature_image = newUrl;
                    needsUpdate = true;
                }
            }
        }

        // Check HTML content
        if (post.html) {
            const updatedHtml = replaceImageUrls(post.html, urlMapping, oldUrls);
            if (updatedHtml !== post.html) {
                updates.html = updatedHtml;
                needsUpdate = true;
            }
        }

        // Check mobiledoc content
        if (post.mobiledoc) {
            const updatedMobiledoc = updateMobiledocImages(post.mobiledoc, urlMapping, oldUrls);
            if (updatedMobiledoc !== post.mobiledoc) {
                updates.mobiledoc = updatedMobiledoc;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            if (DRY_RUN) {
                console.log(`  [DRY RUN] Would update: ${post.title.substring(0, 50)}...`);
                results.updated.push({ post: post.title, updates });
            } else {
                try {
                    // Get full post data for update
                    const fullPost = await api.getPost(post.id);
                    const updateData = {
                        ...fullPost,
                        ...updates,
                        updated_at: fullPost.updated_at,
                        updated_by: fullPost.updated_by,
                    };

                    await api.updatePost(post.id, updateData);
                    console.log(`  ✅ Updated: ${post.title.substring(0, 50)}...`);
                    results.updated.push({ post: post.title, updates });
                } catch (error) {
                    console.error(`  ❌ Failed: ${post.title.substring(0, 50)}... - ${error.message}`);
                    results.failed.push({ post: post.title, error: error.message });
                }
            }
        } else {
            results.skipped.push({ post: post.title });
        }
    }

    console.log('\n📊 Update Summary:');
    console.log(`  Updated: ${results.updated.length} ✅`);
    console.log(`  Skipped: ${results.skipped.length} ⏭️`);
    console.log(`  Failed: ${results.failed.length} ❌`);

    if (DRY_RUN) {
        console.log('\n💡 This was a dry run. Remove --dry-run to apply changes.');
    }

    return results;
}

updateImageReferences().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
