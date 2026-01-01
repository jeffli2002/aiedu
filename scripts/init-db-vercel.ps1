# Vercel Database Initialization Script
# This script calls the Vercel API to initialize database tables

param(
    [Parameter(Mandatory=$false)]
    [string]$CronSecret,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://www.futurai.org/api/admin/init-db"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel Database Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# If CRON_SECRET not provided as parameter, prompt user
if (-not $CronSecret) {
    Write-Host "Please enter your CRON_SECRET from Vercel:" -ForegroundColor Yellow
    Write-Host "(You can find it in Vercel Dashboard → Settings → Environment Variables)" -ForegroundColor Gray
    Write-Host ""
    $CronSecret = Read-Host -Prompt "CRON_SECRET" -AsSecureString
    $CronSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($CronSecret)
    )
}

if (-not $CronSecret) {
    Write-Host "❌ Error: CRON_SECRET is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Calling API: $ApiUrl" -ForegroundColor Gray
Write-Host ""

try {
    $headers = @{
    "Authorization" = "Bearer $CronSecret"
    "Content-Type" = "application/json"
}

    Write-Host "Sending request..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $ApiUrl -Method POST -Headers $headers -ErrorAction Stop
    
    Write-Host ""
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
    
    if ($response.success) {
        Write-Host ""
        Write-Host "Tables initialized:" -ForegroundColor Green
        foreach ($table in $response.tables) {
            Write-Host "  ✓ $table" -ForegroundColor Green
        }
        Write-Host ""
        Write-Host "🎉 Database initialization completed successfully!" -ForegroundColor Green
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            $errorObj = $responseBody | ConvertFrom-Json
            Write-Host "Error: $($errorObj.error)" -ForegroundColor Red
            if ($errorObj.message) {
                Write-Host "Details: $($errorObj.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Response: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify CRON_SECRET is correct in Vercel Dashboard" -ForegroundColor Gray
    Write-Host "2. Ensure the project has been redeployed after setting CRON_SECRET" -ForegroundColor Gray
    Write-Host "3. Check Vercel deployment logs for more details" -ForegroundColor Gray
    
    exit 1
}

