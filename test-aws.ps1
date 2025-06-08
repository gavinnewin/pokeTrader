Write-Host "Testing AWS Setup..." -ForegroundColor Yellow

# Test 1: Check if AWS CLI exists
$awsPath = "${env:ProgramFiles}\Amazon\AWSCLIV2\aws.exe"
if (Test-Path $awsPath) {
    Write-Host "✓ AWS CLI found at: $awsPath" -ForegroundColor Green
} else {
    Write-Host "✗ AWS CLI not found" -ForegroundColor Red
    exit
}

# Test 2: Check environment variables
Write-Host "`nChecking environment variables:" -ForegroundColor Yellow
if ($env:AWS_ACCESS_KEY_ID) {
    Write-Host "✓ AWS_ACCESS_KEY_ID is set (length: $($env:AWS_ACCESS_KEY_ID.Length))" -ForegroundColor Green
} else {
    Write-Host "✗ AWS_ACCESS_KEY_ID is NOT set" -ForegroundColor Red
}

if ($env:AWS_SECRET_ACCESS_KEY) {
    Write-Host "✓ AWS_SECRET_ACCESS_KEY is set" -ForegroundColor Green
} else {
    Write-Host "✗ AWS_SECRET_ACCESS_KEY is NOT set" -ForegroundColor Red
}

Write-Host "AWS_DEFAULT_REGION: $env:AWS_DEFAULT_REGION" -ForegroundColor Cyan

# Test 3: Try a simple AWS command with timeout
Write-Host "`nTesting AWS connection (10 second timeout)..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    & $using:awsPath sts get-caller-identity 2>&1
}

$result = Wait-Job $job -Timeout 10
if ($result) {
    $output = Receive-Job $job
    if ($job.State -eq "Completed") {
        Write-Host "✓ AWS connection successful:" -ForegroundColor Green
        Write-Host $output -ForegroundColor Cyan
    } else {
        Write-Host "✗ AWS command failed:" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
    }
} else {
    Write-Host "✗ AWS command timed out after 10 seconds" -ForegroundColor Red
    Stop-Job $job
    Remove-Job $job
}

# Test 4: Check Docker
Write-Host "`nChecking Docker:" -ForegroundColor Yellow
docker version --format "✓ Docker version {{.Server.Version}}" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker is not running" -ForegroundColor Red
} 