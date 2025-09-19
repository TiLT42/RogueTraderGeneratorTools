<#!
PowerShell wrapper for cross-platform JS syntax validation.
Uses Node's --check flag on every .js file under js/, tests/, and scripts/.
Aggregates failures and sets a non-zero exit code if any syntax errors are found.
#>

param(
    [switch]$StopOnFirst
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$paths = @('js','tests','scripts') | ForEach-Object { Join-Path $root $_ }

$files = @()
foreach($p in $paths){
    if(Test-Path $p){
        $files += Get-ChildItem -Path $p -Recurse -Filter *.js | Where-Object { -not ($_.FullName -match 'node_modules') }
    }
}

if($files.Count -eq 0){
    Write-Host 'No JavaScript files found.'
    exit 0
}

$failures = 0
foreach($f in $files){
    try {
        node --check $f.FullName 1>$null
    } catch {
        Write-Host "Syntax error: $($f.FullName)" -ForegroundColor Red
        $failures++
        if($StopOnFirst){ break }
    }
}

if($failures -gt 0){
    Write-Host "Validation failed: $failures file(s) contain syntax errors." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Validation succeeded: $($files.Count) files checked." -ForegroundColor Green
}
