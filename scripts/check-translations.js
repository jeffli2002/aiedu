const fs = require('fs');
const path = require('path');

const zhPath = path.join(__dirname, '../public/locales/zh/common.json');
const enPath = path.join(__dirname, '../public/locales/en/common.json');

const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

const zhKeys = getKeys(zh);
const enKeys = getKeys(en);

const missingInZh = enKeys.filter(k => !zhKeys.includes(k));
const missingInEn = zhKeys.filter(k => !enKeys.includes(k));

console.log('=== Missing translations ===');
console.log('\nMissing in ZH (' + missingInZh.length + '):');
if (missingInZh.length > 0) {
  missingInZh.forEach(k => {
    const enValue = getValue(en, k);
    console.log(`  ${k}: "${enValue}"`);
  });
} else {
  console.log('  None');
}

console.log('\nMissing in EN (' + missingInEn.length + '):');
if (missingInEn.length > 0) {
  missingInEn.forEach(k => {
    const zhValue = getValue(zh, k);
    console.log(`  ${k}: "${zhValue}"`);
  });
} else {
  console.log('  None');
}

// Check for empty values
console.log('\n=== Empty or missing values ===');
const allKeys = [...new Set([...zhKeys, ...enKeys])];
const emptyValues = [];
allKeys.forEach(k => {
  const zhValue = getValue(zh, k);
  const enValue = getValue(en, k);
  if (!zhValue || zhValue === '' || zhValue === k) {
    emptyValues.push({ key: k, lang: 'zh', value: zhValue });
  }
  if (!enValue || enValue === '' || enValue === k) {
    emptyValues.push({ key: k, lang: 'en', value: enValue });
  }
});

if (emptyValues.length > 0) {
  console.log(`Found ${emptyValues.length} empty or missing values:`);
  emptyValues.forEach(({ key, lang, value }) => {
    console.log(`  [${lang}] ${key}: "${value}"`);
  });
} else {
  console.log('  None');
}


