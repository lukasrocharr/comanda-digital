<#
Simple helper script to deploy backend to Railway using Railway CLI.

Prereqs: railway CLI installed and authenticated: https://docs.railway.app/develop/cli

Usage:
  .\deploy_to_railway.ps1

This script will prompt you to login and run `railway up` in the backend folder.
#>

$ErrorActionPreference = 'Stop'

function Get-RailwayCommand() {
    if (Get-Command railway -ErrorAction SilentlyContinue) {
        return 'railway'
    }
    try {
        $version = & npx @railway/cli --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            return 'npx @railway/cli'
        }
    } catch {
        # ignore
    }
    return $null
}

$railwayCmd = Get-RailwayCommand
if (-not $railwayCmd) {
    Write-Host 'Railway CLI não encontrado. Instale com: npm install -g @railway/cli' -ForegroundColor Red
    exit 1
}

Write-Host "Logging into Railway (browser will open)..."
& $railwayCmd login

Write-Host "Deploying backend (this will build using Dockerfile if present)..."
Push-Location (Join-Path $PSScriptRoot 'backend')
& $railwayCmd up
Pop-Location

Write-Host "If you need to set environment variables or provision a Postgres plugin, open the Railway project in the web console and add variables (DATABASE_URL or SPRING_DATASOURCE_*)." -ForegroundColor Green
