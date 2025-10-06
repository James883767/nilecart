@echo off
echo 🚀 NileCart Marketplace Deployment Script
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Run build to check for errors
echo 🔨 Building project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

REM Check if vercel.json exists
if not exist "vercel.json" (
    echo ⚠️  Warning: vercel.json not found. Creating default configuration...
    echo {> vercel.json
    echo   "buildCommand": "npm run build",>> vercel.json
    echo   "outputDirectory": "dist",>> vercel.json
    echo   "framework": "vite",>> vercel.json
    echo   "rewrites": [>> vercel.json
    echo     {>> vercel.json
    echo       "source": "/(.*)",>> vercel.json
    echo       "destination": "/index.html">> vercel.json
    echo     }>> vercel.json
    echo   ]>> vercel.json
    echo }>> vercel.json
)

echo.
echo 🎉 Your project is ready for deployment!
echo.
echo Next steps:
echo 1. Push to GitHub:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git push origin main
echo.
echo 2. Deploy to Vercel:
echo    - Go to vercel.com
echo    - Import your GitHub repository
echo    - Add environment variables:
echo      - VITE_SUPABASE_URL
echo      - VITE_SUPABASE_ANON_KEY
echo    - Deploy!
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
pause
