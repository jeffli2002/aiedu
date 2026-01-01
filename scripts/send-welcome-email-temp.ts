import { config } from 'dotenv';
import { resolve } from 'path';
import { Resend } from 'resend';
import { getWelcomeEmailTemplate } from '../lib/email/templates';

// Load .env.local if present
config({ path: resolve(process.cwd(), '.env.local') });

const resendApiKey = process.env.RESEND_API_KEY;
const email = process.argv[2] || 'jeffli2002@hotmail.com';
const userName = process.argv[3] || 'User';

if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY is required');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

async function sendWelcomeEmailTemp() {
  try {
    console.log(`\n📧 Sending welcome email to: ${email}\n`);

    // Use Resend's test domain for temporary sending
    // Note: This is only for testing. For production, domain must be verified.
    const fromEmail = 'onboarding@resend.dev'; // Resend's test domain
    
    const html = getWelcomeEmailTemplate(userName, email);

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Future AI Creators! 🎉',
      html: html,
    });

    if (result.error) {
      console.error('❌ Failed to send email:', result.error);
      console.log('\n💡 Note: If you see domain verification error, you need to:');
      console.log('   1. Go to https://resend.com/domains');
      console.log('   2. Add and verify futurai.org domain');
      console.log('   3. Add DNS records (SPF, DKIM, DMARC)');
      console.log('   4. Update RESEND_FROM_EMAIL to noreply@futurai.org');
      return false;
    }

    console.log('✅ Welcome email sent successfully!');
    console.log(`   Email ID: ${result.data?.id}`);
    console.log(`   From: ${fromEmail}`);
    console.log(`   To: ${email}`);
    console.log('\n⚠️  Note: This email was sent from Resend test domain.');
    console.log('   For production, please verify futurai.org domain in Resend.');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

sendWelcomeEmailTemp()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

