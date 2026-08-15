#!/usr/bin/env node
/**
 * Expo writes a catch-all rewrite to +not-found.html. `serve` applies it
 * to `/` and every real route, so Railway's healthcheck and the first
 * paint are the 404 document. Keep clean URLs and the dynamic session
 * rewrite; drop the steal-everything rule.
 */
const { writeFileSync } = require('fs');
const { join } = require('path');

const dest = join(__dirname, '..', 'dist', 'serve.json');
const config = {
  cleanUrls: true,
  rewrites: [{ source: '/session/:id', destination: '/session/[id].html' }],
};

writeFileSync(dest, `${JSON.stringify(config, null, 2)}\n`);
console.log('rewrote', dest);
