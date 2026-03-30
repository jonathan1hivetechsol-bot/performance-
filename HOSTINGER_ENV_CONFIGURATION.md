# 🌍 Hostinger Environment Configuration Guide

> **"iska esa sytem krdo main depky lro hostinger pr ye kuhd ba khud apna databse set krly"**
> 
> Set it up so when I deploy on Hostinger it automatically sets up its own database!

---

## 📋 Quick Summary

When you deploy to Hostinger, you need **3 environment files**:

```
1. apps/web/.env.production       ← Frontend (React)
2. apps/pocketbase/.env           ← Backend (PocketBase)
3. .env (root)                    ← Global settings
```

Everything else is **created automatically** ✅

---

## 🔧 File 1: Frontend Environment (.env.production)

**Location**: `apps/web/.env.production`

```env
# 🌐 PocketBase URL - Point to your Hostinger domain
VITE_POCKETBASE_URL=https://yourdomain.com

# Alternative formats (pick ONE):
# If using subdomain: https://api.yourdomain.com
# If using path: https://yourdomain.com/api
# If using IP: https://123.45.67.89

# Build mode
VITE_BUILD_MODE=production

# API timeout (in milliseconds)
VITE_API_TIMEOUT=30000
```

### Replace These Values:
- `yourdomain.com` → Your actual Hostinger domain
- Keep `https://` (not `http://`) for security

### Example - Real Domain:
```env
VITE_POCKETBASE_URL=https://schoolmanager.com
```

### Example - Hostinger Subdomain:
```env
VITE_POCKETBASE_URL=https://myapp.hostinger.com
```

---

## 🔐 File 2: Backend Environment (.env)

**Location**: `apps/pocketbase/.env`

```env
# 🔑 Encryption Key - CHANGE THIS!
# Generate: openssl rand -base64 32
# This is CRITICAL for data security
PB_ENCRYPTION_KEY=your-random-32-char-string-from-openssl-rand-base64-32

# 👤 Admin Email
PB_ADMIN_EMAIL=admin@yourdomain.com

# 🔐 Admin Initial Password (change after first login!)
PB_ADMIN_PASSWORD=InitialPassword123!ChangeMe

# 📊 Server Configuration
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=yourdomain.com,*.yourdomain.com

# 📧 Email Configuration (optional, for notifications)
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=your-email@yourdomain.com
PB_SMTP_PASSWORD=your-email-password
PB_SMTP_FROM=noreply@yourdomain.com

# 🗄️ Database (auto-created, don't change)
PB_DATA_DIR=pb_data
```

### How to Generate Encryption Key:

**On Linux/Mac:**
```bash
openssl rand -base64 32
# Output: AbCdEfGhIjKlMnOpQrStUvWxYz+123456789=
```

**On Windows (use a random string):**
```
Generate 32 random characters (letters, numbers, +/=)
Example: Abcd1234Efgh5678Ijkl9012Mnop3456+789=
```

**Or use this online tool:**
Visit https://www.random.org and generate 32 characters

### Example - Complete Configuration:
```env
PB_ENCRYPTION_KEY=qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=SecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=admin@schoolmanager.com
PB_SMTP_PASSWORD=your-email-password
PB_SMTP_FROM=noreply@schoolmanager.com
PB_DATA_DIR=pb_data
```

**⚠️ SECURITY**: Never commit `.env` files to Git! Add to `.gitignore`:
```
.env
.env.local
.env.*.local
pb_data/
node_modules/
dist/
```

---

## 🌍 File 3: Root Environment (.env at project root)

**Location**: `.env` (root directory)

```env
# 🌐 Environment Mode
NODE_ENV=production

# 🖥️ Hostinger Server Details
HOSTINGER_DOMAIN=yourdomain.com
HOSTINGER_PORT=8090

# 🔗 URLs
API_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# 🔐 Security
ENABLE_HTTPS=true
```

