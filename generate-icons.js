const fs = require('fs');

// Simple SVG icon generator
function generateIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="${size * 0.4}" font-weight="bold" fill="white" font-family="Arial">🧠</text>
</svg>`;
}

// Create icon files
fs.writeFileSync('public/icon-192.png', generateIcon(192));
fs.writeFileSync('public/icon-512.png', generateIcon(512));
fs.writeFileSync('public/favicon.svg', generateIcon(32));

console.log('✅ Icons generated (SVG format for compatibility)');
