import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { user, userCredits, creditTransactions } from '../server/db/schema';

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

async function checkUserCredits(email: string) {
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

    // Check credit account
    const [creditAccount] = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, foundUser.id))
      .limit(1);

    if (!creditAccount) {
      console.log('\n❌ Credit account not found');
      return;
    }

    console.log('\n💰 Credit Account:');
    console.log(`   Balance: ${creditAccount.balance}`);
    console.log(`   Available Balance: ${creditAccount.balance - creditAccount.frozenBalance}`);
    console.log(`   Frozen Balance: ${creditAccount.frozenBalance}`);
    console.log(`   Total Earned: ${creditAccount.totalEarned}`);
    console.log(`   Total Spent: ${creditAccount.totalSpent}`);

    // Check for signup credits transaction
    const signupReferenceId = `signup_${foundUser.id}`;
    const signupTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.referenceId, signupReferenceId))
      .limit(10);

    console.log('\n📝 Signup Credit Transactions:');
    if (signupTransactions.length === 0) {
      console.log('   ❌ No signup credit transaction found');
      console.log(`   Expected reference_id: ${signupReferenceId}`);
    } else {
      signupTransactions.forEach((tx, index) => {
        console.log(`   Transaction ${index + 1}:`);
        console.log(`     ID: ${tx.id}`);
        console.log(`     Type: ${tx.type}`);
        console.log(`     Amount: ${tx.amount}`);
        console.log(`     Source: ${tx.source}`);
        console.log(`     Description: ${tx.description || 'N/A'}`);
        console.log(`     Reference ID: ${tx.referenceId}`);
        console.log(`     Created At: ${tx.createdAt}`);
      });
    }

    // Check all credit transactions (last 10)
    const allTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, foundUser.id))
      .orderBy(creditTransactions.createdAt)
      .limit(10);

    console.log('\n📊 Recent Credit Transactions (last 10):');
    if (allTransactions.length === 0) {
      console.log('   No transactions found');
    } else {
      allTransactions.forEach((tx, index) => {
        const sign = tx.type === 'spend' ? '-' : '+';
        console.log(
          `   ${index + 1}. ${sign}${tx.amount} credits - ${tx.description || tx.source} (${tx.type}) - Balance: ${tx.balanceAfter}`
        );
      });
    }

    // Summary
    console.log('\n📋 Summary:');
    console.log(`   ✅ User authenticated: ${foundUser.emailVerified ? 'Yes' : 'No'}`);
    console.log(`   ✅ Credit account exists: Yes`);
    console.log(
      `   ✅ Signup credits granted: ${signupTransactions.length > 0 ? 'Yes (' + signupTransactions[0]?.amount + ' credits)' : 'No'}`
    );
    console.log(`   ✅ Current balance: ${creditAccount.balance} credits`);

    if (!foundUser.emailVerified) {
      console.log('\n⚠️  Warning: User email is not verified');
    }

    if (signupTransactions.length === 0) {
      console.log('\n⚠️  Warning: No signup credit transaction found');
      console.log('   This might mean:');
      console.log('   1. User signed up before signup credits were implemented');
      console.log('   2. Signup credits grant failed');
      console.log('   3. User signed up via OAuth and email was not verified immediately');
    }
  } catch (error) {
    console.error('❌ Error checking user credits:', error);
    throw error;
  }
}

const email = process.argv[2] || 'jefflee2002@gmail.com';

checkUserCredits(email)
  .then(() => {
    console.log('\n✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

