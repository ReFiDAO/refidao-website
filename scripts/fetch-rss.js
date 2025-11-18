#!/usr/bin/env node

/**
 * RSS Feed Fetcher for ReFi DAO Website
 * 
 * Fetches latest blog posts from Ghost RSS feed and generates
 * markdown files for display on the website.
 * 
 * Usage: node scripts/fetch-rss.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const RSS_URL = process.env.GHOST_RSS_URL || 'https://blog.refidao.com/rss/';
const OUTPUT_DIR = join(__dirname, '../content/media/latest-posts');
const MAX_POSTS = 10;

/**
 * Fetch RSS feed and parse it
 */
async function fetchRSS() {
  try {
    console.log(`Fetching RSS feed from: ${RSS_URL}`);
    
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xml = await response.text();
    const feed = parseRSS(xml);
    
    console.log(`✅ Fetched ${feed.items.length} items from RSS feed`);
    
    // Create output directory if it doesn't exist
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}`);
    }
    
    // Generate markdown files for latest posts
    const postsToSave = feed.items.slice(0, MAX_POSTS);
    let savedCount = 0;
    
    for (const [index, item] of postsToSave.entries()) {
      const filename = generateFilename(item, index);
      const filepath = join(OUTPUT_DIR, filename);
      
      const markdown = generateMarkdown(item);
      writeFileSync(filepath, markdown, 'utf-8');
      savedCount++;
    }
    
    console.log(`✅ Saved ${savedCount} posts to ${OUTPUT_DIR}`);
    
    // Create index file listing all posts
    createIndexFile(feed.items.slice(0, MAX_POSTS));
    
    return feed;
  } catch (error) {
    console.error('❌ Error fetching RSS feed:', error.message);
    if (error.message.includes('fetch')) {
      console.error('💡 Tip: Make sure the RSS feed URL is accessible');
      console.error('💡 Tip: Ghost blog must be deployed and RSS enabled');
    }
    process.exit(1);
  }
}

/**
 * Simple RSS parser (basic implementation)
 * For production, consider using a library like 'rss-parser'
 */
function parseRSS(xml) {
  const items = [];
  const titleMatch = xml.match(/<title>(.*?)<\/title>/);
  const linkMatch = xml.match(/<link>(.*?)<\/link>/);
  const descriptionMatch = xml.match(/<description>(.*?)<\/description>/);
  
  // Extract items
  const itemMatches = xml.matchAll(/<item>(.*?)<\/item>/gs);
  
  for (const match of itemMatches) {
    const itemXml = match[1];
    const itemTitle = itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const itemLink = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const itemPubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const itemDescription = itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
    const itemContent = itemXml.match(/<content:encoded>(.*?)<\/content:encoded>/)?.[1] || itemDescription;
    
    // Clean HTML tags from description
    const cleanDescription = itemDescription
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
      .substring(0, 200);
    
    items.push({
      title: itemTitle,
      link: itemLink,
      pubDate: itemPubDate,
      description: cleanDescription,
      content: itemContent
    });
  }
  
  return {
    title: titleMatch?.[1] || 'ReFi DAO Blog',
    link: linkMatch?.[1] || RSS_URL,
    description: descriptionMatch?.[1] || '',
    items: items
  };
}

/**
 * Generate filename from RSS item
 */
function generateFilename(item, index) {
  // Extract slug from URL
  const urlParts = item.link.split('/');
  const slug = urlParts[urlParts.length - 1]
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase();
  
  return `${String(index + 1).padStart(2, '0')}-${slug}.md`;
}

/**
 * Generate markdown content from RSS item
 */
function generateMarkdown(item) {
  const date = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '';
  
  return `---
title: "${item.title.replace(/"/g, '\\"')}"
date: "${date}"
link: "${item.link}"
description: "${item.description.replace(/"/g, '\\"')}"
source: "blog"
---

${item.description}

[Read full article →](${item.link})

---

*This post was automatically imported from [blog.refidao.com](${item.link})*
`;
}

/**
 * Create index file listing all latest posts
 */
function createIndexFile(items) {
  const indexContent = `---
title: "Latest Blog Posts"
description: "Latest posts from ReFi DAO blog"
---

# Latest Blog Posts

> Automatically updated from [blog.refidao.com](https://blog.refidao.com)

${items.map((item, index) => {
  const filename = generateFilename(item, index);
  return `## ${index + 1}. [[${filename.replace('.md', '')}|${item.title}]]

${item.description}

[Read more →](${item.link})

---`;
}).join('\n\n')}

---

*Last updated: ${new Date().toISOString()}*

[View all posts →](https://blog.refidao.com)
`;
  
  const indexPath = join(OUTPUT_DIR, 'index.md');
  writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`✅ Created index file: ${indexPath}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchRSS().then(() => {
    console.log('\n✨ RSS feed fetch complete!');
  }).catch(error => {
    console.error('\n❌ RSS feed fetch failed:', error);
    process.exit(1);
  });
}

export { fetchRSS };

