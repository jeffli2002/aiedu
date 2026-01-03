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

const testEmails = ['994235892@qq.com', 'jeffli2002@hotmail.com'];

async function deleteTestUsers() {
  const sql = neon(databaseUrl);

  try {
    console.log('Starting deletion of test users...\n');

    for (const email of testEmails) {
      console.log(`\n📧 Processing user: ${email}`);

      // First, find the user
      const [user] = await sql`
        SELECT id, email, name FROM "user" WHERE email = ${email.toLowerCase()}
      `;

      if (!user) {
        console.log(`   ⚠️  User not found: ${email}`);
        continue;
      }

      console.log(`   ✅ Found user: ${user.name} (${user.id})`);

      // Delete related data in order (respecting foreign key constraints)
      console.log(`   🗑️  Deleting related data...`);

      // 1. Delete credit transactions
      const creditTxResult = await sql`
        DELETE FROM credit_transactions WHERE user_id = ${user.id}
      `;
      console.log(`      - Credit transactions: deleted`);

      // 2. Delete user credits
      const userCreditsResult = await sql`
        DELETE FROM user_credits WHERE user_id = ${user.id}
      `;
      console.log(`      - User credits: deleted`);

      // 3. Delete credit pack purchases
      const creditPackResult = await sql`
        DELETE FROM credit_pack_purchase WHERE user_id = ${user.id}
      `;
      console.log(`      - Credit pack purchases: deleted`);

      // 4. Delete payments (this will cascade delete payment_events)
      // First get payment IDs
      const payments = await sql`
        SELECT id FROM payment WHERE user_id = ${user.id}
      `;
      
      if (payments.length > 0) {
        // Delete payment events first (they reference payment)
        const paymentIds = payments.map(p => p.id);
        for (const paymentId of paymentIds) {
          await sql`
            DELETE FROM payment_event WHERE payment_id = ${paymentId}
          `;
        }
        console.log(`      - Payment events: deleted`);
        
        // Then delete payments
        const paymentResult = await sql`
          DELETE FROM payment WHERE user_id = ${user.id}
        `;
        console.log(`      - Payments: deleted`);
      } else {
        console.log(`      - Payment events: none found`);
        console.log(`      - Payments: none found`);
      }

      // 6. Delete generated assets
      const assetResult = await sql`
        DELETE FROM generated_asset WHERE user_id = ${user.id}
      `;
      console.log(`      - Generated assets: deleted`);

      // 7. Delete generation locks
      const lockResult = await sql`
        DELETE FROM generation_lock WHERE user_id = ${user.id}
      `;
      console.log(`      - Generation locks: deleted`);

      // 8. Delete sessions (Better Auth will handle cascade, but let's be explicit)
      const sessionResult = await sql`
        DELETE FROM session WHERE user_id = ${user.id}
      `;
      console.log(`      - Sessions: deleted`);

      // 9. Delete accounts (Better Auth will handle cascade, but let's be explicit)
      const accountResult = await sql`
        DELETE FROM account WHERE user_id = ${user.id}
      `;
      console.log(`      - Accounts: deleted`);

      // 10. Delete verifications
      const verificationResult = await sql`
        DELETE FROM verification WHERE identifier LIKE ${`%${email.toLowerCase()}%`}
      `;
      console.log(`      - Verifications: deleted`);

      // 11. Finally, delete the user
      const userResult = await sql`
        DELETE FROM "user" WHERE id = ${user.id}
      `;
      console.log(`   ✅ User deleted successfully: ${email}`);
    }

    console.log('\n✅ All test users processed successfully!');
  } catch (error) {
    console.error('❌ Error deleting test users:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

deleteTestUsers();

