# Script to update the bundled renderer from the Custom Pointcloud Renderer project
# Run this whenever you update the renderer and need to rebuild

Write-Host "Updating bundled renderer..." -ForegroundColor Cyan

$rendererPath = "C:\Users\nafiz\Documents\Cascade Dynamics\Custom Pointcloud Renderer"
$destPath = "$PSScriptRoot\..\lib\custom-pointcloud-renderer"

# Check if renderer directory exists
if (-not (Test-Path $rendererPath)) {
    Write-Host "ERROR: Renderer directory not found at: $rendererPath" -ForegroundColor Red
    exit 1
}

# Build the renderer first
Write-Host "Building renderer..." -ForegroundColor Yellow
Push-Location $rendererPath
try {
    npm run build:lib
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Renderer build failed!" -ForegroundColor Red
        exit 1
    }
} finally {
    Pop-Location
}

# Copy the built file
$sourceFile = Join-Path $rendererPath "dist\pointcloud-renderer.es.js"
$destFile = Join-Path $destPath "index.js"

if (-not (Test-Path $sourceFile)) {
    Write-Host "ERROR: Built file not found at: $sourceFile" -ForegroundColor Red
    exit 1
}

Copy-Item $sourceFile -Destination $destFile -Force
Write-Host "✓ Renderer updated successfully!" -ForegroundColor Green
Write-Host "  Source: $sourceFile" -ForegroundColor Gray
Write-Host "  Destination: $destFile" -ForegroundColor Gray
