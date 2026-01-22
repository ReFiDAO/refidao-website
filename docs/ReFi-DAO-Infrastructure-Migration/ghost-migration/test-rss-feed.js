#!/usr/bin/env node

/**
 * Test RSS Feed
 * 
 * Tests the RSS feed functionality
 */

import https from 'https';
import http from 'http';

const GHOST_URL = process.env.GHOST_URL || process.argv[2] || 'https://ghost-production-616f.up.railway.app';
const RSS_URL = `${GHOST_URL}/rss/`;

function fetchRSS(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, { timeout: 10000 }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, data, statusCode: res.statusCode });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

function parseRSS(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
        
        items.push({
            title: titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Unknown',
            link: linkMatch ? linkMatch[1] : '',
            pubDate: pubDateMatch ? pubDateMatch[1] : '',
        });
    }
    
    return items;
}

async function testRSSFeed() {
    console.log('📡 Testing RSS Feed\n');
    console.log(`RSS URL: ${RSS_URL}\n`);

    try {
        console.log('📥 Fetching RSS feed...');
        const result = await fetchRSS(RSS_URL);
        
        console.log(`✅ RSS feed accessible (Status: ${result.statusCode})\n`);
        
        console.log('📊 Parsing RSS feed...');
        const items = parseRSS(result.data);
        
        console.log(`✅ Found ${items.length} items in RSS feed\n`);
        
        if (items.length > 0) {
            console.log('📰 Sample items:');
            items.slice(0, 5).forEach((item, idx) => {
                console.log(`  ${idx + 1}. ${item.title.substring(0, 60)}...`);
                console.log(`     Link: ${item.link}`);
                console.log(`     Date: ${item.pubDate}\n`);
            });
        }
        
        console.log('✅ RSS feed test passed!');
        return { success: true, itemCount: items.length };
        
    } catch (error) {
        console.error(`❌ RSS feed test failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

testRSSFeed();
