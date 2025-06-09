# Simple AWS Deployment Script
Write-Host "=== PokeTrader AWS Deployment ===" -ForegroundColor Cyan

$awsPath = "${env:ProgramFiles}\Amazon\AWSCLIV2\aws.exe"

# If credentials not in environment, prompt for them
if (-not $env:AWS_ACCESS_KEY_ID) {
    Write-Host "AWS credentials not found in environment." -ForegroundColor Yellow
    $accessKey = Read-Host "Enter your AWS Access Key ID"
    $secretKey = Read-Host "Enter your AWS Secret Access Key" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey)
    $secretKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    $env:AWS_ACCESS_KEY_ID = $accessKey
    $env:AWS_SECRET_ACCESS_KEY = $secretKeyPlain
    $env:AWS_DEFAULT_REGION = "us-east-2"
}

Write-Host "`nStarting deployment..." -ForegroundColor Green

# Run deployment
& $awsPath ecr create-repository --repository-name poketrader-frontend --region us-east-2 2>$null
& $awsPath ecr create-repository --repository-name poketrader-backend --region us-east-2 2>$null

$loginCmd = & $awsPath ecr get-login-password --region us-east-2
$loginCmd | docker login --username AWS --password-stdin 114513627015.dkr.ecr.us-east-2.amazonaws.com

Write-Host "`nBuilding and pushing images..." -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t poketrader-frontend:latest .
docker tag poketrader-frontend:latest 114513627015.dkr.ecr.us-east-2.amazonaws.com/poketrader-frontend:latest
docker push 114513627015.dkr.ecr.us-east-2.amazonaws.com/poketrader-frontend:latest

docker build -f Dockerfile.backend -t poketrader-backend:latest .
docker tag poketrader-backend:latest 114513627015.dkr.ecr.us-east-2.amazonaws.com/poketrader-backend:latest
docker push 114513627015.dkr.ecr.us-east-2.amazonaws.com/poketrader-backend:latest

Write-Host "`nDeployment complete!" -ForegroundColor Green 