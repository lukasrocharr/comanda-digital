<#
Deploy script for Comanda Digital

Usage:
  .\deploy_to_gcp.ps1 -ProjectId your-gcp-project-id -Region us-central1

This script will:
- build the Angular frontend (`npx ng build --configuration production`)
- submit the backend `backend` folder to Cloud Build which deploys to Cloud Run
- deploy Firebase Hosting (using firebase.json)

Prerequisites (run beforehand):
- gcloud auth login
- firebase login
#>

param(
    [Parameter(Mandatory=$false)] [string]$ProjectId,
    [Parameter(Mandatory=$false)] [string]$Region = 'us-central1'
)

$ErrorActionPreference = 'Stop'

function Fail($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

function CheckCmd($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) { Fail "Command not found: $name" }
}

if (-not $ProjectId) {
    $ProjectId = 'comanda-digital-0521-2026'
    Write-Host "No ProjectId provided; defaulting to $ProjectId"
}
if (-not $ProjectId) { Fail 'ProjectId is required.' }

Write-Host "Using project: $ProjectId  region: $Region"

CheckCmd gcloud
CheckCmd firebase
CheckCmd npm
CheckCmd npx
CheckCmd mvn

# verify gcloud auth
$activeAccount = & gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $activeAccount) {
    Fail 'No active gcloud account. Run: gcloud auth login'
}

# verify firebase login (best-effort)
try {
    & firebase projects:list --project $ProjectId > $null
} catch {
    Write-Host 'Warning: firebase projects:list failed. Ensure you are logged in via `firebase login` and that the project exists.' -ForegroundColor Yellow
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "== Building frontend =="
Push-Location $root
if (Test-Path (Join-Path $root 'package.json')) {
    npm install
    npx ng build --configuration production
} else {
    Write-Host 'No package.json found in repo root — skipping frontend build' -ForegroundColor Yellow
}
Pop-Location

Write-Host "== Deploying backend via Cloud Build (build + deploy to Cloud Run) =="
Push-Location (Join-Path $root 'backend')
if (-not (Test-Path (Join-Path (Get-Location) 'cloudbuild.yaml'))) {
    Write-Host 'cloudbuild.yaml not found in backend — aborting backend deploy' -ForegroundColor Red
    Pop-Location
    exit 1
}

gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$Region --project=$ProjectId

Write-Host "Fetching Cloud Run service URL..."
try {
    $serviceUrl = & gcloud run services describe comanda-digital --platform managed --region $Region --project $ProjectId --format "value(status.url)" 2>$null
    if ($serviceUrl) { Write-Host "Cloud Run URL: $serviceUrl" }
    else { Write-Host "Cloud Run service 'comanda-digital' not found or URL unavailable." -ForegroundColor Yellow }
} catch {
    Write-Host "Failed to get Cloud Run URL: $_" -ForegroundColor Yellow
}
Pop-Location

Write-Host "== Deploying Firebase Hosting =="
Push-Location $root
firebase deploy --only hosting --project $ProjectId
Pop-Location

Write-Host "Deploy finished. If you configured rewrites to Cloud Run, ensure the Cloud Run service name and region match firebase.json." -ForegroundColor Green
