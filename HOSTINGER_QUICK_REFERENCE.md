# 📌 HOSTINGER DEPLOYMENT - QUICK REFERENCE CARD

> **Print This! Keep It Handy While Deploying**

---

## 🎯 5-STEP DEPLOYMENT PROCESS

```
STEP 1: Prepare Local      (5 min)  → Create .env files
STEP 2: Push to Git        (5 min)  → git push
STEP 3: SSH to Server      (2 min)  → ssh connect
STEP 4: Setup Server       (5 min)  → Create .env on server
STEP 5: Deploy             (10 min) → bash deploy.sh
STEP 6: Verify             (3 min)  → Test in browser
        ───────────────────────────
        TOTAL: ~30 minutes ✅
```

---

## 📋 BEFORE YOU START - HAVE READY

```
☑️ Hostinger account
☑️ Domain name (e.g., schoolmanager.com)
☑️ SSH username/password
☑️ Your admin email
☑️ Admin password (new one you create)
☑️ This code folder open
```

---

## 🔧 QUICK COMMANDS

### LOCAL COMPUTER (PowerShell)

```powershell
# STEP 1: Create .env.production
echo 'VITE_POCKETBASE_URL=https://schoolmanager.com' > apps\web\.env.production

# STEP 2: Update apps/pocketbase/.env
# (Edit manually with values from below)

# STEP 3: Push to Git
git add .
git commit -m "Deploy ready"
git push origin main
```

### HOSTINGER SERVER (SSH/Bash)

```bash
# STEP 4: Connect
ssh user@schoolmanager.com
cd public_html/app

# STEP 5: Create .env
cat > apps/pocketbase/.env << 'EOF'
PB_ENCRYPTION_KEY=your-random-key
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=YourPassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
EOF

# STEP 6: Deploy!
bash deploy.sh

# STEP 7: Verify
curl http://localhost:8090/api/health
```

### BROWSER

```
https://schoolmanager.com
Login: manager@company.com / Manager123!
```

---

## 📝 VALUES TO REPLACE

```
schoolmanager.com    → Your domain
admin@schoolmanager.com → Your email
YourPassword123!     → Your password (create new)
your-random-key      → Random 32 chars (or use: qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=)
user                 → Your Hostinger SSH username
```

---

## ✅ VERIFICATION STEPS

```
✓ PocketBase health:
  curl http://localhost:8090/api/health
  Expected: {"code":200,"message":"OK"}

✓ Browser:
  https://yourdomain.com
  Expected: Login page loads

✓ Login:
  Email: manager@company.com
  Password: Manager123!
  Expected: Dashboard shows

✓ Features:
  - Add employee ✓
  - Create department ✓
  - Assign task ✓
```

---

## 🆘 QUICK TROUBLESHOOTING

```
SSH won't connect?
→ Check username/password
→ Check SSH enabled in Hostinger

deploy.sh not found?
→ Check you're in app folder
→ chmod +x deploy.sh
→ bash deploy.sh

npm not found?
→ Node.js not installed on Hostinger
→ Contact Hostinger support

PocketBase won't start?
→ pkill pocketbase
→ ./pocketbase serve --http=0.0.0.0:8090

Database empty?
→ bash deploy.sh (run again)
→ Check logs: tail -f pocketbase.log
```

---

## 📁 IMPORTANT LOCATIONS

```
Local:       C:\Users\Futur\Downloads\horizons-export...
Server:      /home/user/public_html/app/
Database:    apps/pocketbase/pb_data/data.db
Frontend:    apps/web/dist/
Backend:     apps/pocketbase/
Config:      apps/pocketbase/.env (SECRET!)
```

---

## ⏱️ STEP-BY-STEP TIMING

```
0:00-0:05   Prepare local files
0:05-0:10   Push to Git
0:10-0:12   SSH connect
0:12-0:17   Setup on server
0:17-0:27   Run deploy (AUTO, just wait)
0:27-0:30   Test & verify
───────────
0:30       LIVE! ✅
```

---

## 🎯 CHECKLIST

```
LOCAL COMPUTER:
 □ .env.production created
 □ apps/pocketbase/.env updated
 □ git push successful

HOSTINGER SERVER:
 □ SSH connected
 □ Code cloned/uploaded
 □ .env file created on server
 □ deploy.sh executed
 □ Health check passed (curl)

BROWSER:
 □ https://yourdomain.com loads
 □ Login works
 □ Dashboard appears
 □ Employee feature works
 □ Departments feature works
 □ Tasks feature works

✅ ALL CHECKED = LIVE!
```

---

## 🔐 SECURITY REMINDERS

```
⚠️ NEVER:
 ❌ Commit .env files to Git
 ❌ Share your password
 ❌ Put secrets in code
 ❌ Use weak passwords

✅ ALWAYS:
 ✓ Use strong passwords (8+ chars, mix)
 ✓ Keep .env in .gitignore
 ✓ Backup database regularly
 ✓ Monitor logs for errors
```

---

## 📞 FILE REFERENCES

```
NEED DETAILED HELP?
 → COMPLETE_DEPLOYMENT_GUIDE.md
 → HOSTINGER_DEPLOY_A_TO_Z_URDU.md
 → HOSTINGER_COPY_PASTE_COMMANDS.md
 → HOSTINGER_VISUAL_FLOW_GUIDE.md

TROUBLESHOOTING?
 → LOCAL_VERIFICATION_GUIDE.md

WANT OVERVIEW?
 → FINAL_STATUS_DASHBOARD.md
```

---

## 💡 PRO TIPS

```
✓ Keep this card visible while deploying
✓ Check each step before moving to next
✓ Don't rush - take your time
✓ Test after each major step
✓ Keep passwords in safe place
✓ Document what you do (for future)
✓ Ask for help from Hostinger if needed
```

---

## 🎯 SUCCESS CRITERIA

```
System is LIVE when you see:

✅ Login page at https://yourdomain.com
✅ Can login with manager@company.com
✅ Dashboard loads
✅ Can add employee
✅ Can create department  
✅ Can assign task
✅ Data persists after refresh
✅ No console errors
✅ No database errors
```

---

## 🚀 YOU'RE READY!

```
Everything is prepared.
All scripts are ready.
All documentation exists.

You just need to:
1. Follow the steps
2. Run the commands
3. Wait for deploy.sh
4. Test in browser

Let's go! 💪
```

---

**Generated**: March 30, 2026
**Status**: Ready for Deployment ✅
**Time Needed**: ~30 minutes
**Difficulty**: ⭐⭐ (Easy, with guides)

---

**Good Luck!** 🚀