---

## 📝 Complete Setup Checklist

### A. Register Domain on Hostinger
- [ ] Buy domain (or use Hostinger free domain)
- [ ] Point DNS to Hostinger servers
- [ ] Enable SSL certificates (free with Hostinger)

### B. Prepare Local Files
- [ ] Create `apps/web/.env.production`
- [ ] Create `apps/pocketbase/.env`
- [ ] Create `.env` at root
- [ ] Add `.env*` to `.gitignore`
- [ ] Test locally: `npm run dev`

### C. Generate Secrets
- [ ] Generate PB_ENCRYPTION_KEY using openssl
- [ ] Choose PB_ADMIN_PASSWORD (strong password)
- [ ] Note these values (save in secure location)

### D. Deploy to Hostinger
- [ ] Push code to Git
- [ ] SSH into Hostinger
- [ ] Clone/upload code
- [ ] Add `.env` files
- [ ] Run `npm install` in both folders
- [ ] Run `npm run build` in web folder
- [ ] Start PocketBase
- [ ] Verify everything works

---

## 🚀 Step-by-Step Local Testing

### 1. Create Local .env Files First:

**File: apps/web/.env.local**
```env
VITE_POCKETBASE_URL=http://localhost:8090
```

**File: apps/pocketbase/.env**
```env
PB_ENCRYPTION_KEY=test-key-do-not-use-in-production
PB_ADMIN_EMAIL=admin@localhost
PB_ADMIN_PASSWORD=Admin123!
```

### 2. Test Locally:
```bash
# Terminal 1: Start PocketBase
cd apps/pocketbase
npm install
./pocketbase serve --http=0.0.0.0:8090

# Terminal 2: Start React
cd apps/web
npm install
npm run dev

# Open browser: http://localhost:3001
# Try login: manager@company.com / Manager123!
```

### 3. Verify Both Servers Respond:
```bash
# Test PocketBase
curl http://localhost:8090/api/health
# Should return: {"code":200,"message":"OK"}

# Test React (in browser)
http://localhost:3001
# Should load login page
```

---

## 🌐 Deploy to Hostinger

### 1. SSH to Hostinger:
```bash
ssh user@yourdomain.com
# Login with your Hostinger SSH password
```

### 2. Create Project Directory:
```bash
cd public_html
mkdir app
cd app
```

### 3. Upload Code (Choose ONE method):

**Method A: Git (Easiest)**
```bash
git clone https://github.com/your-username/your-repo.git .
git pull origin main
```

**Method B: SCP (Secure Copy)**
```bash
# From your LOCAL machine:
scp -r apps user@yourdomain.com:~/public_html/app/
scp package.json user@yourdomain.com:~/public_html/app/
```

**Method C: Hostinger File Manager**
- Go to Hostinger Control Panel
- File Manager → public_html
- Upload `apps/` folder
- Upload `package.json`

### 4. Create .env Files on Server:
```bash
# Connect via SSH
ssh user@yourdomain.com

# Create PocketBase .env
nano apps/pocketbase/.env

# Paste:
PB_ENCRYPTION_KEY=your-generated-key-here
PB_ADMIN_EMAIL=admin@yourdomain.com
PB_ADMIN_PASSWORD=SecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=yourdomain.com,*.yourdomain.com
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=your-email@yourdomain.com
PB_SMTP_PASSWORD=your-email-password
PB_SMTP_FROM=noreply@yourdomain.com

# Press Ctrl+X, then Y, then Enter to save
```

### 5. Install Dependencies:
```bash
cd apps/pocketbase
npm install

cd ../web
npm install
npm run build
# This creates dist/ folder
```

### 6. Start PocketBase:
```bash
cd ~/public_html/app/apps/pocketbase

# Make executable
chmod +x pocketbase

# Start in background
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &

# Check status
ps aux | grep pocketbase
```

