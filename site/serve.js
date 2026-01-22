#!/usr/bin/env node

/**
 * Simple development server for ReFi DAO main site
 * 
 * Usage: node site/serve.js
 * 
 * This serves the site/ directory and maps clean URLs to HTML files.
 */

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = dirname(__dirname); // Project root (ReFi-DAO-Website)

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
};

// Clean URL mappings
const ROUTE_MAPPINGS = {
  '/': '/site/pages/index.html',
  '/about': '/site/pages/about.html',
  '/local-nodes': '/site/pages/local-nodes.html',
  '/community': '/site/pages/community.html',
  '/resources-hub': '/site/pages/resources-hub.html',
};

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function serveFile(res, filePath, contentType) {
  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
    return true;
  } catch (err) {
    return false;
  }
}

async function handleRequest(req, res) {
  let url = req.url.split('?')[0]; // Remove query string
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${url}`);
  
  // Check route mappings first
  if (ROUTE_MAPPINGS[url]) {
    const filePath = join(ROOT, ROUTE_MAPPINGS[url]);
    if (await serveFile(res, filePath, 'text/html')) {
      return;
    }
  }
  
  // Try serving static files from various directories
  const possiblePaths = [
    join(ROOT, 'site', url),           // /styles/main.css → site/styles/main.css
    join(ROOT, url.slice(1)),           // /refi-node-map/... → refi-node-map/...
    join(ROOT, 'assets', url.slice(1)), // /ReFi_DAO_Logo.svg → assets/ReFi_DAO_Logo.svg
    join(ROOT, 'site', 'pages', url + '.html'), // /about → site/pages/about.html
  ];
  
  for (const filePath of possiblePaths) {
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    if (await fileExists(filePath)) {
      if (await serveFile(res, filePath, contentType)) {
        return;
      }
    }
  }
  
  // Handle asset paths from the pages (e.g., /assets/...)
  if (url.startsWith('/assets/')) {
    const assetName = url.replace('/assets/', '');
    const assetPaths = [
      join(ROOT, 'assets', assetName),
      join(ROOT, 'assets', 'SVG', assetName),
      join(ROOT, 'assets', 'PNG', assetName),
      join(ROOT, 'assets', 'JPEG', assetName),
      join(ROOT, 'refi-node-map', 'assets', assetName),
    ];
    
    for (const assetPath of assetPaths) {
      const ext = extname(assetPath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      if (await serveFile(res, assetPath, contentType)) {
        return;
      }
    }
  }
  
  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Not Found</title>
      <style>
        body { font-family: system-ui; background: #172027; color: #F1F0FF; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { text-align: center; }
        h1 { font-size: 4rem; margin: 0; opacity: 0.5; }
        p { color: rgba(241, 240, 255, 0.6); }
        a { color: #71E3BA; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Page not found: ${url}</p>
        <p><a href="/">← Back to Home</a></p>
      </div>
    </body>
    </html>
  `);
}

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌱 ReFi DAO Development Server                          ║
║                                                           ║
║   Local:   http://localhost:${PORT}                         ║
║                                                           ║
║   Pages:                                                  ║
║   • Home:       http://localhost:${PORT}/                   ║
║   • About:      http://localhost:${PORT}/about              ║
║   • Local Nodes: http://localhost:${PORT}/local-nodes       ║
║   • Community:  http://localhost:${PORT}/community          ║
║   • Resources:  http://localhost:${PORT}/resources-hub      ║
║                                                           ║
║   Press Ctrl+C to stop                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
