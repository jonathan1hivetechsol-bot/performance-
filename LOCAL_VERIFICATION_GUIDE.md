# 🔍 Local Development Verification Guide

> **Quick verification that everything is working!**

---

## ⚡ Quick Health Check (30 seconds)

### 1. Check PocketBase is Running
```bash
# Open new terminal
curl http://localhost:8090/api/health

# Expected response:
# {"code":200,"message":"OK"}
```

### 2. Check React Frontend is Running
```bash
# Check if port 3001 is listening
curl http://localhost:3001

# Or open browser: http://localhost:3001
# Should show login page
```

### 3. Check Environment Variables
```bash
# In browser console (F12 DevTools):
console.log(import.meta.env.VITE_POCKETBASE_URL)

# Should show: http://localhost:8090
```

---

## 🔧 Step-by-Step Verification

### A. Terminal 1: Verify PocketBase

```bash
# Navigate to pocketbase folder
cd apps/pocketbase

# Check if pocketbase binary exists
ls -la pocketbase
# Should show file (size ~33MB)

# Try to start PocketBase
./pocketbase serve --http=0.0.0.0:8090

# Expected output:
# 2026/03/30 10:30:45 > [PocketBase] Bootstrap initialized.
# 2026/03/30 10:30:45 > [PocketBase] Admin panel available at http://localhost:8090/_/
# (or similar startup messages)

# If it doesn't show errors, it's running! ✅
# Keep this terminal open
```

**Troubleshooting PocketBase Start:**
```bash
# If "permission denied" error
chmod +x pocketbase

# If "port already in use"
lsof -i :8090        # Find what's using port 8090
kill -9 <PID>        # Kill the process
./pocketbase serve --http=0.0.0.0:8090  # Try again

# If "pocketbase: command not found"
# Use full path:
./pocketbase serve --http=0.0.0.0:8090
# Or on Windows:
.\pocketbase.exe serve --http=0.0.0.0:8090
```

### B. Terminal 2: Verify React Frontend

```bash
# Navigate to web folder
cd apps/web

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Expected output:
# VITE v7.3.1 ready in 1000 ms
# Local: http://localhost:3001/
# Network: http://192.168.x.x:3001/
```

**Troubleshooting React Start:**
```bash
# If "port 3000 in use"
# Vite will auto-shift to 3001, that's normal!

# If "npm: command not found"
# Make sure Node.js is installed: node --version

# If dependencies error
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### C. Terminal 3: Test Connection

```bash
# Keep this terminal fresh to run tests

# Test 1: PocketBase responds
curl -v http://localhost:8090/api/health

# Expected:
# < HTTP/1.1 200 OK
# {"code":200,"message":"OK"}

# Test 2: Check environment variable is loaded
# Go to browser → http://localhost:3001 → F12 Console
console.log(import.meta.env.VITE_POCKETBASE_URL)
# Should show: http://localhost:8090
```

---

## 📋 Full Checklist

| Check | Command | Expected | Status |
|-------|---------|----------|--------|
| **PocketBase Binary** | `ls apps/pocketbase/pocketbase` | File exists (33MB) | ✓ |
| **PocketBase Port** | `curl http://localhost:8090/api/health` | `{"code":200,"message":"OK"}` | ? |
| **React Running** | Open browser to `http://localhost:3001` | Login page loads | ? |
| **Environment Var** | Browser Console: `import.meta.env.VITE_POCKETBASE_URL` | `http://localhost:8090` | ? |
| **.env.local File** | `cat .env.local` | Contains `VITE_POCKETBASE_URL=http://localhost:8090` | ? |
| **Collections Exist** | Browser F12 Console → Network tab | No 404 errors on API calls | ? |
| **Login Works** | Try login with `manager@company.com` / `Manager123!` | Dashboard loads | ? |

---

## 🚨 Debug "Something went wrong" Error

If you see **"Something went wrong while processing your request"** on login page:

### Step 1: Check Browser Console
```javascript
// Open DevTools (F12) → Console tab → Look for errors
// Common errors:
// - "Failed to fetch from http://localhost:8090" → PocketBase not running
// - "CORS error" → Network issue
// - "Timeout" → PocketBase too slow
```

### Step 2: Verify PocketBase is Responding
```bash
# Terminal 3: Run this exact command
curl -v http://localhost:8090/api/health

# Should show:
# HTTP/1.1 200 OK
# {"code":200,"message":"OK"}

# If it hangs or times out → PocketBase not running
# If "Connection refused" → Port wrong or PocketBase crashed
```

### Step 3: Check Environment Variable
```javascript
// Browser Console (F12)
console.log('URL:', import.meta.env.VITE_POCKETBASE_URL)
console.log('Full:', import.meta.env)

// Should show: http://localhost:8090
// If empty or undefined → .env.local not loaded
```

### Step 4: Restart Everything
```bash
# Terminal 1 (PocketBase)
Ctrl+C to stop
./pocketbase serve --http=0.0.0.0:8090

# Terminal 2 (React)
Ctrl+C to stop
npm run dev

# Browser: Refresh F5 or Ctrl+Shift+R (hard refresh)
```

---

## ✅ Success Indicators

