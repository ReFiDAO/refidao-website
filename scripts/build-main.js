#!/usr/bin/env node

/**
 * Build script for ReFi DAO Main Site
 * 
 * This script:
 * 1. Creates the dist directory
 * 2. Copies all necessary files
 * 3. Transforms paths for production
 * 4. Minifies CSS (optional)
 */

import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = dirname(__dirname);
const DIST = join(ROOT, 'dist');

console.log('🌱 Building ReFi DAO Main Site...\n');

// Clean and create dist directory
console.log('📁 Creating dist directory...');
mkdirSync(DIST, { recursive: true });

// Copy site pages
console.log('📄 Copying HTML pages...');
const pagesDir = join(ROOT, 'site', 'pages');
readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.html')) {
    cpSync(join(pagesDir, file), join(DIST, file));
  }
});

// Copy styles
console.log('🎨 Copying styles...');
cpSync(join(ROOT, 'site', 'styles'), join(DIST, 'styles'), { recursive: true });

// Copy site assets
console.log('🖼️  Copying site assets...');
const siteAssetsDir = join(ROOT, 'site', 'assets');
if (existsSync(siteAssetsDir)) {
  cpSync(siteAssetsDir, join(DIST, 'assets'), { recursive: true });
}

// Copy site scripts if exists
const siteScriptsDir = join(ROOT, 'site', 'scripts');
if (existsSync(siteScriptsDir)) {
  console.log('📜 Copying JavaScript...');
  cpSync(siteScriptsDir, join(DIST, 'scripts'), { recursive: true });
}

// Copy refi-node-map files
console.log('🗺️  Copying refi-node-map assets...');
const nodeMapDist = join(DIST, 'refi-node-map');
mkdirSync(nodeMapDist, { recursive: true });

const nodeMapSrc = join(ROOT, 'refi-node-map');
cpSync(join(nodeMapSrc, 'assets'), join(nodeMapDist, 'assets'), { recursive: true });
cpSync(join(nodeMapSrc, 'nodes'), join(nodeMapDist, 'nodes'), { recursive: true });
cpSync(join(nodeMapSrc, 'style.css'), join(nodeMapDist, 'style.css'));
cpSync(join(nodeMapSrc, 'script.js'), join(nodeMapDist, 'script.js'));

// Transform HTML files for production
console.log('🔧 Transforming paths for production...');

const htmlFiles = readdirSync(DIST).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = join(DIST, file);
  let content = readFileSync(filePath, 'utf-8');
  
  // Fix style paths: ../styles/ → ./styles/
  content = content.replace(/\.\.\/styles\//g, './styles/');
  
  // Fix asset paths: ../assets/ → ./assets/
  content = content.replace(/\.\.\/assets\//g, './assets/');
  
  // Fix refi-node-map paths: ../../refi-node-map/ → ./refi-node-map/
  content = content.replace(/\.\.\/\.\.\/refi-node-map\//g, './refi-node-map/');
  
  // Fix internal navigation links to clean URLs
  content = content.replace(/href="index\.html"/g, 'href="/"');
  content = content.replace(/href="about\.html"/g, 'href="/about"');
  content = content.replace(/href="local-nodes\.html"/g, 'href="/local-nodes"');
  content = content.replace(/href="community\.html"/g, 'href="/community"');
  content = content.replace(/href="resources-hub\.html"/g, 'href="/resources-hub"');
  
  // Fix anchor links with HTML extension
  content = content.replace(/href="about\.html#/g, 'href="/about#');
  content = content.replace(/href="community\.html#/g, 'href="/community#');
  
  writeFileSync(filePath, content);
});

// Create _redirects file for Netlify
console.log('📝 Creating _redirects file...');
const redirects = `# Clean URLs - serve HTML files without extension
/about         /about.html         200
/local-nodes   /local-nodes.html   200
/community     /community.html     200
/resources-hub /resources-hub.html 200

# SPA fallback (optional)
# /*             /index.html         200
`;
writeFileSync(join(DIST, '_redirects'), redirects);

// Create 404 page
console.log('🚫 Creating 404 page...');
const notFoundPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - ReFi DAO</title>
  <link rel="icon" href="./assets/favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles/main.css">
  <style>
    .error-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-8);
    }
    .error-code {
      font-family: var(--font-heading);
      font-size: clamp(6rem, 15vw, 12rem);
      font-weight: 700;
      line-height: 1;
      opacity: 0.15;
      margin-bottom: var(--space-4);
    }
    .error-title {
      font-family: var(--font-heading);
      font-size: var(--text-2xl);
      margin-bottom: var(--space-4);
    }
    .error-message {
      color: var(--color-text-muted);
      margin-bottom: var(--space-8);
      max-width: 400px;
    }
  </style>
</head>
<body>
  <div class="bg-noise"></div>
  <main class="error-page">
    <div class="error-code">404</div>
    <h1 class="error-title">Page Not Found</h1>
    <p class="error-message">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a href="/" class="btn btn--primary">
      <span>Back to Home</span>
    </a>
  </main>
</body>
</html>
`;
writeFileSync(join(DIST, '404.html'), notFoundPage);

// Calculate build stats
const getDirectorySize = (dir) => {
  let size = 0;
  if (!existsSync(dir)) return size;
  
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  });
  return size;
};

const totalSize = getDirectorySize(DIST);
const sizeInKB = (totalSize / 1024).toFixed(2);
const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log('');
console.log('╔═══════════════════════════════════════════════════╗');
console.log('║                                                   ║');
console.log('║   ✅ Build Complete!                              ║');
console.log('║                                                   ║');
console.log(`║   📦 Output: dist/                                ║`);
console.log(`║   📊 Size: ${sizeInMB} MB (${sizeInKB} KB)             ║`.slice(0, 55) + '║');
console.log('║                                                   ║');
console.log('║   Files:                                          ║');
console.log(`║   • ${htmlFiles.length} HTML pages                              ║`);
console.log('║   • Styles, assets, and refi-node-map             ║');
console.log('║                                                   ║');
console.log('╚═══════════════════════════════════════════════════╝');
console.log('');
