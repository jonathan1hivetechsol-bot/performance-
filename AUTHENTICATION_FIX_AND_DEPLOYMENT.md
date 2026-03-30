# Authentication Fix & Hostinger Deployment Guide

## ✅ What Was Fixed

### 1. **Hardcoded API URL Issue**
**Problem**: The PocketBase URL was hardcoded to `/hcgi/platform` - this only works on Horizons platform, not on Hostinger.

**Solution**: Updated `src/lib/pocketbaseClient.js` to use environment variables:
```javascript
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || '/api';
```

### 2. **Environment Configuration**
Created `.env` files for different environments:
- `.env.local` - Development (localhost:8090)
- `.env.production` - Hostinger production
- `.env.example` - Template for reference

---

## 🚀 Quick Setup Guide

### **Step 1: Local Development**

#### A. Start PocketBase Backend
```bash
cd apps/pocketbase
npm run dev
# or
./pocketbase serve --http=0.0.0.0:8090
```
This starts PocketBase on **http://localhost:8090**

#### B. Configure Frontend
In `apps/web/.env.local`:
```
VITE_POCKETBASE_URL=http://localhost:8090
```

#### C. Start React Frontend
```bash
cd apps/web
npm install
npm run dev
```
App runs on **http://localhost:5173**

#### D. Login with Demo Credentials
```
Email: manager@company.com
Password: Manager123!

OR

Email: alice.smith@company.com
Password: Employee123!
```

---

## 🔄 Database Reset Instructions

### Complete Database Reset (Fresh Start)
If you want to clear all data and start fresh:

#### **Option 1: Delete PocketBase Database** ⚡ Fastest
```bash
cd apps/pocketbase
# Stop the server (Ctrl+C)

# Delete the database
rm -rf pb_data  # On Windows: rmdir /s pb_data

# Start server again - migrations run automatically
npm run dev
```

#### **Option 2: Run Migrations**
```bash
cd apps/pocketbase
./pocketbase horizons migrations:up --encryptionEnv=PB_ENCRYPTION_KEY --dir=/data
```

#### **Option 3: Revert & Re-apply Migrations**
```bash
cd apps/pocketbase
./pocketbase horizons migrations:revert
./pocketbase horizons migrations:up
```

---

## 🌍 Hostinger Deployment

### **Setup Steps for Hostinger**

#### **1. Prepare Your Hostinger Account**
- Go to your Hostinger Control Panel
- Create a subdomain or use main domain for API: `api.yourdomain.com` or `yourdomain.com`
- Create another domain/subdomain for frontend: `yourdomain.com` or `app.yourdomain.com`

#### **2. Deploy PocketBase on Hostinger**

**A. Via SSH (Recommended)**
```bash
# SSH into your Hostinger server
ssh user@your-domain.com

# Create app directory
mkdir -p ~/pocketbase-app
cd ~/pocketbase-app

# Upload PocketBase binary and code (via SCP or git)
# Option A: Using Git
git clone https://your-repo.git .

# Option B: Using SCP
scp -r apps/pocketbase/* user@your-domain.com:~/pocketbase-app/

# Make PocketBase executable
chmod +x pocketbase

# Create data directory
mkdir -p pb_data

# Start PocketBase (use nohup to keep running)
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &

# Verify it's running
curl http://localhost:8090/api/health
```

**B. Via Hostinger Control Panel (Manual)**
1. Upload PocketBase binary via File Manager
2. Set executable permission
3. Create startup script and use Cron/Background Job
4. Set port: 8090 (or available port)

#### **3. Configure Nginx Reverse Proxy** (Hostinger usually provides this)
```nginx
# In your Hostinger control panel, create a proxy rule:
# Incoming: https://api.yourdomain.com
# Forward to: http://localhost:8090
```

OR manually in `/etc/nginx/sites-available/default`:
```nginx
server {
    server_name api.yourdomain.com;
    listen 80;

    location / {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### **4. Build & Deploy React Frontend**

**A. On Hostinger via SSH**
```bash
cd apps/web

# Create .env.production with Hostinger URL
cat > .env.production << EOF
VITE_POCKETBASE_URL=https://api.yourdomain.com
EOF

# Install and build
npm install
npm run build

# Upload dist folder to Hostinger public_html
scp -r dist/* user@your-domain.com:~/public_html/
```

**B. Or via Hostinger Git Integration**
1. Push to GitHub/GitLab
2. Connect to Hostinger Git deployment
3. Set build command: `cd apps/web && npm install && npm run build`
4. Set deploy directory: `apps/web/dist`

#### **5. Update Environment Configuration**

In `apps/web/.env.production`:
```
VITE_POCKETBASE_URL=https://api.yourdomain.com
# OR if using same domain with /api proxy
VITE_POCKETBASE_URL=https://yourdomain.com/api
```

---

## 🔑 Demo Credentials for Fresh Database

After reset, these users are automatically created:

| Email | Password | Role |
|-------|----------|------|
| manager@company.com | Manager123! | Manager |
| alice.smith@company.com | Employee123! | Employee |
| bob.johnson@company.com | Employee123! | Employee |
| carol.williams@company.com | Employee123! | Employee |
| david.brown@company.com | Employee123! | Employee |
| emma.davis@company.com | Employee123! | Employee |

---

## 🐛 Troubleshooting Authentication Issues

### **1. "Failed to connect" Error**
- Check VITE_POCKETBASE_URL in .env files
- Verify PocketBase is running: `curl http://localhost:8090/api/health`
- Check browser console for exact error

### **2. CORS Error**
- On Hostinger, ensure SSL certificate is enabled
- Check reverse proxy configuration
- Verify domain in PocketBase settings

### **3. Login Fails After Reset**
- Clear browser localStorage: `localStorage.clear()`
- Refresh page (Ctrl+Shift+R - hard refresh)
- Verify user exists in PocketBase Admin Panel

### **4. Can't Access PocketBase Admin**
- Local: Go to http://localhost:8090/_/
- Hostinger: Go to https://api.yourdomain.com/_/
- Check if admin credentials were set in migration

---

## 📝 Important Notes

1. **Environment Variables**: Always use `.env.production` for Hostinger, `.env.local` for local dev
2. **PocketBase Admin Panel**: Access at `http://pocketbase-url/_/` to manage users and data
3. **Migrations**: Run automatically on startup, don't need to run manually usually
4. **HTTPS**: Hostinger requires HTTPS - ensure SSL is enabled
5. **Ports**: Make sure port 8090 (or configured port) is accessible
6. **Database Encryption**: `PB_ENCRYPTION_KEY` environment variable is used for sensitive data

---

## ✅ Verification Checklist

- [ ] PocketBase running on correct URL
- [ ] React frontend can connect to PocketBase
- [ ] Login works with demo credentials
- [ ] Users can see their dashboard
- [ ] Environment variables set correctly
- [ ] Database reset completed
- [ ] Hostinger domain/subdomain configured

---

Need help? Check PocketBase logs:
```bash
tail -f pocketbase.log  # On Hostinger
// or browser console for frontend errors
```
