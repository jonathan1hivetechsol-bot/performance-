#!/bin/bash
# Database Reset Script for PocketBase
# Usage: ./reset-database.sh
# WARNING: This deletes all data!

set -e

echo "⚠️  WARNING: This will DELETE ALL DATABASE DATA!"
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

cd apps/pocketbase

# Stop PocketBase if running
echo "Stopping PocketBase server..."
pkill -f "pocketbase serve" || true
sleep 2

# Remove database
echo "Deleting database..."
rm -rf pb_data

echo "Creating fresh data directory..."
mkdir -p pb_data

# Start PocketBase (migrations run automatically)
echo "Starting PocketBase with fresh database..."
npm run dev &
POCKETBASE_PID=$!

# Wait for PocketBase to initialize
echo "Waiting for PocketBase to initialize..."
sleep 5

# Check if PocketBase started successfully
if ! kill -0 $POCKETBASE_PID 2>/dev/null; then
    echo "❌ PocketBase failed to start"
    exit 1
fi

echo ""
echo "✅ Database reset complete!"
echo "✅ Migrations ran automatically"
echo "✅ Demo users created:"
echo "   - manager@company.com / Manager123!"
echo "   - alice.smith@company.com / Employee123!"
echo "   - bob.johnson@company.com / Employee123!"
echo "   - carol.williams@company.com / Employee123!"
echo "   - david.brown@company.com / Employee123!"
echo "   - emma.davis@company.com / Employee123!"
echo ""
echo "PocketBase is running on http://localhost:8090"
echo "Admin panel: http://localhost:8090/_/"
