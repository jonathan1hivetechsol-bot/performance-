#!/bin/bash
# 🚀 Hostinger Auto-Deployment Script
# 
# Usage: bash deploy.sh
# 
# What it does:
# 1. Stops running services
# 2. Backs up data
# 3. Installs dependencies
# 4. Builds frontend
# 5. Starts PocketBase
# 6. Starts everything
#
# For Hostinger: Run this via SSH or Cron

set -e  # Exit on error

echo "🚀 Hostinger Auto-Deployment Script"
echo "===================================="

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check prerequisites
print_status "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    exit 1
fi
print_status "Node.js version: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi
print_status "npm version: $(npm --version)"

# Step 2: Create backup
print_status "Creating backup..."
BACKUP_DIR="backups/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -d "apps/pocketbase/pb_data" ]; then
    cp -r apps/pocketbase/pb_data "$BACKUP_DIR/"
    print_status "Database backed up to $BACKUP_DIR"
else
    print_warning "No existing database yet (first deployment)"
fi

# Step 3: Stop existing services
print_status "Stopping existing services..."
pkill pocketbase || print_warning "PocketBase not running"
pkill node || print_warning "Node process not running"
sleep 2

# Step 4: Create required directories
print_status "Creating required directories..."
mkdir -p apps/pocketbase/pb_data
mkdir -p apps/web/dist

# Step 5: Install dependencies
print_status "Installing PocketBase dependencies..."
cd apps/pocketbase
npm install
cd ../..

print_status "Installing web dependencies..."
cd apps/web
npm install
cd ../..

# Step 6: Build frontend
print_status "Building frontend..."
cd apps/web
npm run build
if [ -d "dist" ]; then
    print_status "Frontend built successfully"
else
    print_error "Frontend build failed!"
    exit 1
fi
cd ../..

# Step 7: Set environment variables
print_status "Setting up environment..."
export NODE_ENV=production
export PB_ENCRYPTION_KEY="${PB_ENCRYPTION_KEY:-test-key-change-this}"

# Step 8: Start PocketBase
print_status "Starting PocketBase..."
cd apps/pocketbase

# Make binary executable
chmod +x pocketbase

# Start in background
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &
PB_PID=$!

# Wait for PocketBase to start
print_status "Waiting for PocketBase to initialize..."
sleep 5

# Check if PocketBase is running
if ps -p $PB_PID > /dev/null; then
    print_status "PocketBase started (PID: $PB_PID)"
else
    print_error "PocketBase failed to start!"
    cat pocketbase.log
    exit 1
fi

# Check if PocketBase is responding
if curl -s http://localhost:8090/api/health > /dev/null; then
    print_status "PocketBase is responding"
else
    print_warning "PocketBase not responding yet (might still be initializing)"
fi

cd ../..

# Step 9: Verify deployment
print_status "Verifying deployment..."
sleep 3

# Check PocketBase
if curl -s http://localhost:8090/api/health > /dev/null; then
    print_status "✅ PocketBase is running and responding"
else
    print_warning "⚠️ PocketBase health check failed (might still be initializing)"
fi

# Step 10: Display status
print_status "Deployment complete!"
echo ""
echo "=========================================="
echo "Deployment Status:"
echo "=========================================="
echo -e "${GREEN}✅ PocketBase:${NC} http://0.0.0.0:8090"
echo -e "${GREEN}✅ Frontend:${NC} Built to apps/web/dist/"
echo -e "${GREEN}✅ Data:${NC} apps/pocketbase/pb_data/"
echo ""
echo "Next steps:"
echo "1. Configure Nginx to serve frontend"
echo "2. Proxy /api/* requests to http://localhost:8090"
echo "3. Enable SSL certificates"
echo "4. Test at https://yourdomain.com"
echo ""
echo "View logs:"
echo "  tail -f apps/pocketbase/pocketbase.log"
echo ""
echo "Stop services:"
echo "  pkill pocketbase"
echo "  pkill node"
echo ""
echo "Restart services:"
echo "  bash deploy.sh"
echo "=========================================="

print_status "Deployment finished! 🎉"
