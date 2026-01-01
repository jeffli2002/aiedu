# Script to create new R2 Access Key with Secret Access Key
# This will create a NEW access key (old one will still work until deleted)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create R2 Secret Access Key" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Secret Access Key is only shown ONCE when created." -ForegroundColor Yellow
Write-Host "If you lost it, you need to create a NEW access key." -ForegroundColor Yellow
Write-Host ""

# Step 1: Get Account ID
Write-Host "Step 1: Enter your Cloudflare Account ID" -ForegroundColor Yellow
Write-Host "Example: ccb5990ee93ad99d5ada77b738e942c6" -ForegroundColor Gray
$accountId = Read-Host "Account ID"

if ([string]::IsNullOrWhiteSpace($accountId)) {
    Write-Host "Error: Account ID cannot be empty" -ForegroundColor Red
    exit 1
}

# Step 2: Get API Token
Write-Host ""
Write-Host "Step 2: Enter your Account API Token" -ForegroundColor Yellow
Write-Host "(The one with 'Workers R2 Storage > Edit' permissions)" -ForegroundColor Gray
$apiToken = Read-Host "API Token"

if ([string]::IsNullOrWhiteSpace($apiToken)) {
    Write-Host "Error: API Token cannot be empty" -ForegroundColor Red
    exit 1
}

# Step 3: Select bucket
Write-Host ""
Write-Host "Step 3: Select bucket" -ForegroundColor Yellow
Write-Host "Available buckets: aiedu, viecom" -ForegroundColor Gray
$bucketName = Read-Host "Bucket name (e.g., aiedu)"

if ([string]::IsNullOrWhiteSpace($bucketName)) {
    Write-Host "Error: Bucket name cannot be empty" -ForegroundColor Red
    exit 1
}

# Step 4: Token name
Write-Host ""
$tokenName = Read-Host "New token name (e.g., aiedu-r2-token-v2) [default: $bucketName-r2-token-$(Get-Date -Format 'yyyyMMdd')]"
if ([string]::IsNullOrWhiteSpace($tokenName)) {
    $tokenName = "$bucketName-r2-token-$(Get-Date -Format 'yyyyMMdd')"
}

# Step 5: Create R2 Access Key
Write-Host ""
Write-Host "Creating new R2 access key..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

# Try known API endpoints (newest first)
# Note: As of late 2024, Cloudflare exposes R2 S3 key management via /r2/s3/keys.
# Older endpoints like /r2/keys or /r2/token may be unavailable for some accounts.
$endpoints = @(
    "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/s3/keys",
    "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/keys",
    "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/token"
)

$body = @{
    name = $tokenName
} | ConvertTo-Json

# Optional body with bucket restriction if supported by the account
$bodyWithBucket = @{
    name = $tokenName
    bucket = $bucketName
} | ConvertTo-Json

$success = $false
$accessKeyId = $null
$secretAccessKey = $null

