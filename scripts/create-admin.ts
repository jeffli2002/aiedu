import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { admins } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load .env.local file before importing env-dependent modules
config({ path: resolve(process.cwd(), '.env.local') });

// Create database connection directly from environment variable
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema: { admins } });

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@futurai.pro';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const name = 'Admin User';

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    if (existing.length > 0) {
      await db
        .update(admins)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(admins.id, existing[0].id));

      console.log('🔐 Admin password updated successfully:');
      console.log('Email:', email);
      console.log('New Password:', password);
      console.log('ID:', existing[0].id);
    } else {
      const result = await db
        .insert(admins)
        .values({
          id: randomUUID(),
          email,
          passwordHash,
          name,
        })
        .returning();

      console.log('✅ Admin user created successfully:');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('ID:', result[0].id);
      console.log('\n⚠️ Please change the password after first login!');
    }
  } catch (error: unknown) {
    console.error('❌ Failed to create or update admin:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createAdmin();
