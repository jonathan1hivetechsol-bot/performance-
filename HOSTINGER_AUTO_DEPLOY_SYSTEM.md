# 🚀 Hostinger Auto-Deploy System - Complete Guide

## 📌 Overview

**"Khud ba khud apna databse set krly"** - Automatic database setup on Hostinger!

This guide sets up everything automatically when you deploy:
- ✅ PocketBase starts automatically
- ✅ Database creates itself
- ✅ Collections auto-initialize
- ✅ Users auto-seed with demo data
- ✅ Everything runs on startup

---

## 🎯 What Will Happen Automatically

When you deploy to Hostinger:

```
1. Server Starts
   ↓
2. PocketBase Initialize (auto-creates database)
   ↓
3. Migrations Run (auto-create collections)
   ↓
4. Demo Users Seed (manager, employees auto-created)
   ↓
5. System Ready! ✅
```

**Result**: No manual setup needed!

---

## 📋 Pre-Deployment Checklist

- [ ] Hostinger account active
- [ ] SSH access enabled
- [ ] Domain registered (or use Hostinger subdomain)
- [ ] Node.js 20.19+ installed on server
- [ ] Git access (or manual upload)

---

## 🔧 Step 1: Prepare Local Files for Deployment

### Create deployment script (add to root directory):

```bash
# File: deploy.sh (for Linux/Mac on Hostinger)
#!/bin/bash

echo "🚀 Starting deployment..."

# Stop any existing services
pkill pocketbase || true
pkill node || true

# Create required directories
mkdir -p pb_data
mkdir -p apps/pocketbase/pb_data
mkdir -p apps/web/dist

# Install dependencies
echo "📦 Installing dependencies..."
cd apps/pocketbase && npm install && cd ../../
cd apps/web && npm install && npm run build && cd ../../

# Set environment
export PB_ENCRYPTION_KEY="your-secret-key-here"
export NODE_ENV=production
export VITE_POCKETBASE_URL="https://your-domain.com"

# Start PocketBase (migrations run automatically on startup)
echo "🔧 Starting PocketBase..."
cd apps/pocketbase
nohup ./pocketbase serve --http=0.0.0.0:8090 &

# Wait for PocketBase to be ready
sleep 5

# Nginx forward (if using Nginx proxy)
echo "✅ Deployment complete!"
```

---

## 📂 Step 2: Directory Structure on Hostinger

```
/home/yourusername/public_html/
├── app/
│   ├── apps/
│   │   ├── pocketbase/
│   │   │   ├── pocketbase (binary)
│   │   │   ├── pb_data/       (auto-created)
│   │   │   ├── pb_migrations/
│   │   │   ├── pb_hooks/
│   │   │   └── package.json
│   │   └── web/
│   │       ├── dist/          (built files)
│   │       ├── src/
│   │       └── package.json
│   ├── package.json
│   └── deploy.sh
└── index.html (or nginx config)
```

---

## 🌐 Step 3: Setup Hostinger (Complete Steps)

### A. SSH into Hostinger Server
```bash
ssh user@your-domain.com
# Or use Hostinger control panel SSH terminal
```

### B. Create Application Directory
```bash
cd public_html
mkdir app
cd app
```

### C. Upload Your Code
```bash
# Option 1: Using Git (recommended)
git clone https://github.com/your-username/your-repo.git .

# Option 2: Using SCP from local machine
scp -r apps user@your-domain.com:~/public_html/app/

# Option 3: Using Hostinger File Manager
# Upload apps folder via control panel
```

### D. Install Dependencies
```bash
cd apps/pocketbase
npm install

cd ../web
npm install
npm run build  # Creates dist/ folder
```

---

## ☁️ Step 4: Configure Environment Variables

### Create .env file for PocketBase:
```bash
# File: apps/pocketbase/.env (or set in Hostinger control panel)
PB_ENCRYPTION_KEY=change-me-to-random-string-32-chars-long
PB_ADMIN_EMAIL=admin@yourdomain.com
PB_ADMIN_PASSWORD=SecurePassword123!
```

