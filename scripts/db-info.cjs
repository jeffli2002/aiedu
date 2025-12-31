const envFile = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envFile });

(async () => {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const info = await sql`select current_database() as db, current_schema() as schema, current_user as user, current_setting('search_path') as search_path, now() as now`;
    console.log('DB info:', info[0]);
    const tables = await sql`
      select table_schema, table_name
      from information_schema.tables
      where table_type = 'BASE TABLE'
      order by table_schema, table_name
    `;
    console.log('Tables:');
    for (const t of tables) console.log(`${t.table_schema}.${t.table_name}`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();

