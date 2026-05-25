param(
  [switch]$Open = $false
)

Write-Host "===== AI Canvas - Static Build =====" -ForegroundColor Cyan

# Step 1: Clean dist
if (Test-Path "dist") {
  Remove-Item -Recurse -Force "dist"
  Write-Host "[1/3] Cleaned dist/ directory" -ForegroundColor Green
} else {
  Write-Host "[1/3] dist/ directory clean" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null
if ($?) {
  Write-Host "[2/3] Dependencies installed" -ForegroundColor Green
} else {
  Write-Host "[2/3] npm install failed!" -ForegroundColor Red
  exit 1
}

# Step 3: Build
Write-Host "[3/3] Building static files..." -ForegroundColor Yellow
npm run build 2>&1
if ($?) {
  Write-Host "[3/3] Build complete!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Output: dist/" -ForegroundColor Cyan
  Write-Host "Open:   dist/index.html" -ForegroundColor Cyan
  Write-Host "Size:   " -NoNewline
  $size = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum
  if ($size -gt 1MB) {
    Write-Host ("{0:N1} MB" -f ($size / 1MB)) -ForegroundColor Yellow
  } else {
    Write-Host ("{0:N1} KB" -f ($size / 1KB)) -ForegroundColor Yellow
  }

  if ($Open) {
    Start-Process (Resolve-Path "dist/index.html")
  }
} else {
  Write-Host "[3/3] Build failed!" -ForegroundColor Red
  exit 1
}
