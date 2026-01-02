import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { user, creditTransactions } from '../server/db/schema';

// Load .env.local if present
config({ path: resolve(process.cwd(), '.env.local') });

// Import email functions after env is loaded
let sendWelcomeEmail: (email: string, name: string) => Promise<boolean>;

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please set it or create .env.local');
  process.exit(1);
}

// Create database connection
const sql = neon(databaseUrl);
const db = drizzle(sql);

async function checkUserEmailStatus(email: string, resendEmail = false) {
  try {
    console.log(`\n🔍 Checking user: ${email}\n`);

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:');
    console.log(`   ID: ${foundUser.id}`);
    console.log(`   Name: ${foundUser.name || 'N/A'}`);
    console.log(`   Email: ${foundUser.email}`);
    console.log(`   Email Verified: ${foundUser.emailVerified ? '✅ Yes' : '❌ No'}`);
    console.log(`   Created At: ${foundUser.createdAt}`);
    console.log(`   Updated At: ${foundUser.updatedAt}`);

    // Check for signup credits transaction
    const signupReferenceId = `signup_${foundUser.id}`;
    const signupTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.referenceId, signupReferenceId))
      .limit(1);

    console.log('\n📧 Email Status:');
    if (foundUser.emailVerified) {
      console.log('   ✅ Email is verified');
    } else {
      console.log('   ❌ Email is NOT verified');
      console.log('   ⚠️  Welcome email is only sent after email verification');
    }

    if (signupTransactions.length > 0) {
      console.log('   ✅ Signup credits have been granted');
    } else {
      console.log('   ⚠️  Signup credits have NOT been granted yet');
    }

    // Check Resend configuration
    console.log('\n📬 Resend Configuration:');
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;
    console.log(`   RESEND_API_KEY: ${resendApiKey ? '✅ Set' : '❌ Not set'}`);
    console.log(`   RESEND_FROM_EMAIL: ${resendFromEmail || '❌ Not set'}`);

    if (resendEmail && foundUser.emailVerified) {
      console.log('\n📨 Attempting to send welcome email...');
      try {
        // Dynamically import email service to avoid env validation issues
        const emailModule = await import('../lib/email');
        const sent = await emailModule.sendWelcomeEmail(foundUser.email, foundUser.name || 'User');
        if (sent) {
          console.log('   ✅ Welcome email sent successfully!');
        } else {
          console.log('   ❌ Failed to send welcome email (check logs above)');
        }
      } catch (error) {
        console.error('   ❌ Error sending welcome email:', error);
      }
    } else if (resendEmail && !foundUser.emailVerified) {
      console.log('\n⚠️  Cannot send welcome email: Email is not verified');
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
  }
}

// Get email from command line arguments
const email = process.argv[2];
const resendEmail = process.argv.includes('--resend');

if (!email) {
  console.error('Usage: tsx scripts/check-user-email-status.ts <email> [--resend]');
  console.error('Example: tsx scripts/check-user-email-status.ts jeffli2002@hotmail.com --resend');
  process.exit(1);
}

checkUserEmailStatus(email, resendEmail)
  .then(() => {
    console.log('\n✅ Check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

