#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logWithPrefix(prefix, message, color = colors.reset) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${color}[${prefix}]${colors.reset} ${message}`);
}

function checkDependencies() {
  log('\n🔍 Checking project dependencies...', colors.blue);
  
  const checks = [
    { name: 'server/package.json', path: 'server/package.json' },
    { name: 'client/package.json', path: 'client/package.json' },
    { name: 'server/node_modules', path: 'server/node_modules' },
    { name: 'client/node_modules', path: 'client/node_modules' },
    { name: 'server/.env', path: 'server/.env' }
  ];

  let allGood = true;
  
  checks.forEach(({ name, path }) => {
    if (fs.existsSync(path)) {
      log(`  ✅ ${name}`, colors.green);
    } else {
      log(`  ❌ ${name} - missing`, colors.red);
      allGood = false;
    }
  });

  if (!allGood) {
    log('\n⚠️  Please install dependencies first:', colors.yellow);
    log('  cd server && npm install', colors.yellow);
    log('  cd client && npm install', colors.yellow);
    log('  Make sure server/.env file exists', colors.yellow);
    process.exit(1);
  }

  log('  ✅ All dependencies check passed!', colors.green);
}

function startServer() {
  return new Promise((resolve, reject) => {
    log('\n🚀 Starting backend server...', colors.blue);
    
    const serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: join(__dirname, 'server'),
      stdio: 'pipe',
      shell: true
    });

    let serverReady = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      logWithPrefix('SERVER', output.trim(), colors.green);
      
      if (output.includes('Server running at') || output.includes('localhost:3000')) {
        if (!serverReady) {
          serverReady = true;
          resolve(serverProcess);
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const output = data.toString();
      if (!output.includes('ExperimentalWarning')) {
        logWithPrefix('SERVER', output.trim(), colors.red);
      }
    });

    serverProcess.on('close', (code) => {
      if (code !== 0 && !serverReady) {
        reject(new Error(`Server process exited with code ${code}`));
      }
    });

    // Timeout check
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Server startup timeout'));
      }
    }, 10000);
  });
}

function startClient(serverProcess) {
  return new Promise((resolve, reject) => {
    log('\n🎨 Starting frontend application...', colors.blue);
    
    const clientProcess = spawn('npm', ['run', 'dev'], {
      cwd: join(__dirname, 'client'),
      stdio: 'pipe',
      shell: true
    });

    let clientReady = false;

    clientProcess.stdout.on('data', (data) => {
      const output = data.toString();
      logWithPrefix('CLIENT', output.trim(), colors.cyan);
      
      if (output.includes('Local:') || output.includes('localhost:5173')) {
        if (!clientReady) {
          clientReady = true;
          resolve({ serverProcess, clientProcess });
        }
      }
    });

    clientProcess.stderr.on('data', (data) => {
      const output = data.toString();
      logWithPrefix('CLIENT', output.trim(), colors.red);
    });

    clientProcess.on('close', (code) => {
      if (code !== 0 && !clientReady) {
        reject(new Error(`Client process exited with code ${code}`));
      }
    });

    // Timeout check
    setTimeout(() => {
      if (!clientReady) {
        reject(new Error('Client startup timeout'));
      }
    }, 15000);
  });
}

function setupGracefulShutdown(processes) {
  const { serverProcess, clientProcess } = processes;

  function cleanup() {
    log('\n🛑 Shutting down services...', colors.yellow);
    
    if (clientProcess && !clientProcess.killed) {
      clientProcess.kill('SIGTERM');
      logWithPrefix('CLIENT', 'Frontend service stopped', colors.yellow);
    }
    
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
      logWithPrefix('SERVER', 'Backend service stopped', colors.yellow);
    }
    
    log('\n👋 Goodbye!', colors.green);
    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
}

async function main() {
  try {
    log('🎯 Chat AI Application Launcher', colors.cyan + colors.bright);
    log('================================', colors.cyan);

    // Check dependencies
    checkDependencies();

    // Start backend
    const serverProcess = await startServer();
    
    // Wait a bit to ensure server is fully started
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start frontend
    const processes = await startClient(serverProcess);
    
    // Setup graceful shutdown
    setupGracefulShutdown(processes);
    
    log('\n🎉 Application started successfully!', colors.green + colors.bright);
    log('================================', colors.green);
    log('📱 Frontend: http://localhost:5173', colors.cyan);
    log('🔧 Backend: http://localhost:3000', colors.cyan);
    log('📚 Health check: http://localhost:3000/health', colors.cyan);
    log('\n💡 Press Ctrl+C to stop all services', colors.yellow);
    log('================================\n', colors.green);

  } catch (error) {
    log(`\n❌ Startup failed: ${error.message}`, colors.red + colors.bright);
    log('\n🔧 Troubleshooting:', colors.yellow);
    log('  1. Make sure ports 3000 and 5173 are not in use', colors.yellow);
    log('  2. Check server/.env file configuration', colors.yellow);
    log('  3. Make sure all dependencies are installed', colors.yellow);
    log('  4. Verify Azure OpenAI configuration is correct', colors.yellow);
    process.exit(1);
  }
}

// Show help information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('\n🎯 Chat AI Application Launcher', colors.cyan + colors.bright);
  log('================================', colors.cyan);
  log('\nUsage: node start.js [options]', colors.bright);
  log('\nOptions:');
  log('  --help, -h    Show help information');
  log('\nFeatures:');
  log('  • Automatically check project dependencies');
  log('  • Start backend and frontend in sequence');
  log('  • Real-time service logs display');
  log('  • Graceful shutdown of all services');
  log('\nAddresses:');
  log('  Frontend: http://localhost:5173');
  log('  Backend: http://localhost:3000');
  log('\nPress Ctrl+C to stop all services');
  log('================================\n');
  process.exit(0);
}

main();