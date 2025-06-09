# Quick Deploy with Timeouts
Write-Host "=== Quick AWS Deployment ===" -ForegroundColor Cyan

# Skip AWS credential check and go straight to deployment
Write-Host "`nBuilding Docker images locally first..." -ForegroundColor Yellow

# Build images
docker build -f Dockerfile.frontend -t poketrader-frontend:latest . 
if ($LASTEXITCODE -ne 0) { 
    Write-Host "Frontend build failed" -ForegroundColor Red
    exit 
}
Write-Host "✓ Frontend built" -ForegroundColor Green

docker build -f Dockerfile.backend -t poketrader-backend:latest .
if ($LASTEXITCODE -ne 0) { 
    Write-Host "Backend build failed" -ForegroundColor Red
    exit 
}
Write-Host "✓ Backend built" -ForegroundColor Green

Write-Host "`nImages built successfully!" -ForegroundColor Green
Write-Host "`nTo complete AWS deployment:" -ForegroundColor Yellow
Write-Host "1. Fix AWS CLI credentials issue" -ForegroundColor Cyan
Write-Host "2. Or use AWS Console to manually create ECR repositories" -ForegroundColor Cyan
Write-Host "3. Or consider alternative hosting (Render, Railway, Vercel)" -ForegroundColor Cyan

Write-Host "`nYour app is ready for deployment. Docker images:" -ForegroundColor Green
Write-Host "- poketrader-frontend:latest" -ForegroundColor White
Write-Host "- poketrader-backend:latest" -ForegroundColor White 