### Create .env for React:
```bash
# File: apps/web/.env.production
VITE_POCKETBASE_URL=https://yourdomain.com
# OR if using subdomain
VITE_POCKETBASE_URL=https://api.yourdomain.com
```

---

## 🖥️ Step 5: Configure Web Server (Nginx)

**Hostinger uses Nginx. Configure via control panel or SSH:**

### A. Nginx Config for Frontend + API Reverse Proxy:
```nginx
# File: /etc/nginx/sites-available/default (via Hostinger)

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL certificates (Hostinger provides these)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Serve React frontend
    root /home/user/public_html/app/apps/web/dist;
    index index.html;
    
    # All requests go to React (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to PocketBase
    location /api/ {
        proxy_pass http://localhost:8090/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Optional: Direct PocketBase admin access
    location /_/ {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

**Via Hostinger Control Panel:**
1. Go to "Domains" → "Manage"
2. Find your domain
3. Click "Manage" → "SSL/TLS"
4. Enable FREE SSL (if available)
5. Go to "Redirect" → Set up HTTP → HTTPS

---

## 🚀 Step 6: Start PocketBase (AUTO-INITIALIZATION)

### A. Via SSH:
```bash
cd /home/user/public_html/app/apps/pocketbase

# Make binary executable
chmod +x pocketbase

# Start in background
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &

# Check logs
tail -f pocketbase.log
```

### B. Via Hostinger Cron/Background Job:
1. Go to Hostinger Control Panel → "Advanced" → "Cron Jobs"
2. Add new job:
   ```
   Command: /home/user/public_html/app/apps/pocketbase/pocketbase serve --http=0.0.0.0:8090
   Frequency: Reboot (or Every Minute)
   ```

### C. Via Systemd Service (Best Way):
```bash
# Create service file
sudo nano /etc/systemd/system/pocketbase.service

# Add content:
[Unit]
Description=PocketBase API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/user/public_html/app/apps/pocketbase
ExecStart=/home/user/public_html/app/apps/pocketbase/pocketbase serve --http=0.0.0.0:8090
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
sudo systemctl status pocketbase
```

---

## ✅ Step 7: AUTO-DATABASE INITIALIZATION

**PocketBase does this automatically!**

### What Happens Automatically:

```
First Run:
1. PocketBase starts
2. Looks for pb_data folder
3. If missing → Creates it
4. Initializes SQLite database
5. Runs all migrations in pb_migrations/
6. Collections created from migrations
7. Demo users seeded
8. System ready! ✅
```

### Database Files Created Auto-Automatically:
```
pb_data/
├── data.db              (SQLite database - created automatically)
├── logs/                (Logs directory - created automatically)
├── backups/             (Backups - created automatically)
└── storage/             (File storage - created automatically)
```

**No manual DDL/Schema management needed!**

---

## 🔐 Step 8: Auto-Seeding Demo Users

Migrations automatically create demo users. Check file:
```bash
# File: apps/pocketbase/pb_migrations/1764579159_create_superuser.js

migrate((app) => {
    // Creates demo users automatically
    // Manager: manager@company.com / Manager123!
    // Employees: alice.smith@, bob.johnson@, etc.
});
```

These run **automatically** when PocketBase starts for first time!

---

## 📊 Production Deployment Checklist

- [ ] **Database**: Auto-created on first run ✅
- [ ] **Collections**: Auto-created by migrations ✅
- [ ] **Demo Users**: Auto-seeded by migrations ✅
- [ ] **Frontend**: Built and served by Nginx ✅
- [ ] **SSL**: Enabled via Hostinger ✅
- [ ] **Backup**: Configure Hostinger backups
- [ ] **Monitoring**: Check logs regularly
- [ ] **Fire Wall**: Allow ports 80, 443, (8090 internal only)

---

## 🔍 Verification Steps (After Deployment)

### 1. Check PocketBase is Running:
```bash
# SSH into server
curl http://localhost:8090/api/health