foreach ($endpoint in $endpoints) {
    try {
        Write-Host "Trying endpoint: $endpoint" -ForegroundColor Gray
        
        # Use bucket-restricted body for legacy /token endpoint; name-only for keys endpoints
        $requestBody = if ($endpoint -like "*token*") { $bodyWithBucket } else { $body }
        
        $response = Invoke-RestMethod `
            -Uri $endpoint `
            -Method Post `
            -Headers $headers `
            -Body $requestBody `
            -ErrorAction Stop

        # Handle different response formats
        if ($response.success -or $response.result) {
            $result = if ($response.result) { $response.result } else { $response }
            
            # Try different field names
            if ($result.access_key_id) {
                $accessKeyId = $result.access_key_id
                $secretAccessKey = $result.secret_access_key
            } elseif ($result.accessKeyId) {
                $accessKeyId = $result.accessKeyId
                $secretAccessKey = $result.secretAccessKey
            } elseif ($result.access_key) {
                $accessKeyId = $result.access_key
                $secretAccessKey = $result.secret_key
            } else {
                Write-Host "Unexpected response format:" -ForegroundColor Yellow
                Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
                continue
            }
            
            $success = $true
            break
        }
    } catch {
        $statusCode = $null
        try {
            $statusCode = $_.Exception.Response.StatusCode.value__
        } catch {}
        if ($statusCode) {
            Write-Host "  Failed ($statusCode): $($_.Exception.Message)" -ForegroundColor Gray
        } else {
            Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Gray
        }
        continue
    }
}

if ($success -and $accessKeyId -and $secretAccessKey) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! New R2 access keys created!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Save these keys NOW - Secret Access Key won't be shown again!" -ForegroundColor Red
    Write-Host ""
    Write-Host "R2_ACCESS_KEY_ID:" -ForegroundColor Cyan
    Write-Host "$accessKeyId" -ForegroundColor White
    Write-Host ""
    Write-Host "R2_SECRET_ACCESS_KEY:" -ForegroundColor Cyan
    Write-Host "$secretAccessKey" -ForegroundColor White
    Write-Host ""
    
    # Ask to update .env.local
    $updateEnv = Read-Host "Update .env.local with new keys? (y/n)"
    if ($updateEnv -eq "y" -or $updateEnv -eq "Y") {
        # Read existing .env.local if it exists
        $envPath = ".env.local"
        $envContent = ""
        
        if (Test-Path $envPath) {
            $envContent = Get-Content $envPath -Raw
        }
        
        # Remove old R2 entries
        $envContent = $envContent -replace "R2_ACCESS_KEY_ID=.*", ""
        $envContent = $envContent -replace "R2_SECRET_ACCESS_KEY=.*", ""
        $envContent = $envContent -replace "R2_BUCKET_NAME=.*", ""
        $envContent = $envContent -replace "R2_ENDPOINT=.*", ""
        $envContent = $envContent -replace "R2_PUBLIC_URL=.*", ""
        
        # Add new R2 entries
        $r2Config = @"

# R2 Storage (Cloudflare)
R2_BUCKET_NAME="$bucketName"
R2_ACCESS_KEY_ID="$accessKeyId"
R2_SECRET_ACCESS_KEY="$secretAccessKey"
R2_ENDPOINT="https://$accountId.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-e561ff6c3fe54da085061ba60bdf2026.r2.dev"
"@
        
        # Append new config
        $envContent = $envContent.TrimEnd() + $r2Config
        
        # Write to file
        $envContent | Set-Content -Path $envPath -Encoding UTF8
        
        Write-Host ""
        Write-Host "✅ Updated .env.local with new R2 keys!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Note: Your old access key is still active." -ForegroundColor Yellow
        Write-Host "You can delete it from Cloudflare Dashboard if you want." -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "Please manually add to .env.local:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "R2_ACCESS_KEY_ID=`"$accessKeyId`"" -ForegroundColor White
        Write-Host "R2_SECRET_ACCESS_KEY=`"$secretAccessKey`"" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "❌ Failed to create R2 access key" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. API Token might not have correct permissions" -ForegroundColor Gray
    Write-Host "2. Account ID might be incorrect" -ForegroundColor Gray
    Write-Host "3. R2 service might not be enabled" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Trying to verify API Token..." -ForegroundColor Cyan
    
    # Test API Token
    try {
        $testResponse = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/buckets" `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop
        
        Write-Host "✅ API Token is valid! Found buckets:" -ForegroundColor Green
        foreach ($bucket in $testResponse.result) {
            Write-Host "  - $($bucket.name)" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "The issue is likely the endpoint. Use Dashboard to create keys:" -ForegroundColor Yellow
        Write-Host "1. Open: https://dash.cloudflare.com/$accountId/r2/api-tokens" -ForegroundColor Gray
        Write-Host "2. Click 'Create API token' (R2 S3) and select bucket + RW" -ForegroundColor Gray
        Write-Host "3. Copy the Access Key ID and Secret Access Key (shown once)" -ForegroundColor Gray
        Write-Host "" 
        $openDash = Read-Host "Open the API Tokens page in your browser now? (y/n)"
        if ($openDash -match '^[Yy]$') {
            try { Start-Process "https://dash.cloudflare.com/$accountId/r2/api-tokens" } catch {}
        }
    } catch {
        Write-Host "❌ API Token verification failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    exit 1
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green





