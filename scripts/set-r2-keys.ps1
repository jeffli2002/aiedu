# Helper script to set R2 keys in .env.local

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Set R2 Keys in .env.local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Normalize-Quoted([string]$s) {
  if (-not $s) { return $s }
  $s = $s.Trim()
  if ($s.StartsWith('"') -and $s.EndsWith('"')) { return $s.Substring(1, $s.Length-2) }
  if ($s.StartsWith("'") -and $s.EndsWith("'")) { return $s.Substring(1, $s.Length-2) }
  return $s
}

function Extract-AfterEquals([string]$s) {
  if (-not $s) { return $s }
  $idx = $s.IndexOf('=')
  if ($idx -ge 0) { return Normalize-Quoted($s.Substring($idx+1)) }
  return Normalize-Quoted($s)
}

function Normalize-AccountId([string]$s) {
  if (-not $s) { return $s }
  $s = $s.Trim()
  # Case: pasted full R2_ENDPOINT line
  if ($s -match '(?i)R2_ENDPOINT') { $s = Extract-AfterEquals($s) }
  # Case: pasted full https URL
  if ($s -match 'https?://([^./]+)\.r2\.cloudflarestorage\.com') { return $Matches[1] }
  # Case: quoted or plain account id
  $s = Normalize-Quoted($s)
  # Basic 32-hex check; otherwise return as-is
  if ($s -match '^[0-9a-f]{32}$') { return $s }
  return $s
}

function Normalize-Key([string]$s, [string]$label) {
  if (-not $s) { return $s }
  if ($s -match [Regex]::Escape($label)) { $s = Extract-AfterEquals($s) } else { $s = Normalize-Quoted($s) }
  return $s
}

$rawAccountId = Read-Host "Cloudflare Account ID (e.g., ccb5990e... or paste R2_ENDPOINT line)"
$accountId = Normalize-AccountId $rawAccountId
if ([string]::IsNullOrWhiteSpace($accountId)) { Write-Host "Account ID is required" -ForegroundColor Red; exit 1 }

$bucketName = Read-Host "R2 Bucket Name (e.g., aiedu)"
if ([string]::IsNullOrWhiteSpace($bucketName)) { Write-Host "Bucket name is required" -ForegroundColor Red; exit 1 }

$accessKeyId = Normalize-Key (Read-Host "R2 Access Key ID (paste value or entire R2_ACCESS_KEY_ID=... line)") 'R2_ACCESS_KEY_ID'
if ([string]::IsNullOrWhiteSpace($accessKeyId)) { Write-Host "Access Key ID is required" -ForegroundColor Red; exit 1 }

$secretAccessKey = Normalize-Key (Read-Host "R2 Secret Access Key (paste value or entire R2_SECRET_ACCESS_KEY=... line)") 'R2_SECRET_ACCESS_KEY'
if ([string]::IsNullOrWhiteSpace($secretAccessKey)) { Write-Host "Secret Access Key is required" -ForegroundColor Red; exit 1 }

# Endpoint is always the account S3 endpoint
$endpoint = "https://$accountId.r2.cloudflarestorage.com"

Write-Host ""
Write-Host "R2 Public URL (your r2.dev or custom domain)" -ForegroundColor Yellow
Write-Host "- Example (r2.dev): https://<random>.r2.dev" -ForegroundColor Gray
Write-Host "- Example (custom): https://media.yourdomain.com" -ForegroundColor Gray
$publicUrl = Extract-AfterEquals (Read-Host "R2 Public URL (leave blank to skip)")

$envPath = ".env.local"
$envContent = ""
if (Test-Path $envPath) { $envContent = Get-Content $envPath -Raw }

# Remove old R2 entries (allow leading spaces)
$envContent = $envContent -replace "(?m)^\s*R2_BUCKET_NAME=.*$", ""
$envContent = $envContent -replace "(?m)^\s*R2_ACCESS_KEY_ID=.*$", ""
$envContent = $envContent -replace "(?m)^\s*R2_SECRET_ACCESS_KEY=.*$", ""
$envContent = $envContent -replace "(?m)^\s*R2_ENDPOINT=.*$", ""
$envContent = $envContent -replace "(?m)^\s*R2_PUBLIC_URL=.*$", ""

$block = @()
$block += ""
$block += "# R2 Storage (Cloudflare)"
$block += "R2_BUCKET_NAME=\"$bucketName\""
$block += "R2_ACCESS_KEY_ID=\"$accessKeyId\""
$block += "R2_SECRET_ACCESS_KEY=\"$secretAccessKey\""
$block += "R2_ENDPOINT=\"$endpoint\""
if (-not [string]::IsNullOrWhiteSpace($publicUrl)) {
  $block += "R2_PUBLIC_URL=\"$publicUrl\""
}

$newContent = ($envContent.TrimEnd() + "`n" + ($block -join "`n")).TrimStart()
$newContent | Set-Content -Path $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Updated $envPath with R2 settings." -ForegroundColor Green
if ([string]::IsNullOrWhiteSpace($publicUrl)) {
  Write-Host "Note: R2_PUBLIC_URL not set. Set it to your r2.dev or custom domain when ready." -ForegroundColor Yellow
}
Write-Host ""
