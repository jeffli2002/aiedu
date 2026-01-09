import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local if present
config({ path: resolve(process.cwd(), '.env.local') });

async function sendTestWelcomeEmail(email: string, userName: string = 'Test User') {
  try {
    console.log(`\n📧 Sending test welcome email to: ${email}\n`);

    // Check Resend configuration
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;
    
    console.log('📬 Resend Configuration:');
    console.log(`   RESEND_API_KEY: ${resendApiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`   RESEND_FROM_EMAIL: ${resendFromEmail || '❌ Not set'}\n`);

    if (!resendApiKey || !resendFromEmail) {
      console.error('❌ Resend is not configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local');
      process.exit(1);
    }

    // Import email service
    const { sendWelcomeEmail } = await import('../lib/email');
    
    console.log('📨 Sending welcome email...');
    const sent = await sendWelcomeEmail(email, userName);
    
    if (sent) {
      console.log(`\n✅ Welcome email sent successfully to ${email}!`);
      console.log(`   Subject: Welcome to FuturAI! 🎉`);
      console.log(`   Recipient: ${email}`);
      console.log(`   User Name: ${userName}\n`);
    } else {
      console.log(`\n❌ Failed to send welcome email. Check the logs above for details.\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Get email and name from command line arguments
const email = process.argv[2] || '994235892@qq.com';
const userName = process.argv[3] || 'Test User';

if (!email) {
  console.error('Usage: tsx scripts/test-welcome-email.ts <email> [userName]');
  console.error('Example: tsx scripts/test-welcome-email.ts 994235892@qq.com "Lei Li"');
  process.exit(1);
}

sendTestWelcomeEmail(email, userName)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

