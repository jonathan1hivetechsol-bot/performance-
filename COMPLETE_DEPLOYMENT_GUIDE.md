# 🚀 COMPLETE DEPLOYMENT GUIDE - From Local to Hostinger

> **"iska esa sytem krdo main depky lro hostinger pr ye kuhd ba khud apna databse set krly"**
> 
> Complete system ready for Hostinger deployment with automatic database setup!

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Local Development Setup (30 minutes)](#local-development)
3. [Hostinger Pre-Deployment Checklist](#pre-deployment)
4. [Hostinger Deployment Steps](#deployment)
5. [Post-Deployment Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start (5 minutes)

### For Local Development:
```bash
# Terminal 1: Start PocketBase
cd apps/pocketbase
./pocketbase serve --http=0.0.0.0:8090

# Terminal 2: Start React
cd apps/web
npm run dev

# Open browser: http://localhost:3001
# Login: manager@company.com / Manager123!
```

### For Hostinger:
```bash
# SSH to server
ssh user@yourdomain.com

# Navigate to app directory
cd public_html/app

# Run deployment script
bash deploy.sh

# Done! ✅ Everything auto-configures
```

---

## 🏠 Local Development Setup (30 minutes)

### Prerequisites
- ✅ Node.js 20.19+ or 22.12+ → [Download](https://nodejs.org)
- ✅ npm 10+ (comes with Node)
- ✅ Git (optional, for cloning)
- ✅ ~500MB disk space

### Step 1: Verify Environment Files Exist

Check that these files are in the repository:

```bash
# From project root
ls -la .env.local                # Frontend development config
ls -la apps/pocketbase/.env      # Backend development config
```

**If missing, create them:**

**File: `.env.local`**
```env
VITE_POCKETBASE_URL=http://localhost:8090
```

**File: `apps/pocketbase/.env`**
```env
PB_ENCRYPTION_KEY=test-key-local-development
PB_ADMIN_EMAIL=admin@localhost
PB_ADMIN_PASSWORD=Admin123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
```

### Step 2: Start PocketBase

```bash
# Open Terminal 1
cd apps/pocketbase

# Check if binary exists
ls pocketbase
# Should show file (33MB)

# Make executable (if needed)
chmod +x pocketbase

# Start server
./pocketbase serve --http=0.0.0.0:8090

# Expected output:
# 🔧 Starting PocketBase...
# ✅ Server listening on http://0.0.0.0:8090
# 📌 Admin panel at http://localhost:8090/_/

# Don't close this terminal! Keep it running.
```

**Troubleshooting PocketBase:**
```bash
# If "permission denied"
chmod +x pocketbase
./pocketbase serve --http=0.0.0.0:8090

# If "port in use"
lsof -i :8090
kill -9 <PID>
./pocketbase serve --http=0.0.0.0:8090
```

### Step 3: Start React Frontend

```bash
# Open Terminal 2 (while Terminal 1 keeps PocketBase running)
cd apps/web

# Install dependencies (first time)
npm install

# Start development server
npm run dev

# Expected output:
# ✅ Vite v7.3.1 ready in 1000 ms
# 📱 Local: http://localhost:3001/
# 🌐 Network: http://192.168.0.x:3001/

# Don't close this terminal! Keep it running.
```

**Troubleshooting React:**
```bash
# If "port in use"
# Vite will auto-shift to 3001, that's normal!

# If dependencies error
rm -rf node_modules
npm install
npm run dev
```

### Step 4: Verify Everything Works

```bash
# Terminal 3 (fresh terminal for tests)

# Test 1: PocketBase Health
curl http://localhost:8090/api/health
# Should return: {"code":200,"message":"OK"}

# Test 2: React Running
curl http://localhost:3001
# Should return HTML (React page)
```

### Step 5: Test Login

1. Open browser: `http://localhost:3001`
2. You should see **Login Page**
3. Enter:
   - **Email**: manager@company.com
   - **Password**: Manager123!
4. Click **Login**
5. You should see **Dashboard** ✅

### Step 6: Test Features

In dashboard, you should see:
- ✅ **Add Employees** link (Users icon)
- ✅ **Departments** link (Building icon)
- ✅ **Assign Tasks** link (CheckSquare icon)

Click each one to verify:
- ✅ Add employee → Creates employee
- ✅ Create department → Creates department with custom fields
- ✅ Assign task → Creates task with priority

**Success!** 🎉 Local development is working!

---

## 📋 Hostinger Pre-Deployment Checklist

### A. Domain & Hosting Setup
- [ ] Domain registered
- [ ] Hostinger account active
- [ ] SSH access enabled
- [ ] Free SSL enabled (in Hostinger control panel)
- [ ] Node.js installed on server (check with `node -v`)
- [ ] npm installed on server (check with `npm --version`)

### B. Code Ready
- [ ] All features tested locally ✅
- [ ] No sensitive info in code (check .gitignore)
- [ ] `.env.local` NOT committed to Git ✅
- [ ] `pb_data/` NOT committed ✅
- [ ] `node_modules/` NOT committed ✅

### C. Environment Files Prepared
- [ ] `apps/web/.env.production` created with correct domain
- [ ] `apps/pocketbase/.env` created with production secrets
- [ ] Generated secure PB_ENCRYPTION_KEY
- [ ] Set strong PB_ADMIN_PASSWORD
- [ ] SMTP settings configured (if using email)

### D. Backup Current Data (If Upgrading)
```bash
# If you have existing data, backup:
cp -r apps/pocketbase/pb_data apps/pocketbase/pb_data.backup
```

---

## 🚀 Hostinger Deployment Steps

### Step 1: Prepare Environment Files

**Create: `apps/web/.env.production`**
```env
VITE_POCKETBASE_URL=https://yourdomain.com
# Replace yourdomain.com with your actual domain
```

**Create: `apps/pocketbase/.env`**
```env
# Generate this with: openssl rand -base64 32
PB_ENCRYPTION_KEY=your-32-char-random-string-here

PB_ADMIN_EMAIL=admin@yourdomain.com
PB_ADMIN_PASSWORD=VerySecurePassword123!

PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=yourdomain.com,*.yourdomain.com

# If using email notifications:
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=your-email@yourdomain.com
PB_SMTP_PASSWORD=your-email-password
```

### Step 2: Push Code to Git (or Upload Manually)

**Option A: Using Git (Recommended)**
```bash
# Add to .gitignore locally
echo ".env*" >> .gitignore
echo "pb_data/" >> .gitignore
echo "node_modules/" >> .gitignore

# Commit and push
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

**Option B: Using Hostinger File Manager**
- Go to Hostinger Control Panel → File Manager
- Upload `apps/` folder
- Upload `package.json`
- Upload `deploy.sh`

### Step 3: SSH Into Hostinger Server

```bash
# From your local machine
ssh user@yourdomain.com
# Enter your Hostinger SSH password

# You should now be connected!
```

### Step 4: Navigate to Application Directory

```bash
# SSH into Hostinger
ssh user@yourdomain.com

# Create app directory if not exists
mkdir -p public_html/app
cd public_html/app

# If using Git (clone repository)
git clone https://github.com/your-username/your-repo.git .
git pull origin main

# If using upload, files should already be here
ls -la
# Should show: apps/, package.json, deploy.sh, etc.
```

### Step 5: Create Environment Files on Server

```bash
# Create .env files with production settings

# Backend environment
cat > apps/pocketbase/.env << 'EOF'
PB_ENCRYPTION_KEY=your-32-char-key-from-openssl
PB_ADMIN_EMAIL=admin@yourdomain.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=yourdomain.com,*.yourdomain.com
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=your-email@yourdomain.com
PB_SMTP_PASSWORD=your-email-password
EOF

# Verify it was created
cat apps/pocketbase/.env
```

### Step 6: Run Deployment Script

```bash
# From public_html/app directory
bash deploy.sh

# This will:
# 1. Install dependencies
# 2. Build frontend (creates dist/)
# 3. Start PocketBase
# 4. Initialize database (migrations run automatically)
# 5. Seed demo users
# 6. Show status

# Wait for script to complete (5-10 minutes)
```

### Step 7: Verify Deployment

```bash
# Check PocketBase is running
curl http://localhost:8090/api/health

# Should return:
# {"code":200,"message":"OK"}

# View log if needed
tail -f apps/pocketbase/pocketbase.log
```

---

## ✅ Post-Deployment Verification

### A. Frontend Access
```
Open: https://yourdomain.com
Expected: Login page loads ✅
```

### B. Test Login
```
Email: manager@company.com
Password: Manager123!
Expected: Dashboard loads ✅
```

### C. Test Features
1. Click "Add Employees" → Add test employee
2. Click "Departments" → Add test department
3. Click "Assign Tasks" → Add test task
Expected: All work ✅

### D. Check PocketBase Admin
```
Open: https://yourdomain.com/_/
Login with admin credentials
Check collections exist:
- users ✅
- departments ✅
- tasks ✅
```

### E. Verify Database Initialized
```bash
# SSH to server
curl http://localhost:8090/api/collections

# Should show all collections
# Should include: users, departments, tasks
```

---

## 📊 File Structure for Hostinger

After deployment, your server should have:

```
/home/yourusername/public_html/
├── app/
│   ├── apps/
│   │   ├── pocketbase/
│   │   │   ├── pocketbase (binary)
│   │   │   ├── .env (production settings)
│   │   │   ├── pb_data/
│   │   │   │   ├── data.db (auto-created)
│   │   │   │   └── storage/
│   │   │   ├── pb_migrations/
│   │   │   └── package.json
│   │   └── web/
│   │       ├── dist/ (built frontend)
│   │       └── src/ (source code)
│   ├── .env (global)
│   ├── package.json
│   └── deploy.sh
└── (other domain files)
```

---

## 🔄 Updates & Maintenance

### Update Code
```bash
# SSH to Hostinger
cd public_html/app

# Pull latest code
git pull origin main

# Rebuild frontend
cd apps/web
npm install
npm run build
cd ../..

# Restart services
pkill pocketbase
cd apps/pocketbase
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &
```

### Update PocketBase
```bash
# SSH to server
cd public_html/app/apps/pocketbase

# Stop current instance
pkill pocketbase

# Update
./pocketbase update

# Start again
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &
```

### Backup Database
```bash
# SSH to server
cd public_html/app
cp -r apps/pocketbase/pb_data backups/pb_data.backup-$(date +%Y%m%d)
```

---

## 🚨 Troubleshooting

### Issue: "Cannot find deploy.sh or command not found"
```bash
cd public_html/app
ls -la deploy.sh
chmod +x deploy.sh
bash deploy.sh
```

### Issue: "npm: command not found"
```bash
# Check Node/npm installed
node --version
npm --version

# If not installed, ask Hostinger to install Node.js
# Or use nvm:
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Issue: "PocketBase won't start"
```bash
# Check logs
cd apps/pocketbase
tail -f pocketbase.log

# Check port
lsof -i :8090

# Make binary executable
chmod +x pocketbase

# Try starting manually
./pocketbase serve --http=0.0.0.0:8090
```

### Issue: "Collections don't exist"
```bash
# Check if migrations ran
cd apps/pocketbase
ls pb_migrations/

# Should see migration files

# Check PocketBase admin
# https://yourdomain.com/_/
# Should show collections

# If missing, restart PocketBase:
pkill pocketbase
./pocketbase serve --http=0.0.0.0:8090
```

### Issue: "Can't connect to frontend/backend"
```bash
# Check VITE_POCKETBASE_URL is correct
cat apps/web/.env.production
# Should show: https://yourdomain.com

# Not: http://localhost:8090 (that's for local dev!)

# Rebuild frontend
cd apps/web
npm run build

# Restart services
pkill pocketbase
```

---

## 📞 Quick Reference

### Check Status
```bash
# PocketBase running?
curl http://localhost:8090/api/health

# What processes running?
ps aux | grep pocketbase
ps aux | grep node
```

### View Logs
```bash
# PocketBase logs
tail -f apps/pocketbase/pocketbase.log

# Recent entries
tail -20 apps/pocketbase/pocketbase.log
```

### Restart Services
```bash
# Stop
pkill pocketbase
pkill node

# Start
cd apps/pocketbase
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &
```

### Database Location
```bash
# Main database file
~/public_html/app/apps/pocketbase/pb_data/data.db

# Collections are in SQLite:
# - users
# - departments
# - tasks
```

---

## 🎯 Summary

### What Auto-Happens:
```
1. PocketBase starts → Creates database
2. Migrations run → Creates collections
3. Demo users seed → System ready to use
4. No manual setup needed! ✅
```

### Timeline:
- **Local setup**: 30 minutes
- **Hostinger deployment**: 15 minutes
- **Total**: ~45 minutes from start to production

### What You Get:
✅ Complete production-ready system
✅ Auto-initializing database
✅ SSL secured (https://yourdomain.com)
✅ 3 working manager features
✅ Demo users ready to test

---

**Status**: ✅ **Complete deployment guide ready!**

Follow the steps and your system will be live on Hostinger with automatic database setup! 🚀
