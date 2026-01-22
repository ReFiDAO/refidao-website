#!/usr/bin/env node

/**
 * Download Ghost Images
 * 
 * Downloads images from the image-urls.json inventory file
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream, unlinkSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INVENTORY_FILE = process.argv[2] || join(__dirname, 'image-urls.json');
const OUTPUT_DIR = process.argv[3] || join(__dirname, 'downloaded-images');
const CONCURRENT_DOWNLOADS = 5;

function normalizeUrl(url) {
    if (!url) return null;
    // Handle relative URLs
    if (url.startsWith('/content/images/')) {
        return `https://blog.refidao.com${url}`;
    }
    // Handle full URLs
    if (url.startsWith('http')) {
        return url;
    }
    return null;
}

function extractFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = basename(pathname);
        // Clean filename - remove query params and hash
        return filename.split('?')[0].split('#')[0];
    } catch (e) {
        // Fallback for relative URLs
        const parts = url.split('/');
        return parts[parts.length - 1].split('?')[0].split('#')[0];
    }
}

function downloadImage(url, outputPath) {
    return new Promise((resolve, reject) => {
        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) {
            reject(new Error('Invalid URL'));
            return;
        }

        const client = normalizedUrl.startsWith('https') ? https : http;
        
        const req = client.get(normalizedUrl, { timeout: 30000 }, (res) => {
            if (res.statusCode === 200) {
                const fileStream = createWriteStream(outputPath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve({ success: true, size: res.headers['content-length'] });
                });
                fileStream.on('error', (err) => {
                    if (existsSync(outputPath)) {
                        unlinkSync(outputPath);
                    }
                    reject(err);
                });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                // Handle redirects
                const redirectUrl = res.headers.location;
                if (redirectUrl) {
                    downloadImage(redirectUrl, outputPath).then(resolve).catch(reject);
                } else {
                    reject(new Error(`Redirect without location: ${res.statusCode}`));
                }
            } else {
                reject(new Error(`HTTP ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function downloadImages() {
    console.log('📥 Downloading Ghost Images\n');
    console.log(`Inventory file: ${INVENTORY_FILE}`);
    console.log(`Output directory: ${OUTPUT_DIR}\n`);

    // Create output directory
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load inventory
    console.log('📖 Loading image inventory...');
    const inventory = JSON.parse(readFileSync(INVENTORY_FILE, 'utf-8'));
    const uniqueUrls = inventory.uniqueUrls || [];

    console.log(`Found ${uniqueUrls.length} unique image URLs\n`);

    const results = {
        downloaded: [],
        failed: [],
        skipped: [],
    };

    // Download images with concurrency control
    let currentDownloads = 0;
    let index = 0;

    async function downloadNext() {
        if (index >= uniqueUrls.length) {
            return;
        }

        const url = uniqueUrls[index++];
        const filename = extractFilenameFromUrl(url);
        const outputPath = join(OUTPUT_DIR, filename);

        // Skip if already downloaded
        if (existsSync(outputPath)) {
            results.skipped.push({ url, filename, reason: 'Already exists' });
            downloadNext();
            return;
        }

        currentDownloads++;

        try {
            await downloadImage(url, outputPath);
            results.downloaded.push({ url, filename });
            if (results.downloaded.length % 10 === 0) {
                console.log(`  Downloaded ${results.downloaded.length}/${uniqueUrls.length}...`);
            }
        } catch (error) {
            results.failed.push({ url, filename, error: error.message });
            console.error(`  ❌ Failed: ${filename} - ${error.message}`);
        } finally {
            currentDownloads--;
            downloadNext();
        }
    }

    // Start concurrent downloads
    console.log(`Starting downloads (max ${CONCURRENT_DOWNLOADS} concurrent)...\n`);
    const downloadPromises = [];
    for (let i = 0; i < CONCURRENT_DOWNLOADS && i < uniqueUrls.length; i++) {
        downloadPromises.push(downloadNext());
    }

    await Promise.all(downloadPromises);

    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        total: uniqueUrls.length,
        downloaded: results.downloaded.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        downloaded: results.downloaded,
        failed: results.failed,
        skipped: results.skipped,
    };

    const reportPath = join(OUTPUT_DIR, 'download-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    console.log('\n📊 Download Summary:');
    console.log(`  Total URLs: ${uniqueUrls.length}`);
    console.log(`  Downloaded: ${results.downloaded.length} ✅`);
    console.log(`  Failed: ${results.failed.length} ❌`);
    console.log(`  Skipped: ${results.skipped.length} ⏭️`);
    console.log(`\n💾 Report saved to: ${reportPath}`);

    if (results.failed.length > 0) {
        console.log(`\n⚠️  ${results.failed.length} images failed to download. Check report for details.`);
    }
}

downloadImages().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