### 7. Configure Nginx (Already Done by Hostinger!)
Hostinger auto-configures Nginx. Just ensure:
- [ ] Domain points to Hostinger nameservers
- [ ] SSL enabled in Hostinger panel
- [ ] Port 8090 not blocked (internal proxy only)

---

## ✅ Verify Deployment

### Check PocketBase is Running:
```bash
# SSH to server
curl http://localhost:8090/api/health

# Should return:
# {"code":200,"message":"OK"}
```

### Check Frontend is Accessible:
```
Open browser: https://yourdomain.com
Should load React login page ✅
```

### Try Login:
```
Email: manager@company.com
Password: Manager123!
```

### Check PocketBase Admin:
```
https://yourdomain.com/_/
Login with admin credentials
Should show all collections ✅
```

---

## 🔄 Update Environment Variables Later

### Change PocketBase Encryption Key:
```bash
# SSH to server
nano apps/pocketbase/.env
# Edit PB_ENCRYPTION_KEY
# Save (Ctrl+X → Y → Enter)

# Restart PocketBase
pkill pocketbase
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &
```

### Change Frontend URL:
```bash
# Update apps/web/.env.production
nano apps/web/.env.production

# Rebuild
cd apps/web
npm run build

# Nginx automatically serves new files
```

---

## 🆘 Troubleshooting

### "Port 8090 already in use"
```bash
# Kill existing PocketBase
pkill pocketbase
ps aux | grep pocketbase  # Should be empty
```

### "PocketBase won't start"
```bash
# Check permissions
chmod +x /home/user/public_html/app/apps/pocketbase/pocketbase

# Check logs
tail -f /home/user/public_html/app/apps/pocketbase/pocketbase.log
```

### "Can't connect from frontend"
```bash
# Check VITE_POCKETBASE_URL is correct
cat apps/web/.env.production

# Should show your actual domain
# Not localhost!

# Rebuild frontend
npm run build
```

### "Collections missing"
```bash
# Check PocketBase admin
https://yourdomain.com/_/

# Collections should exist:
# - users
# - departments
# - tasks
# - etc.
```

---

## 📊 Example: Complete Hostinger Setup

### Domain: `schoolmanager.com`

**apps/web/.env.production:**
```env
VITE_POCKETBASE_URL=https://schoolmanager.com
```

**apps/pocketbase/.env:**
```env
PB_ENCRYPTION_KEY=qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=SchoolAdmin123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=admin@schoolmanager.com
PB_SMTP_PASSWORD=your-email-password
```

### Result:
- Frontend: https://schoolmanager.com → React Dashboard
- Backend: https://schoolmanager.com/api → PocketBase API
- Admin: https://schoolmanager.com/_ → PocketBase Admin

---

## 🎯 Summary

| File | Location | Purpose | Changes? |
|------|----------|---------|----------|
| `.env.production` | `apps/web/` | Frontend config | ✅ Change domain |
| `.env` | `apps/pocketbase/` | Backend config | ✅ Change secrets |
| `.env` | Root | Global config | ✅ Change domain |

**Everything else is auto-generated!** ✅

---

## 📌 Final Checklist - Just Before Deployment

- [ ] Updated `.env.production` with real Hostinger domain
- [ ] Generated PB_ENCRYPTION_KEY (32 random chars)
- [ ] Set PB_ADMIN_PASSWORD (strong password)
- [ ] Updated PB_SERVER_ORIGINS with your domain
- [ ] Updated SMTP settings if using email
- [ ] Added `.env*` to `.gitignore`
- [ ] Tested locally with `npm run dev`
- [ ] Built frontend with `npm run build`
- [ ] Created `.env` files on Hostinger server
- [ ] Started PocketBase on server
- [ ] Verified collections auto-created
- [ ] Tested login on https://yourdomain.com

---

**Status**: ✅ **Ready to Deploy!**

Just set these 3 environment files and everything else happens automatically! 🚀
