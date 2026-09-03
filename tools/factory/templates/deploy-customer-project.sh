#!/usr/bin/env bash
set -euo pipefail

# Customer Automated Deployment & Rollback Script
# Usage: ./deploy-customer-project.sh <tenant> [git_branch_or_tag]

TENANT="${1:-}"
BRANCH="${2:-main}"

if [ -z "$TENANT" ]; then
    echo "Error: Tenant ID is required."
    echo "Usage: $0 <tenant> [branch]"
    exit 1
fi

CUSTOMER_DIR="/var/www/customers/$TENANT"
RELEASES_DIR="$CUSTOMER_DIR/releases"
SHARED_DIR="$CUSTOMER_DIR/shared"
CURRENT_LINK="$CUSTOMER_DIR/current"
RELEASE_ID=$(date +%Y%m%d-%H%M%S)
NEW_RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"

if [ ! -d "$CUSTOMER_DIR" ]; then
    echo "Error: Customer directory $CUSTOMER_DIR does not exist."
    exit 1
fi

if [ ! -f "$CUSTOMER_DIR/.repo_url" ]; then
    echo "Error: Git repository URL file $CUSTOMER_DIR/.repo_url missing."
    exit 1
fi

REPO_URL=$(cat "$CUSTOMER_DIR/.repo_url")
echo "=== Starting deployment for customer [$TENANT] ==="
echo "Release ID: $RELEASE_ID"
echo "Git Branch: $BRANCH"
echo "Repo URL:   $REPO_URL"

# 1. Prepare Release Folder & Clone
mkdir -p "$NEW_RELEASE_DIR"
git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$NEW_RELEASE_DIR"
cd "$NEW_RELEASE_DIR"

# 2. Copy Shared Secrets
if [ -f "$SHARED_DIR/.env" ]; then
    cp "$SHARED_DIR/.env" "$NEW_RELEASE_DIR/.env"
fi

# 3. Install & Build
npm ci
NITRO_PRESET=node-server npm run build

# 4. Atomic Symlink Switch
ln -sfn "$NEW_RELEASE_DIR" "$CURRENT_LINK"

# 5. Service Restart
SERVICE_NAME="customer-$TENANT.service"
echo "Restarting service $SERVICE_NAME..."
sudo systemctl restart "$SERVICE_NAME"

# 6. Health Check Verification
PORT=$(grep -E "^PORT=" "$SHARED_DIR/.env" | cut -d'=' -f2 || echo "3100")
sleep 3
if curl -s -f "http://127.0.0.1:$PORT/" > /dev/null; then
    echo "✅ SUCCESS: Release [$RELEASE_ID] deployed and verified on port $PORT."
else
    echo "❌ FAILURE: Health check failed for release [$RELEASE_ID]!"
    echo "Initiating automatic rollback to previous release..."
    PREV_RELEASE=$(ls -td "$RELEASES_DIR"/* 2>/dev/null | grep -v "$RELEASE_ID" | sed -n '1p')
    if [ -n "$PREV_RELEASE" ]; then
        ln -sfn "$PREV_RELEASE" "$CURRENT_LINK"
        sudo systemctl restart "$SERVICE_NAME"
        echo "⚠️ ROLLED BACK successfully to $PREV_RELEASE."
    else
        echo "🚨 ERROR: No previous release found to rollback!"
    fi
    exit 1
fi
