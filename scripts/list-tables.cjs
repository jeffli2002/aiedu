const envFile = process.env.ENV_FILE || '.env.local';
require('dotenv').config({ path: envFile });

(async () => {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
      order by table_name
    `;
    console.log(rows.map((r) => r.table_name).join('\n'));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
