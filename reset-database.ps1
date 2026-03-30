# Database Reset Script for PocketBase (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File reset-database.ps1
# WARNING: This deletes all data!

Write-Host "⚠️  WARNING: This will DELETE ALL DATABASE DATA!" -ForegroundColor Red
Write-Host "Press Ctrl+C to cancel, or wait 5 seconds to continue..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Set-Location "apps/pocketbase"

# Stop PocketBase if running
Write-Host "Stopping PocketBase server..." -ForegroundColor Cyan
Get-Process pocketbase -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Remove database
Write-Host "Deleting database..." -ForegroundColor Cyan
if (Test-Path "pb_data") {
    Remove-Item -Path "pb_data" -Recurse -Force
}

Write-Host "Creating fresh data directory..." -ForegroundColor Cyan
if (-not (Test-Path "pb_data")) {
    New-Item -ItemType Directory -Path "pb_data" | Out-Null
}

# Start PocketBase (migrations run automatically)
Write-Host "Starting PocketBase with fresh database..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow

# Wait for PocketBase to initialize
Write-Host "Waiting for PocketBase to initialize (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Database reset complete!" -ForegroundColor Green
Write-Host "✅ Migrations ran automatically" -ForegroundColor Green
Write-Host "✅ Demo users created:" -ForegroundColor Green
Write-Host "   - manager@company.com / Manager123!" -ForegroundColor White
Write-Host "   - alice.smith@company.com / Employee123!" -ForegroundColor White
Write-Host "   - bob.johnson@company.com / Employee123!" -ForegroundColor White
Write-Host "   - carol.williams@company.com / Employee123!" -ForegroundColor White
Write-Host "   - david.brown@company.com / Employee123!" -ForegroundColor White
Write-Host "   - emma.davis@company.com / Employee123!" -ForegroundColor White
Write-Host ""
Write-Host "PocketBase is running on http://localhost:8090" -ForegroundColor Cyan
Write-Host "Admin panel: http://localhost:8090/_/" -ForegroundColor Cyan
Write-Host "React frontend: cd apps/web && npm run dev" -ForegroundColor Cyan
