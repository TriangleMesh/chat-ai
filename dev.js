#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Chat AI Application...\n');

// Start backend
const server = spawn('npm', ['run', 'dev'], {
  cwd: join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start frontend after 2 seconds
setTimeout(() => {
  const client = spawn('npm', ['run', 'dev'], {
    cwd: join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down services...');
    server.kill();
    client.kill();
    process.exit(0);
  });
}, 2000);

console.log('💡 Press Ctrl+C to stop all services');