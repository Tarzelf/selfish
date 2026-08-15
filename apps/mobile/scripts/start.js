#!/usr/bin/env node
/**
 * Local: `npm start` → Expo.
 * Railway: PORT is set and dist/ exists → serve the static export.
 */
const { spawn } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = process.env.PORT;
const exported = existsSync(path.join(root, 'dist', 'index.html'));

const child =
  port && exported
    ? spawn('npx', ['serve', 'dist', '--listen', `tcp://0.0.0.0:${port}`], {
        stdio: 'inherit',
        cwd: root,
      })
    : spawn('npx', ['expo', 'start', ...process.argv.slice(2)], {
        stdio: 'inherit',
        cwd: root,
      });

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