# Should return:
# {"code":200,"message":"OK"}
```

### 2. Check Frontend is Accessible:
```bash
# Open browser
https://yourdomain.com

# Should load React app
# Should show login page
```

### 3. Try Login with Demo Credentials:
```
Email: manager@company.com
Password: Manager123!
```

### 4. Check PocketBase Admin:
```
https://yourdomain.com/_/
# Should show PocketBase admin panel
```

### 5. Verify Collections Exist:
SSH into server and check:
```bash
cd apps/pocketbase
./pocketbase collections list

# Should show:
# - users
# - departments
# - tasks
# - And others...
```

---

## 🐛 Troubleshooting

### PocketBase not starting?
```bash
# Check logs
tail -f /home/user/public_html/app/apps/pocketbase/pocketbase.log

# Check if port 8090 is in use
netstat -tlpn | grep 8090

# Restart service
sudo systemctl restart pocketbase
```

### Can't connect to PocketBase from frontend?
✅ Check: `VITE_POCKETBASE_URL` env variable pointing to correct URL
✅ Check: Nginx proxy config is correct
✅ Check: Port 8090 not accessible from outside (internal proxy only)
✅ Check: CORS not blocking (PocketBase handles CORS automatically)

### Database doesn't have demo users?
✅ Check: Migrations ran (should see in startup logs)
✅ Check: `pb_migrations/` folder uploaded to server
✅ Check: PocketBase admin panel → Users collection

### Login shows "Something went wrong"?
```bash
# Check frontend logs
https://yourdomain.com
# Open DevTools (F12) → Console tab
# Look for network errors
# Check that /api/ endpoints are accessible
```

---

## 📈 Performance Tips

### 1. Enable Compression:
```nginx
gzip on;
gzip_types text/plain text/css application/json;
gzip_min_length 1000;
```

### 2. Add Caching Headers:
```nginx
# For static assets
location ~* \.(js|css|png|jpg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 3. Monitor Resources:
```bash
# Check CPU/Memory usage
top

# Check disk space
df -h

# Check logs for errors
tail -f pocketbase.log
```

---

## 🔄 Update & Maintenance

### Update PocketBase:
```bash
cd apps/pocketbase
./pocketbase update
# Restart
sudo systemctl restart pocketbase
```

### Update Frontend Code:
```bash
cd apps/web
git pull origin main  # Or upload new files
npm install
npm run build
# Nginx serves new files automatically
```

### Backup Database:
```bash
# Hostinger auto-backups, but also
cp -r pb_data pb_data.backup.$(date +%Y%m%d)
```

---

## 📱 Multi-Domain Support (Optional)

If you want dev/staging/production:

```
dev.yourdomain.com     → http://localhost:3001 (local dev)
staging.yourdomain.com → Staging Server
yourdomain.com         → Production (Hostinger)
```

Configure separate Hostinger subdomains pointing to different servers.

---

## 🎯 Summary

### What Auto-Happens on Startup:
```
✅ Database file created (SQLite)
✅ Tables created (from migrations)
✅ Indexes created
✅ Demo users inserted
✅ Admin panel accessible
✅ API ready to use
✅ No manual configuration
```

### Total Setup Time: **30 minutes**
- 10 min: Upload files via Git
- 10 min: Configure Nginx (or use Hostinger defaults)
- 10 min: Start services and verify

---

## 📞 Hostinger Support

- Manage Panel: https://hpanel.hostinger.com
- SSH Terminal: Control Panel → Advanced → SSH Terminal
- File Manager: Control Panel → File Manager
- Support: https://support.hostinger.com

---

## ✨ Final Notes

**The beautiful part:**
- You don't manage the database schema manually
- All migrations run automatically
- Demo data seeds automatically
- Everything is version-controlled (in git)
- Deploying is just: push code → migrations run → done!

**This is Production-Grade Deployment!** 🚀

---

**Status**: ✅ **Ready for Hostinger Deployment**

Just follow steps 1-8 and your system will:
- Initialize itself
- Create database automatically
- Seed demo data automatically
- Be ready to use!

No manual database setup required! 🎉
