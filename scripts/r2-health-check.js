// R2 health check using CommonJS to avoid ESM tooling issues
// Run: node scripts/r2-health-check.js

const { existsSync } = require('fs');
const { config } = require('dotenv');
const { randomUUID } = require('crypto');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

config({ path: existsSync('.env.local') ? '.env.local' : '.env' });

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

(async () => {
  const bucket = required('R2_BUCKET_NAME');
  const endpoint = required('R2_ENDPOINT');
  const accessKeyId = required('R2_ACCESS_KEY_ID');
  const secretAccessKey = required('R2_SECRET_ACCESS_KEY');

  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  const key = `health/${randomUUID()}.txt`;
  const body = Buffer.from(`ok ${new Date().toISOString()}\n`);

  console.log('Uploading test object:', key);
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: 'text/plain' }));

  console.log('Generating signed URL...');
  const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 60 });
  console.log('Signed URL (valid 60s):', url);

  console.log('Deleting test object...');
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log('✅ R2 health check passed');
})().catch((err) => {
  console.error('R2 health check failed');
  if (err && err.$metadata) console.error('AWS SDK metadata:', err.$metadata);
  console.error(err);
  process.exit(1);
});

