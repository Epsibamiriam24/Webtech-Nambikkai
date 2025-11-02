#!/bin/bash

# Nambikkai Website Deployment Build Script

echo "🚀 Building Nambikkai Website for Production..."

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Frontend build complete!"

# Backend doesn't need build, but let's verify dependencies
echo "📦 Verifying Backend Dependencies..."
cd backend
npm install
cd ..

echo "✅ Backend dependencies verified!"

echo "🎉 Build complete! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin master"
echo "2. Deploy will happen automatically on Render"
echo "3. Check deployment status in Render dashboard"
