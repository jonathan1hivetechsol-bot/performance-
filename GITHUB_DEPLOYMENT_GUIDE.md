# 🚀 GITHUB DEPLOYMENT - Complete Guide

> **Deploy to:** `magenta-eel-966113.hostingersite.com`
> 
> **GitHub Repo:** `https://github.com/jonathan1hivetechsol-bot/performance-.git`

---

## 📋 کیا کریں گے؟

```
Step 1: Local Computer - Git Setup
         ↓
Step 2: Update .env files for new domain
         ↓
Step 3: Push code to GitHub
         ↓
Step 4: SSH to Hostinger Server
         ↓
Step 5: Clone/Pull code from GitHub
         ↓
Step 6: Setup .env on Server
         ↓
Step 7: Run Deploy & Test
         ↓
✅ LIVE on new domain!
```

---

# STEP 1️⃣: Authenticate to GitHub (Local Computer)

## 1A: Check if Git is Installed

```bash
git --version
```

**Expected output:**
```
git version 2.46.0 or similar
```

## 1B: Configure Git with Your Credentials

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "Futur"
git config --global user.email "futur@example.com"
```

## 1C: Setup SSH Key for GitHub (RECOMMENDED - Easiest)

### Option A: Generate SSH Key (Windows PowerShell)

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

**When asked:**
```
Enter file in which to save key: Press ENTER (default location)
Enter passphrase: Press ENTER (no passphrase - easier)
```

**Output:**
```
Your public key has been saved in C:\Users\Futur\.ssh\id_ed25519.pub
```

### Option B: Add SSH Key to GitHub

1. **Copy your public key:**
```bash
type $HOME\.ssh\id_ed25519.pub | clip
# (Copies to clipboard)
```

2. **Add to GitHub:**
   - Go to: `https://github.com/settings/keys`
   - Click "New SSH key"
   - Paste the key
   - Click "Add SSH key"

3. **Test SSH connection:**
```bash
ssh -T git@github.com
# Expected: Hi jonathan1hivetechsol-bot! You've successfully authenticated
```

---

# STEP 2️⃣: Setup Local Git Repository

## Go to Your Project Folder

```bash
cd "c:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0"
```

## Initialize Git (If Not Already Done)

```bash
git init
```

## Add Your GitHub Repository as Remote

```bash
git remote add origin https://github.com/jonathan1hivetechsol-bot/performance-.git
```

**Verify it's added:**
```bash
git remote -v
# Should show your GitHub repo URL
```

---

# STEP 3️⃣: Update .env Files for New Domain

## 3A: Update Frontend .env

**File:** `apps/web/.env.production`

```env
VITE_POCKETBASE_URL=https://magenta-eel-966113.hostingersite.com/api
```

## 3B: Create Backend .env (Will be created on server)

This will be created on the server in Step 6.

---

# STEP 4️⃣: Commit and Push to GitHub

## Step 4A: Check Git Status

```bash
git status
```

**Expected output:**
```
On branch main

Changes not staged for commit:
  modified:   apps/web/.env.production
  modified:   package.json
  ...
```

## Step 4B: Add All Files to Staging

```bash
git add .
```

## Step 4C: Commit Your Changes

```bash
git commit -m "Deploy to magenta-eel-966113.hostingersite.com"
```

## Step 4D: Push to GitHub

```bash
git push origin main
```

**Expected output:**
```
Enumerating objects: 25, done.
Counting objects: 100% (25/25), done.
...
To github.com:jonathan1hivetechsol-bot/performance-.git
   abc123..def456  main -> main
```

✅ **Your code is now on GitHub!**

---

# STEP 5️⃣: SSH to Hostinger Server

## Open Terminal/PowerShell and Connect

```bash
ssh user@magenta-eel-966113.hostingersite.com
```

**Or use your Hostinger SSH details:**
```bash
ssh u908555458@us-imm-web1447.us.imm-imm-web.vps.webhost4life.com
```

**Enter your password when prompted**

## Verify You're on Server

```bash
ls -la
# Should show typical server directories
```

---

# STEP 6️⃣: Clone or Update Code from GitHub

## Option A: First Time - Clone Repository

```bash
cd public_html

# Clone the repo
git clone https://github.com/jonathan1hivetechsol-bot/performance-.git app

cd app

# Verify
ls -la
# Should show: apps/, package.json, etc.
```

## Option B: Already Exists - Pull Updates

```bash
cd public_html/app

git pull origin main

# Latest code is now updated!
```

---

# STEP 7️⃣: Setup Environment on Server

## Create Backend .env File

```bash
# Still in public_html/app directory

cat > apps/pocketbase/.env << 'EOF'
PB_ENCRYPTION_KEY=your-32-char-random-key-here
PB_ADMIN_EMAIL=admin@magenta-eel-966113.hostingersite.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=magenta-eel-966113.hostingersite.com,*.magenta-eel-966113.hostingersite.com
EOF

# Verify
cat apps/pocketbase/.env
```

---

# STEP 8️⃣: Build Frontend on Server (If npm available)

```bash
cd public_html/app

# Try to build
npm run build 2>&1

# Check if succeeded
ls -la dist/
```

**If npm not found:** Use local build method (build on laptop, upload to server)

---

