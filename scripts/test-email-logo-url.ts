import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local if present
config({ path: resolve(process.cwd(), '.env.local') });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://futureai.edu';
const LOGO_URL = `${APP_URL}/FuturAI_logo.png`;

console.log('\n📧 Email Logo URL Configuration:\n');
console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set (using default)'}`);
console.log(`   APP_URL: ${APP_URL}`);
console.log(`   LOGO_URL: ${LOGO_URL}\n`);

// Test if URL is accessible
console.log('🔍 Testing logo URL accessibility...\n');

if (APP_URL.includes('localhost') || APP_URL.includes('127.0.0.1')) {
  console.log('   ⚠️  WARNING: Using localhost URL!');
  console.log('   Email clients cannot access localhost URLs.');
  console.log('   Logo will NOT display in emails.\n');
  console.log('   💡 Solution:');
  console.log('   1. Set NEXT_PUBLIC_APP_URL to your production URL (e.g., https://www.futurai.org)');
  console.log('   2. Ensure FuturAI_logo.png is accessible at that URL');
  console.log('   3. Or use a CDN URL for the logo\n');
} else {
  console.log(`   ✅ Using production URL: ${APP_URL}`);
  console.log(`   📷 Logo should be accessible at: ${LOGO_URL}\n`);
  console.log('   💡 To verify:');
  console.log(`   - Open ${LOGO_URL} in your browser`);
  console.log('   - If it loads, logo will display in emails');
  console.log('   - If it doesn\'t, check if logo file is deployed\n');
}

