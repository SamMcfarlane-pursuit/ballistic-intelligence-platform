#!/usr/bin/env node

// Simple localhost:3000 status checker
const http = require('http');

console.log('🔍 Checking localhost:3000 status...\n');

// Check main page
const checkUrl = (url, name) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${name}: ${res.statusCode} ${res.statusMessage}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
};

async function checkStatus() {
  const checks = [
    ['http://localhost:3000', 'Home Page'],
    ['http://localhost:3000/api/health', 'Health API'],
    ['http://localhost:3000/executive', 'Executive Dashboard'],
    ['http://localhost:3000/verification-queue', 'Verification Queue'],
    ['http://localhost:3000/business-metrics', 'Business Metrics'],
    ['http://localhost:3000/data-scraping', 'Data Scraping']
  ];

  console.log('Testing key endpoints:\n');
  
  let allGood = true;
  for (const [url, name] of checks) {
    const result = await checkUrl(url, name);
    if (!result) allGood = false;
  }
  
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('🎉 All systems operational on localhost:3000');
    console.log('🌐 Ready to use: http://localhost:3000');
  } else {
    console.log('⚠️  Some issues detected');
  }
  console.log('='.repeat(50));
}

checkStatus().catch(console.error);