# STEP 9️⃣: Delete Old Frontend Files & Upload New Ones

## If Local Build:

### On Laptop:
```bash
npm run build --prefix apps/web
# Creates dist/ folder
```

### On Server:
```bash
cd public_html

# Delete old files (but keep pocketbase!)
rm index.html
rm -rf assets/
rm -rf .vite/

# Upload new files from dist/ using Hostinger File Manager
# - Upload index.html
# - Upload assets/ folder
# - Upload .htaccess
```

---

# STEP 🔟: Run Deploy Script

## On Hostinger Server

```bash
cd public_html/app

# Run deploy
bash deploy.sh

# Wait 5-10 minutes for everything to setup
```

**What happens:**
```
✓ Dependencies install
✓ Frontend builds
✓ PocketBase starts
✓ Database auto-creates
✓ Collections auto-create
✓ Demo users added
✓ System READY!
```

---

# STEP 1️⃣1️⃣: Verify Deployment

## Check PocketBase Health

```bash
curl http://127.0.0.1:8090/api/health

# Expected:
# {"code":200,"message":"OK"}
```

## Test in Browser

```
Open: https://magenta-eel-966113.hostingersite.com/
```

**You should see:**
- ✅ Login page loads
- ✅ Email field visible
- ✅ Password field visible

## Login Test

```
Email: manager@company.com
Password: Manager123!
```

**Expected:**
- ✅ Dashboard loads
- ✅ 3 features visible (Employees, Departments, Tasks)

---

# 📝 QUICK COMMANDS REFERENCE

## Local (Laptop)

```bash
# Go to project folder
cd "c:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0"

# Check status
git status

# Build frontend
npm run build --prefix apps/web

# Add files
git add .

# Commit
git commit -m "message"

# Push to GitHub
git push origin main
```

## Server (Hostinger SSH)

```bash
# Connect
ssh user@magenta-eel-966113.hostingersite.com

# Clone first time
git clone https://github.com/jonathan1hivetechsol-bot/performance-.git app

# Update code (later)
cd app && git pull origin main

# Setup backend .env
cat > apps/pocketbase/.env << 'EOF'
...
EOF

# Deploy
bash deploy.sh

# Check status
curl http://127.0.0.1:8090/api/health
```

---

# 🆘 Troubleshooting

## ❌ "Permission denied (publickey)"

**Problem:** SSH key not set up properly

**Solution:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy to clipboard
type $HOME\.ssh\id_ed25519.pub | clip

# Add to GitHub: https://github.com/settings/keys
```

## ❌ "fatal: not a git repository"

**Problem:** Not in the right folder

**Solution:**
```bash
cd "c:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0"
git init
```

## ❌ "git: command not found on server"

**Problem:** Git not installed on Hostinger

**Solution:**
```bash
# SSH to server and install
apt-get update
apt-get install git

# Or contact Hostinger support
```

## ❌ "Cannot reach API"

**Problem:** PocketBase not running

**Solution:**
```bash
# Check if running
ps aux | grep pocketbase

# On server, restart it
cd apps/pocketbase
./pocketbase serve --http=0.0.0.0:8090 &
```

## ❌ "git clone: Permission denied"

**Problem:** SSH key not working for GitHub

**Solution:**
```bash
# Test connection
ssh -T git@github.com

# Add SSH key to GitHub:
# https://github.com/settings/keys
```

---

# ✅ CHECKLIST

- [ ] Git installed on laptop
- [ ] SSH key generated and added to GitHub
- [ ] Git configured (user.name, user.email)
- [ ] Project folder initialized with git
- [ ] GitHub remote added
- [ ] .env.production updated for new domain
- [ ] Files committed and pushed to GitHub
- [ ] SSH connection to Hostinger works
- [ ] Code cloned/pulled to Hostinger
- [ ] .env file created on server
- [ ] Frontend built (locally or on server)
- [ ] Old frontend files deleted on server
- [ ] New frontend files uploaded
- [ ] deploy.sh executed
- [ ] PocketBase health check passed
- [ ] Browser test successful
- [ ] Login works
- [ ] Features tested
- [ ] ✅ LIVE!

---

# 🎯 TIMELINE

| Step | Time | کیا ہوتا ہے |
|------|------|-----------|
| 1-4 | 5 min | Local git setup + code to GitHub |
| 5 | 2 min | SSH to server |
| 6 | 2 min | Clone code |
| 7 | 2 min | Create .env |
| 8-9 | 10 min | Build + upload frontend |
| 10 | 10 min | Deploy script runs |
| 11 | 3 min | Verify + test |
| **Total** | **~45 min** | **✅ LIVE!** |

---

# 🚀 START NOW!

**Ready? Follow these steps in order:**

1. ✅ Local: `git config --global user.name "Name"`
2. ✅ Local: Generate SSH key
3. ✅ Add SSH key to GitHub
4. ✅ Local: `git push origin main`
5. ✅ Server: `git clone https://github.com/jonathan1hivetechsol-bot/performance-.git app`
6. ✅ Server: Create .env file
7. ✅ Server: `bash deploy.sh`
8. ✅ Browser: Open https://magenta-eel-966113.hostingersite.com/
9. ✅ Login & Test

**Chalo shuru karo!** 🎯
