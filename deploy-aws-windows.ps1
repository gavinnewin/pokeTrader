# AWS Deployment Script for Windows
Write-Host "=== AWS Deployment for PokeTrader ===" -ForegroundColor Cyan

# Check if credentials are provided as parameters or environment variables
param(
    [string]$AccessKey,
    [string]$SecretKey,
    [string]$Region = "us-east-2"
)

# AWS Configuration
$AWS_REGION = $Region
$AWS_ACCOUNT_ID = "114513627015"
$ECR_FRONTEND_REPO = "poketrader-frontend"
$ECR_BACKEND_REPO = "poketrader-backend"
$ECS_CLUSTER_NAME = "poketrader-cluster"

# Set AWS CLI path
$awsPath = "${env:ProgramFiles}\Amazon\AWSCLIV2\aws.exe"

# Check if AWS CLI exists
if (-not (Test-Path $awsPath)) {
    Write-Host "ERROR: AWS CLI not found. Please install it from https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Red
    exit 1
}

# Set credentials if provided
if ($AccessKey -and $SecretKey) {
    $env:AWS_ACCESS_KEY_ID = $AccessKey
    $env:AWS_SECRET_ACCESS_KEY = $SecretKey
    $env:AWS_DEFAULT_REGION = $Region
    Write-Host "Using provided AWS credentials" -ForegroundColor Green
}

# Test AWS credentials
Write-Host "`nTesting AWS credentials..." -ForegroundColor Yellow
$testResult = & $awsPath sts get-caller-identity 2>&1
if ($LASTEXITCODE -eq 0) {
    $identity = $testResult | ConvertFrom-Json
    Write-Host "✓ AWS credentials valid. Account: $($identity.Account)" -ForegroundColor Green
} else {
    Write-Host "ERROR: AWS credentials not found or invalid" -ForegroundColor Red
    Write-Host "`nPlease run one of these options:" -ForegroundColor Yellow
    Write-Host "1. With parameters: .\deploy-aws-windows.ps1 -AccessKey YOUR_KEY -SecretKey YOUR_SECRET" -ForegroundColor Cyan
    Write-Host "2. Set environment variables first:" -ForegroundColor Cyan
    Write-Host '   $env:AWS_ACCESS_KEY_ID="your-key"' -ForegroundColor Gray
    Write-Host '   $env:AWS_SECRET_ACCESS_KEY="your-secret"' -ForegroundColor Gray
    exit 1
}

# Check Docker
Write-Host "`nChecking Docker..." -ForegroundColor Yellow
docker ps 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green

# Create ECR repositories
Write-Host "`nCreating ECR repositories..." -ForegroundColor Yellow
& $awsPath ecr describe-repositories --repository-names $ECR_FRONTEND_REPO --region $AWS_REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    & $awsPath ecr create-repository --repository-name $ECR_FRONTEND_REPO --region $AWS_REGION | Out-Null
    Write-Host "✓ Created frontend repository" -ForegroundColor Green
}

& $awsPath ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    & $awsPath ecr create-repository --repository-name $ECR_BACKEND_REPO --region $AWS_REGION | Out-Null
    Write-Host "✓ Created backend repository" -ForegroundColor Green
}

# Login to ECR
Write-Host "`nLogging into ECR..." -ForegroundColor Yellow
$loginCommand = & $awsPath ecr get-login-password --region $AWS_REGION
$loginCommand | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Build and push images
Write-Host "`nBuilding and pushing Docker images..." -ForegroundColor Yellow

# Frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
docker build -f Dockerfile.frontend -t ${ECR_FRONTEND_REPO}:latest .
docker tag ${ECR_FRONTEND_REPO}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_FRONTEND_REPO}:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_FRONTEND_REPO}:latest"
Write-Host "✓ Frontend pushed to ECR" -ForegroundColor Green

# Backend
Write-Host "Building backend..." -ForegroundColor Cyan
docker build -f Dockerfile.backend -t ${ECR_BACKEND_REPO}:latest .
docker tag ${ECR_BACKEND_REPO}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_BACKEND_REPO}:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_BACKEND_REPO}:latest"
Write-Host "✓ Backend pushed to ECR" -ForegroundColor Green

# Update task definitions
Write-Host "`nUpdating task definitions..." -ForegroundColor Yellow
$frontendTaskDef = Get-Content -Path "aws\task-definition-frontend.json" -Raw
$frontendTaskDef = $frontendTaskDef -replace "YOUR_ACCOUNT_ID", $AWS_ACCOUNT_ID
$frontendTaskDef = $frontendTaskDef -replace "YOUR_REGION", $AWS_REGION
$frontendTaskDef | Set-Content -Path "aws\task-definition-frontend-updated.json"

$backendTaskDef = Get-Content -Path "aws\task-definition-backend.json" -Raw
$backendTaskDef = $backendTaskDef -replace "YOUR_ACCOUNT_ID", $AWS_ACCOUNT_ID
$backendTaskDef = $backendTaskDef -replace "YOUR_REGION", $AWS_REGION
$backendTaskDef | Set-Content -Path "aws\task-definition-backend-updated.json"

# Register task definitions
& $awsPath ecs register-task-definition --cli-input-json file://aws/task-definition-frontend-updated.json --region $AWS_REGION | Out-Null
& $awsPath ecs register-task-definition --cli-input-json file://aws/task-definition-backend-updated.json --region $AWS_REGION | Out-Null
Write-Host "✓ Task definitions registered" -ForegroundColor Green

# Create ECS cluster
Write-Host "`nCreating ECS cluster..." -ForegroundColor Yellow
& $awsPath ecs describe-clusters --clusters $ECS_CLUSTER_NAME --region $AWS_REGION 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    & $awsPath ecs create-cluster --cluster-name $ECS_CLUSTER_NAME --capacity-providers FARGATE --region $AWS_REGION | Out-Null
    Write-Host "✓ ECS cluster created" -ForegroundColor Green
}

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Create your MongoDB database (MongoDB Atlas recommended)" -ForegroundColor Cyan
Write-Host "2. Set up environment variables in AWS Secrets Manager" -ForegroundColor Cyan
Write-Host "3. Create VPC and networking infrastructure" -ForegroundColor Cyan
Write-Host "4. Create ECS services and load balancer" -ForegroundColor Cyan
Write-Host "`nRun .\setup-infrastructure-windows.ps1 to create the infrastructure" -ForegroundColor White 