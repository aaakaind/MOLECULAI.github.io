#!/usr/bin/env node
/**
 * Deployment Validation Script
 * Checks if the repository is ready for Vercel deployment
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  const result = condition();
  checks.push({ name, passed: result, details });
  if (result) {
    passed++;
    console.log(`✅ ${name}`);
  } else {
    failed++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

console.log('🔍 Validating MOLECULAI Deployment Setup\n');

// Check essential files exist
check(
  'vercel.json exists',
  () => existsSync(join(__dirname, 'vercel.json')),
  'Create vercel.json for Vercel deployment configuration'
);

check(
  '.vercelignore exists',
  () => existsSync(join(__dirname, '.vercelignore')),
  'Create .vercelignore to exclude unnecessary files'
);

check(
  'package.json exists',
  () => existsSync(join(__dirname, 'package.json')),
  'package.json is required for dependency management'
);

check(
  '.env.example exists',
  () => existsSync(join(__dirname, '.env.example')),
  'Create .env.example to document required environment variables'
);

check(
  'DEPLOYMENT.md exists',
  () => existsSync(join(__dirname, 'DEPLOYMENT.md')),
  'Deployment documentation is recommended'
);

// Check API routes exist
const apiRoutes = ['health.js', 'molecules.js', 'login.js', 'register.js', 'visualizations.js'];
apiRoutes.forEach(route => {
  check(
    `API route /api/${route} exists`,
    () => existsSync(join(__dirname, 'api', route)),
    `Create api/${route} for serverless function`
  );
});

// Check public directory
check(
  'public directory exists',
  () => existsSync(join(__dirname, 'public')),
  'Create public directory for static files'
);

check(
  'public/index.html exists',
  () => existsSync(join(__dirname, 'public', 'index.html')),
  'Create public/index.html as main entry point'
);

check(
  'public/js/config.js exists',
  () => existsSync(join(__dirname, 'public', 'js', 'config.js')),
  'Create public/js/config.js for frontend configuration'
);

// Check mcp-server (required by molecules API)
check(
  'mcp-server directory exists',
  () => existsSync(join(__dirname, 'mcp-server')),
  'mcp-server is required for molecule data'
);

// Check package.json configuration
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
  
  check(
    'package.json has build script',
    () => packageJson.scripts && (packageJson.scripts.build || packageJson.scripts['vercel-build']),
    'Add "build" or "vercel-build" script to package.json'
  );

  check(
    'package.json has required dependencies',
    () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      // Note: Express is used by server.js but not required for Vercel serverless functions
      // Vercel functions use their own handler pattern
      return deps.bcryptjs && deps.jsonwebtoken;
    },
    'Install required dependencies: bcryptjs, jsonwebtoken'
  );

  check(
    'package.json has type: "module"',
    () => packageJson.type === 'module',
    'Set "type": "module" in package.json for ES modules'
  );
} catch (error) {
  check('package.json is valid JSON', () => false, error.message);
}

// Check vercel.json configuration
try {
  const vercelConfig = JSON.parse(readFileSync(join(__dirname, 'vercel.json'), 'utf-8'));
  
  check(
    'vercel.json has rewrites or routes',
    () => vercelConfig.rewrites || vercelConfig.routes,
    'Add rewrites or routes to vercel.json'
  );
} catch (error) {
  check('vercel.json is valid JSON', () => false, error.message);
}

// Check .env.example has JWT_SECRET
try {
  const envExample = readFileSync(join(__dirname, '.env.example'), 'utf-8');
  
  check(
    '.env.example documents JWT_SECRET',
    () => envExample.includes('JWT_SECRET'),
    'Add JWT_SECRET to .env.example'
  );
} catch (error) {
  check('.env.example is readable', () => false, error.message);
}

// Check tests
check(
  'tests directory exists',
  () => existsSync(join(__dirname, 'tests')),
  'Tests are recommended but not required'
);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${passed} passed, ${failed} failed out of ${checks.length} checks\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your repository is ready for Vercel deployment.');
  console.log('\n📝 Next steps:');
  console.log('   1. Commit and push your changes');
  console.log('   2. Go to vercel.com and import your repository');
  console.log('   3. Set JWT_SECRET environment variable in Vercel dashboard');
  console.log('   4. Deploy!');
  console.log('\n📚 Documentation:');
  console.log('   - Deployment Guide: DEPLOYMENT.md');
  console.log('   - Testing Guide: TESTING_DEPLOYMENT.md');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above before deploying.');
  console.log('\n📚 For help, see:');
  console.log('   - Deployment Guide: DEPLOYMENT.md');
  console.log('   - Testing Guide: TESTING_DEPLOYMENT.md');
  process.exit(1);
}
