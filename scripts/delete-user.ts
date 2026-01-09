import { config } from 'dotenv';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is required. Please check your .env.local file.');
  process.exit(1);
}

const email = process.argv[2] || '994235892@qq.com';

async function deleteUser() {
  const sql = neon(databaseUrl);

  try {
    console.log(`\n🗑️  Starting deletion of user: ${email}\n`);

    // First, find the user
    const [user] = await sql`
      SELECT id, email, name FROM "user" WHERE email = ${email.toLowerCase()}
    `;

    if (!user) {
      console.log(`   ⚠️  User not found: ${email}`);
      return;
    }

    console.log(`   ✅ Found user: ${user.name} (${user.id})`);

    // Delete related data in order (respecting foreign key constraints)
    console.log(`   🗑️  Deleting related data...`);

    // Helper function to safely delete from a table
    const safeDelete = async (tableName: string, condition: string, params: any[]) => {
      try {
        await sql.unsafe(`DELETE FROM ${tableName} WHERE ${condition}`, params);
        return true;
      } catch (error: any) {
        if (error.code === '42P01') {
          // Table doesn't exist, skip
          return false;
        }
        throw error;
      }
    };

    // 1. Delete affiliate commissions (if user is affiliate)
    if (await safeDelete('affiliate_commission', 'buyer_user_id = $1', [user.id])) {
      console.log(`      - Affiliate commissions: deleted`);
    }

    // 2. Delete affiliate clicks
    if (await safeDelete('affiliate_click', 'user_id = $1', [user.id])) {
      console.log(`      - Affiliate clicks: deleted`);
    }

    // 3. Delete credit transactions
    if (await safeDelete('credit_transactions', 'user_id = $1', [user.id])) {
      console.log(`      - Credit transactions: deleted`);
    }

    // 4. Delete user credits
    if (await safeDelete('user_credits', 'user_id = $1', [user.id])) {
      console.log(`      - User credits: deleted`);
    }

    // 5. Delete credit pack purchases
    if (await safeDelete('credit_pack_purchase', 'user_id = $1', [user.id])) {
      console.log(`      - Credit pack purchases: deleted`);
    }

    // 6. Delete payments (this will cascade delete payment_events)
    try {
      const payments = await sql`
        SELECT id FROM payment WHERE user_id = ${user.id}
      `;
      
      if (payments.length > 0) {
        // Delete payment events first (they reference payment)
        const paymentIds = payments.map(p => p.id);
        for (const paymentId of paymentIds) {
          await safeDelete('payment_event', 'payment_id = $1', [paymentId]);
        }
        console.log(`      - Payment events: deleted`);
        
        // Then delete payments
        await safeDelete('payment', 'user_id = $1', [user.id]);
        console.log(`      - Payments: deleted`);
      } else {
        console.log(`      - Payment events: none found`);
        console.log(`      - Payments: none found`);
      }
    } catch (error: any) {
      if (error.code !== '42P01') throw error;
    }

    // 7. Delete generated assets
    if (await safeDelete('generated_asset', 'user_id = $1', [user.id])) {
      console.log(`      - Generated assets: deleted`);
    }

    // 8. Delete generation locks
    if (await safeDelete('generation_lock', 'user_id = $1', [user.id])) {
      console.log(`      - Generation locks: deleted`);
    }

    // 9. Delete batch generation jobs
    if (await safeDelete('batch_generation_job', 'user_id = $1', [user.id])) {
      console.log(`      - Batch generation jobs: deleted`);
    }

    // 10. Delete publish submissions
    if (await safeDelete('publish_submissions', 'user_id = $1', [user.id])) {
      console.log(`      - Publish submissions: deleted`);
    }

    // 11. Delete platform publishes
    if (await safeDelete('platform_publish', 'user_id = $1', [user.id])) {
      console.log(`      - Platform publishes: deleted`);
    }

    // 12. Delete platform accounts
    if (await safeDelete('platform_account', 'user_id = $1', [user.id])) {
      console.log(`      - Platform accounts: deleted`);
    }

    // 13. Delete user quota usage
    if (await safeDelete('user_quota_usage', 'user_id = $1', [user.id])) {
      console.log(`      - User quota usage: deleted`);
    }

    // 14. Delete user daily checkins
    if (await safeDelete('user_daily_checkin', 'user_id = $1', [user.id])) {
      console.log(`      - User daily checkins: deleted`);
    }

    // 15. Delete user referrals (as referrer and referred)
    if (await safeDelete('user_referrals', 'referrer_id = $1', [user.id])) {
      await safeDelete('user_referrals', 'referred_id = $1', [user.id]);
      console.log(`      - User referrals: deleted`);
    }

    // 16. Delete social shares
    if (await safeDelete('social_shares', 'user_id = $1', [user.id])) {
      console.log(`      - Social shares: deleted`);
    }

    // 17. Delete brand tone profile
    if (await safeDelete('brand_tone_profile', 'user_id = $1', [user.id])) {
      console.log(`      - Brand tone profile: deleted`);
    }

    // 18. Delete subscriptions
    if (await safeDelete('subscription', 'user_id = $1', [user.id])) {
      console.log(`      - Subscriptions: deleted`);
    }

    // 19. Delete affiliate applications
    if (await safeDelete('affiliate_application', 'user_id = $1', [user.id])) {
      console.log(`      - Affiliate applications: deleted`);
    }

    // 20. Delete affiliate records (if user is an affiliate)
    if (await safeDelete('affiliate', 'user_id = $1', [user.id])) {
      console.log(`      - Affiliate records: deleted`);
    }

    // 21. Delete sessions (Better Auth will handle cascade, but let's be explicit)
    if (await safeDelete('session', 'user_id = $1', [user.id])) {
      console.log(`      - Sessions: deleted`);
    }

    // 22. Delete accounts (Better Auth will handle cascade, but let's be explicit)
    if (await safeDelete('account', 'user_id = $1', [user.id])) {
      console.log(`      - Accounts: deleted`);
    }

    // 23. Delete verifications
    try {
      await sql`
        DELETE FROM verification WHERE identifier LIKE ${`%${email.toLowerCase()}%`}
      `;
      console.log(`      - Verifications: deleted`);
    } catch (error: any) {
      if (error.code !== '42P01') throw error;
    }

    // 24. Finally, delete the user
    const userResult = await sql`
      DELETE FROM "user" WHERE id = ${user.id}
    `;
    console.log(`\n   ✅ User deleted successfully: ${email}`);
    console.log(`\n✅ Deletion completed!`);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

deleteUser();

