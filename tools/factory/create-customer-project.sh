#!/usr/bin/env bash
set -euo pipefail

# Scaffold script for Client Project Hosting Factory
# Usage:
#   ./create-customer-project.sh \
#     --tenant acme \
#     --project-name "Acme Corporation" \
#     --port 3101 \
#     --repo https://github.com/org/acme-repo.git \
#     [--custom-domain acme-company.com]

TENANT=""
PROJECT_NAME=""
PORT=""
REPO_URL=""
CUSTOM_DOMAIN=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --tenant) TENANT="$2"; shift 2 ;;
    --project-name) PROJECT_NAME="$2"; shift 2 ;;
    --port) PORT="$2"; shift 2 ;;
    --repo) REPO_URL="$2"; shift 2 ;;
    --custom-domain) CUSTOM_DOMAIN="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$TENANT" || -z "$PROJECT_NAME" || -z "$PORT" ]]; then
  echo "Error: --tenant, --project-name, and --port are required."
  echo "Example: $0 --tenant acme --project-name \"Acme Corp\" --port 3101 --repo https://github.com/org/repo.git"
  exit 1
fi

if ! [[ "$TENANT" =~ ^[a-z0-9-]+$ ]]; then
  echo "Error: Tenant ID must contain only lowercase letters, numbers, and hyphens."
  exit 1
fi

REGISTRY_FILE="/opt/nextnext-gen/customers/registry.json"
BASE_CUSTOMERS_DIR="/var/www/customers"
CUSTOMER_DIR="$BASE_CUSTOMERS_DIR/$TENANT"

# Port collision check
if [[ -f "$REGISTRY_FILE" ]]; then
  if grep -q "\"port\": $PORT" "$REGISTRY_FILE"; then
    echo "Error: Port $PORT is already allocated in registry ($REGISTRY_FILE)."
    exit 1
  fi
fi

if [[ -d "$CUSTOMER_DIR" ]]; then
  echo "Error: Customer directory $CUSTOMER_DIR already exists."
  exit 1
fi

echo "=== Scaffolding Customer Factory Project ==="
echo "Tenant:          $TENANT"
echo "Project Name:    $PROJECT_NAME"
echo "Assigned Port:   $PORT"
echo "Temporary URL:   https://$TENANT.nextnext-gen.com"
echo "Custom Domain:   ${CUSTOM_DOMAIN:-None}"
echo "Directory:       $CUSTOMER_DIR"

# 1. Directory Structure Setup
mkdir -p "$CUSTOMER_DIR/releases"
mkdir -p "$CUSTOMER_DIR/shared/logs"
chmod 700 "$CUSTOMER_DIR/shared"

if [[ -n "$REPO_URL" ]]; then
  echo "$REPO_URL" > "$CUSTOMER_DIR/.repo_url"
fi

# 2. Shared Environment File
cat <<EOF > "$CUSTOMER_DIR/shared/.env"
PORT=$PORT
NODE_ENV=production
TENANT_ID=$TENANT
PROJECT_NAME="$PROJECT_NAME"
VITE_PORTFOLIO_API_URL=https://api.nextnext-gen.com/api/v1
EOF
chmod 600 "$CUSTOMER_DIR/shared/.env"

# 3. Systemd Service File Generation
SERVICE_FILE="/etc/systemd/system/customer-$TENANT.service"
cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Customer Service: $PROJECT_NAME ($TENANT)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$CUSTOMER_DIR/current
ExecStart=/usr/bin/node $CUSTOMER_DIR/current/.output/server/index.mjs
Restart=always
RestartSec=5
EnvironmentFile=$CUSTOMER_DIR/shared/.env
StandardOutput=append:$CUSTOMER_DIR/shared/logs/app.log
StandardError=append:$CUSTOMER_DIR/shared/logs/error.log

[Install]
WantedBy=multi-user.target
EOF

# 4. Nginx Server Block Template Generation
NGINX_CONF="/etc/nginx/sites-available/customer-$TENANT.conf"
cat <<EOF > "$NGINX_CONF"
# Customer Nginx Configuration: $PROJECT_NAME ($TENANT)
server {
    listen 80;
    listen [::]:80;
    server_name $TENANT.nextnext-gen.com${CUSTOM_DOMAIN:+ $CUSTOM_DOMAIN www.$CUSTOM_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "✅ Scaffold successful for [$TENANT]."
echo "Configurations prepared:"
echo " - Directory: $CUSTOMER_DIR"
echo " - Systemd:   $SERVICE_FILE"
echo " - Nginx:     $NGINX_CONF"
echo " - Env File:  $CUSTOMER_DIR/shared/.env"
echo ""
echo "Next Steps required before activation:"
echo " 1. Configure DNS (A record for $TENANT.nextnext-gen.com -> 95.217.126.241 or wildcard *.nextnext-gen.com)."
echo " 2. Run deployment: ./deploy-customer-project.sh $TENANT"
echo " 3. Issue SSL certificate: certbot --nginx -d $TENANT.nextnext-gen.com"
echo " 4. Enable Nginx site: ln -s $NGINX_CONF /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
