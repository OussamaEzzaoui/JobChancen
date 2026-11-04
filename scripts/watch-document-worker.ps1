
$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $PSScriptRoot)

$env:TECTONIC_BIN = (Resolve-Path ".\tectonic.exe").Path

Write-Host "JobChancen PDF worker started." -ForegroundColor Green

while ($true) {
    Write-Host "Checking pending PDF jobs: $(Get-Date -Format 'HH:mm:ss')"

    node --experimental-strip-types --env-file=.env.local .\scripts\run-document-worker.ts

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Document worker failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }

    Start-Sleep -Seconds 10
}