### PocketBase Running Correctly
```
✅ Command starts without errors
✅ Logs show "Admin panel available at http://localhost:8090/_/"
✅ curl http://localhost:8090/api/health returns 200 OK
✅ Browser can access http://localhost:8090/_/ (admin panel)
```

### React Running Correctly
```
✅ npm run dev shows "VITE v7.3.1 ready"
✅ Port is 3000 or 3001 (or custom)
✅ http://localhost:3001 loads login page
✅ No JavaScript errors in console
```

### Connection Working
```
✅ Browser Console shows: VITE_POCKETBASE_URL = http://localhost:8090
✅ Network tab (F12) shows successful requests to /api/
✅ Login page doesn't show "Something went wrong"
✅ Can successfully login with manager@company.com / Manager123!
```

---

## 📊 Detailed Debugging

### Check PocketBase Logs
```bash
# If PocketBase is running, check for errors
tail -f apps/pocketbase/pb_data/logs/*.log

# Look for:
# - Startup messages
# - Connection attempts
# - Collection initialization
# - Migration execution
```

### Check React Network Tab
```
Browser DevTools (F12) → Network tab → Try login

Look at requests:
✅ POST /api/auth/login → Should return 200 with user data
✅ GET /api/collections → Should return 200 with collections

❌ If 404 → PocketBase not responding
❌ If CORS error → Proxy configuration issue
❌ If timeout → Server too slow or not responding
```

### Check .env.local is Loaded
```bash
# File should exist:
ls -la .env.local

# Should contain:
cat .env.local
# VITE_POCKETBASE_URL=http://localhost:8090

# After changing .env.local, restart React:
# Ctrl+C in Terminal 2
# npm run dev
```

---

## 🔄 Common Issues & Fixes

### Issue 1: "Cannot find pocketbase binary"
**Symptom**: `pocketbase: command not found` or `./pocketbase: permission denied`

**Fix**:
```bash
cd apps/pocketbase

# Check if file exists
ls -la pocketbase

# Make it executable
chmod +x pocketbase

# Use relative path
./pocketbase serve --http=0.0.0.0:8090

# On Windows use backslash
.\pocketbase.exe serve --http=0.0.0.0:8090
```

### Issue 2: "Port 8090 already in use"
**Symptom**: `Failed to listen on http://0.0.0.0:8090`

**Fix**:
```bash
# Find what's using port 8090
lsof -i :8090        # Mac/Linux
netstat -ano | findstr :8090  # Windows

# Kill the process
kill -9 <PID>

# On Windows PowerShell
Stop-Process -Id <PID> -Force

# Try PocketBase again
./pocketbase serve --http=0.0.0.0:8090
```

### Issue 3: "VITE_POCKETBASE_URL not loading"
**Symptom**: Browser shows `undefined` for environment variable

**Fix**:
```bash
# Check .env.local exists
cat .env.local

# Should contain:
# VITE_POCKETBASE_URL=http://localhost:8090

# If missing, create it
nano .env.local
# Add: VITE_POCKETBASE_URL=http://localhost:8090

# Restart React (important!)
# Ctrl+C in Terminal 2
npm run dev
```

### Issue 4: "Collections don't exist"
**Symptom**: API returns collection not found error

**Fix**:
```bash
# Check PocketBase admin panel
# Browser: http://localhost:8090/_/

# Should show collections:
# - users
# - departments
# - tasks
# - etc.

# If missing, PocketBase needs to initialize:
# 1. Make sure pb_migrations/ folder exists
# 2. Restart PocketBase
# 3. Check logs for migration execution

# Or manually create collections in admin panel
```

### Issue 5: "Login fails with 'Something went wrong'"
**Symptom**: Login button doesn't work, error message appears

**Fix**:
```bash
# 1. Open DevTools F12 → Console
# 2. Look for network errors
# 3. Check if PocketBase is running
curl http://localhost:8090/api/health

# 4. Verify correct login credentials
# Email: manager@company.com
# Password: Manager123!

# 5. Check VITE_POCKETBASE_URL
console.log(import.meta.env.VITE_POCKETBASE_URL)

# 6. Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

---

## 🎯 Expected Workflow

### Step 1: Start PocketBase
```bash
cd apps/pocketbase
./pocketbase serve --http=0.0.0.0:8090
# Keep this terminal open
```

**Wait 5 seconds for it to fully start**

### Step 2: Start React
```bash
# New terminal
cd apps/web
npm run dev
# Keep this terminal open
```

**Wait 5 seconds for Vite to compile**

### Step 3: Open Browser
```
http://localhost:3001
# Should show login page
```

### Step 4: Try Login
```
Email: manager@company.com
Password: Manager123!
```

### Step 5: Success! 🎉
```
✅ Dashboard loads
✅ Can see employees, departments, tasks
✅ Can create/edit/delete items
✅ Everything works!
```

---

## 📞 Need Help?

Check these files:
- **Frontend Config**: `apps/web/.env.local`
- **Backend Config**: `apps/pocketbase/.env`
- **PocketBase Client**: `apps/web/src/lib/pocketbaseClient.js`
- **Auth Context**: `apps/web/src/contexts/AuthContext.jsx`

Check logs:
- **React Dev**: Terminal showing npm run dev output
- **PocketBase**: Terminal showing pocketbase serve output
- **Browser Console**: F12 DevTools → Console tab

---

**Status**: ✅ **Use this guide to verify your local setup works!**
