import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { user } from '../server/db/schema';

// Load .env.local if present
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please set it or create .env.local');
  process.exit(1);
}

// Create database connection
const sql = neon(databaseUrl);
const db = drizzle(sql);

async function manuallyVerifyAndSendWelcome(email: string) {
  try {
    console.log(`\n🔍 Processing user: ${email}\n`);

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

    // If email is not verified, verify it
    if (!foundUser.emailVerified) {
      console.log('\n📧 Verifying email...');
      await db
        .update(user)
        .set({ 
          emailVerified: true,
          updatedAt: new Date()
        })
        .where(eq(user.id, foundUser.id));
      console.log('   ✅ Email verified');
    } else {
      console.log('\n✅ Email already verified');
    }

    // Grant signup credits and send welcome email
    console.log('\n🎁 Granting signup credits and sending welcome email...');
    try {
      // Import necessary modules
      const { creditService } = await import('../lib/credits/credit-service');
      const { sendWelcomeEmail } = await import('../lib/email');
      const { paymentConfig } = await import('../config/payment.config');
      const { creditTransactions } = await import('../server/db/schema');

      // Get updated user
      const [updatedUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, foundUser.id))
        .limit(1);

      if (!updatedUser) {
        console.log('   ❌ User not found after update');
        return;
      }

      const freePlan = paymentConfig.plans.find((plan) => plan.id === 'free');
      const signupCredits = freePlan?.credits?.onSignup ?? 0;

      if (signupCredits && signupCredits > 0) {
        const signupReferenceId = `signup_${updatedUser.id}`;
        
        // Check if already granted
        const [existingSignupTx] = await db
          .select({ id: creditTransactions.id })
          .from(creditTransactions)
          .where(eq(creditTransactions.referenceId, signupReferenceId))
          .limit(1);

        if (!existingSignupTx) {
          await creditService.getOrCreateCreditAccount(updatedUser.id);
          await creditService.earnCredits({
            userId: updatedUser.id,
            amount: signupCredits,
            source: 'bonus',
            description: 'Welcome bonus - thank you for signing up!',
            referenceId: signupReferenceId,
          });
          console.log(`   ✅ Granted ${signupCredits} signup credits`);
        } else {
          console.log('   ⚠️  Signup credits already granted');
        }
      }

      // Send welcome email
      console.log('   📧 Sending welcome email...');
      const sent = await sendWelcomeEmail(updatedUser.email, updatedUser.name || 'User');
      if (sent) {
        console.log('   ✅ Welcome email sent successfully!');
      } else {
        console.log('   ❌ Failed to send welcome email (check Resend configuration)');
        console.log('   Check: RESEND_API_KEY and RESEND_FROM_EMAIL environment variables');
      }
    } catch (error) {
      console.error('   ❌ Error processing:', error);
      throw error;
    }

    console.log('\n✅ Process complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: tsx scripts/manually-verify-and-send-welcome.ts <email>');
  console.error('Example: tsx scripts/manually-verify-and-send-welcome.ts jeffli2002@hotmail.com');
  process.exit(1);
}

manuallyVerifyAndSendWelcome(email)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

