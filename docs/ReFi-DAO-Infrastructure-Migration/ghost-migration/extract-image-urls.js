#!/usr/bin/env node

/**
 * Extract Image URLs from Ghost Export
 * 
 * Extracts all image URLs from the Ghost JSON export file
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPORT_FILE = process.argv[2] || join(__dirname, 'ReFi DAO Nov 18 2025.json');
const OUTPUT_FILE = process.argv[3] || join(__dirname, 'image-urls.json');

function extractImagesFromHTML(html) {
    if (!html) return [];
    const imageUrls = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        imageUrls.push(match[1]);
    }
    return imageUrls;
}

function extractImageUrls(exportData) {
    const images = {
        featureImages: [],
        contentImages: [],
        all: new Set(),
    };

    if (!exportData.db || !exportData.db[0] || !exportData.db[0].data) {
        throw new Error('Invalid export file format');
    }

    const data = exportData.db[0].data;
    const posts = data.posts || [];

    console.log(`📖 Processing ${posts.length} posts...`);

    posts.forEach((post, idx) => {
        // Feature images
        if (post.feature_image) {
            images.featureImages.push({
                postId: post.id,
                postTitle: post.title,
                postSlug: post.slug,
                url: post.feature_image,
                type: 'feature_image',
            });
            images.all.add(post.feature_image);
        }

        // Content images
        const contentImages = extractImagesFromHTML(post.html || post.mobiledoc || '');
        contentImages.forEach(url => {
            images.contentImages.push({
                postId: post.id,
                postTitle: post.title,
                postSlug: post.slug,
                url: url,
                type: 'content_image',
            });
            images.all.add(url);
        });

        if ((idx + 1) % 50 === 0) {
            console.log(`  Processed ${idx + 1}/${posts.length} posts...`);
        }
    });

    return {
        featureImages: images.featureImages,
        contentImages: images.contentImages,
        uniqueUrls: Array.from(images.all),
        stats: {
            totalPosts: posts.length,
            postsWithFeatureImages: images.featureImages.length,
            postsWithContentImages: new Set(images.contentImages.map(img => img.postId)).size,
            totalFeatureImages: images.featureImages.length,
            totalContentImages: images.contentImages.length,
            uniqueImageUrls: images.all.size,
        },
    };
}

async function main() {
    console.log('🖼️  Extracting Image URLs from Ghost Export\n');
    console.log(`Export file: ${EXPORT_FILE}`);
    console.log(`Output file: ${OUTPUT_FILE}\n`);

    try {
        console.log('📖 Reading export file...');
        const exportContent = readFileSync(EXPORT_FILE, 'utf-8');
        const exportData = JSON.parse(exportContent);

        console.log('🔍 Extracting image URLs...');
        const result = extractImageUrls(exportData);

        console.log('\n📊 Statistics:');
        console.log(`  Total posts: ${result.stats.totalPosts}`);
        console.log(`  Posts with feature images: ${result.stats.postsWithFeatureImages}`);
        console.log(`  Posts with content images: ${result.stats.postsWithContentImages}`);
        console.log(`  Total feature images: ${result.stats.totalFeatureImages}`);
        console.log(`  Total content images: ${result.stats.totalContentImages}`);
        console.log(`  Unique image URLs: ${result.stats.uniqueImageUrls}`);

        console.log('\n💾 Saving results...');
        writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');

        console.log(`\n✅ Done! Results saved to: ${OUTPUT_FILE}`);
        console.log(`\nNext steps:`);
        console.log(`  1. Review image URLs: cat ${OUTPUT_FILE}`);
        console.log(`  2. Download images: node download-ghost-images.js`);
        console.log(`  3. Upload images: node upload-ghost-images.js`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
