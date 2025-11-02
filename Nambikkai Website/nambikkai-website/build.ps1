# Nambikkai Website Deployment Build Script (Windows)

Write-Host "🚀 Building Nambikkai Website for Production..." -ForegroundColor Green

# Build Frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Yellow
Set-Location -Path "nambikkai-website\frontend"
npm install
npm run build
Set-Location -Path "..\..\"

Write-Host "✅ Frontend build complete!" -ForegroundColor Green

# Backend doesn't need build, but let's verify dependencies
Write-Host "📦 Verifying Backend Dependencies..." -ForegroundColor Yellow
Set-Location -Path "nambikkai-website\backend"
npm install
Set-Location -Path "..\..\"

Write-Host "✅ Backend dependencies verified!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Build complete! Ready for deployment." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Push to GitHub: git push origin master" -ForegroundColor White
Write-Host "2. Deploy will happen automatically on Render" -ForegroundColor White
Write-Host "3. Check deployment status in Render dashboard" -ForegroundColor White
