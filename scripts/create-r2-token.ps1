# Cloudflare R2 Token Creation Script
# Usage: Run this script in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cloudflare R2 Access Key Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Account ID
Write-Host "Step 1: Enter your Cloudflare Account ID" -ForegroundColor Yellow
Write-Host "(You can find it in R2 Settings > R2 Data Catalog > Warehouse Name)" -ForegroundColor Gray
Write-Host "Example: ccb5990ee93ad99d5ada77b738e942c6" -ForegroundColor Gray
$accountId = Read-Host "Account ID"

if ([string]::IsNullOrWhiteSpace($accountId)) {
    Write-Host "Error: Account ID cannot be empty" -ForegroundColor Red
    exit 1
}

# Step 2: Get API Token (for calling Cloudflare API)
Write-Host ""
Write-Host "Step 2: Create Account API Token" -ForegroundColor Yellow
Write-Host "1. Visit: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Gray
Write-Host "2. Click 'Create Token'" -ForegroundColor Gray
Write-Host "3. Use 'Edit Cloudflare Workers' template, or custom permissions: Account > Cloudflare R2 > Edit" -ForegroundColor Gray
Write-Host "4. Copy the Token after creation" -ForegroundColor Gray
Write-Host ""
$apiToken = Read-Host "Enter your Account API Token"

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
$tokenName = Read-Host "Token name (e.g., aiedu-r2-token) [default: $bucketName-r2-token]"
if ([string]::IsNullOrWhiteSpace($tokenName)) {
    $tokenName = "$bucketName-r2-token"
}

# Step 5: Call API to create R2 Token
Write-Host ""
Write-Host "Creating R2 access keys..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $apiToken"
    "Content-Type" = "application/json"
}

# Prefer name-only body for /r2/s3/keys; some legacy endpoints might allow bucket scoping
$bodyNameOnly = @{ name = $tokenName } | ConvertTo-Json
$bodyWithBucket = @{ name = $tokenName; bucket = $bucketName } | ConvertTo-Json

try {
    # Try the correct API endpoint for R2 access keys
    # The endpoint might be /r2/keys instead of /r2/token
    Write-Host "Attempting to create R2 access key..." -ForegroundColor Gray
    
    # First, try the /r2/s3/keys endpoint (current API)
    try {
        $response = Invoke-RestMethod `
            -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/s3/keys" `
            -Method Post `
            -Headers $headers `
            -Body $bodyNameOnly `
            -ErrorAction Stop
    } catch {
        # If that fails, try legacy endpoints
        Write-Host "Trying alternative endpoint..." -ForegroundColor Gray
        try {
            $response = Invoke-RestMethod `
                -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/keys" `
                -Method Post `
                -Headers $headers `
                -Body $bodyNameOnly `
                -ErrorAction Stop
        } catch {
            $response = Invoke-RestMethod `
                -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/r2/token" `
                -Method Post `
                -Headers $headers `
                -Body $bodyWithBucket `
                -ErrorAction Stop
        }
    }

    # Handle different response formats
    $accessKeyId = $null
    $secretAccessKey = $null
    
    if ($response.success -or $response.result -or $response.access_key_id -or $response.accessKeyId) {
        # Check for different response structures
        if ($response.result.access_key_id) {
            $accessKeyId = $response.result.access_key_id
            $secretAccessKey = $response.result.secret_access_key
        } elseif ($response.result.accessKeyId) {
            $accessKeyId = $response.result.accessKeyId
            $secretAccessKey = $response.result.secretAccessKey
        } elseif ($response.access_key_id) {
            $accessKeyId = $response.access_key_id
            $secretAccessKey = $response.secret_access_key
        } elseif ($response.result.access_key) {
            $accessKeyId = $response.result.access_key
            $secretAccessKey = $response.result.secret_key
        } elseif ($response.access_key) {
            $accessKeyId = $response.access_key
            $secretAccessKey = $response.secret_key
        } else {
            Write-Host "Unexpected response format:" -ForegroundColor Yellow
            Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Gray
            throw "Could not find access keys in response"
        }
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCESS! R2 access keys created!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Add the following to your .env.local file:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "R2_BUCKET_NAME=`"$bucketName`"" -ForegroundColor White
        Write-Host "R2_ACCESS_KEY_ID=`"$accessKeyId`"" -ForegroundColor White
        Write-Host "R2_SECRET_ACCESS_KEY=`"$secretAccessKey`"" -ForegroundColor White
        Write-Host "R2_ENDPOINT=`"https://$accountId.r2.cloudflarestorage.com`"" -ForegroundColor White
        Write-Host "R2_PUBLIC_URL=`"https://pub-e561ff6c3fe54da085061ba60bdf2026.r2.dev`"" -ForegroundColor White
        Write-Host ""
        Write-Host "WARNING: Secret Access Key is shown only once. Save it immediately!" -ForegroundColor Red
        Write-Host ""
        
        # Ask if save to file
        $saveToFile = Read-Host "Save to .env.local? (y/n)"
        if ($saveToFile -eq "y" -or $saveToFile -eq "Y") {
            $envContent = @"
# R2 Storage (Cloudflare)
R2_BUCKET_NAME="$bucketName"
R2_ACCESS_KEY_ID="$accessKeyId"
R2_SECRET_ACCESS_KEY="$secretAccessKey"
R2_ENDPOINT="https://$accountId.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-e561ff6c3fe54da085061ba60bdf2026.r2.dev"
"@
            $envContent | Add-Content -Path ".env.local" -Encoding UTF8
            Write-Host "Saved to .env.local" -ForegroundColor Green
            Write-Host "Note: Update R2_PUBLIC_URL if you have a custom domain" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Failed: $($response.errors | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to parse error response
    if ($_.ErrorDetails) {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        try {
            $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
            if ($errorResponse.errors) {
                Write-Host ""
                Write-Host "API Errors:" -ForegroundColor Yellow
                foreach ($err in $errorResponse.errors) {
                    Write-Host "  - $($err.message) (Code: $($err.code))" -ForegroundColor Red
                }
            }
        } catch {
            # Ignore JSON parse errors
        }
    }
    
    # Check if it's a 404 error
    if ($_.Exception.Message -like "*404*" -or $_.Exception.Message -like "*未找到*") {
        Write-Host ""
        Write-Host "404 Error - Possible causes:" -ForegroundColor Yellow
        Write-Host "1. Account ID might be incorrect" -ForegroundColor Gray
        Write-Host "2. API endpoint might have changed" -ForegroundColor Gray
        Write-Host "3. R2 service might not be enabled for your account" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Trying to verify Account ID and API Token..." -ForegroundColor Cyan
        
        # Try to list buckets to verify credentials
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
            Write-Host "The issue might be with the token creation endpoint." -ForegroundColor Yellow
            Write-Host "Please try creating the R2 access key through the Cloudflare Dashboard:" -ForegroundColor Yellow
            Write-Host "1. Go to R2 > Your Bucket > Settings" -ForegroundColor Gray
            Write-Host "2. Look for 'API Tokens' or 'Access Keys' section" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Cannot verify credentials. Please check:" -ForegroundColor Red
            Write-Host "   - Account ID: $accountId" -ForegroundColor Gray
            Write-Host "   - API Token permissions" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "1. Account ID is correct: $accountId" -ForegroundColor Gray
        Write-Host "2. API Token has R2 Edit permissions" -ForegroundColor Gray
        Write-Host "3. Bucket name is correct: $bucketName" -ForegroundColor Gray
    }
    exit 1
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
