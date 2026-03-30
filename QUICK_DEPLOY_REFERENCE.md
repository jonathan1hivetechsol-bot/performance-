# ⚡ HOSTINGER DEPLOYMENT - QUICK REFERENCE CARD

> **یہ صفحہ Hostinger panel میں رکھو اور follow کر!**

---

## 📋 VALUES TO COPY-PASTE

### Build Command
```bash
npm install && npm run build --prefix apps/web
```

### Start Command  
```bash
cd apps/pocketbase && ./pocketbase serve --http=0.0.0.0:8090 &
```

---

## 🔑 ENVIRONMENT VARIABLES

```
VITE_POCKETBASE_URL = https://magenta-eel-966113.hostingersite.com/api
PB_ENCRYPTION_KEY = qwEr7yUiOpAsdfGhIjKlZxCvBnM123456
PB_ADMIN_EMAIL = admin@magenta-eel-966113.hostingersite.com
PB_ADMIN_PASSWORD = YourSecurePassword123!
PB_SERVER_HOST = 0.0.0.0
PB_SERVER_PORT = 8090
PB_SERVER_ORIGINS = magenta-eel-966113.hostingersite.com,*.magenta-eel-966113.hostingersite.com
```

---

## 🎯 STEPS (COPY-PASTE ORDER)

1. **Domain:** `magenta-eel-966113.hostingersite.com`
2. **App Name:** `performance-app`
3. **Node Version:** `20.x`
4. **Repository:** `jonathan1hivetechsol-bot/performance-`
5. **Branch:** `main`
6. **Build Command:** ⬆️ (see above)
7. **Start Command:** ⬆️ (see above)
8. **Environment Variables:** ⬆️ (see above - add all 7)
9. **Deploy!**
10. **Wait 10 minutes**
11. **Open:** `https://magenta-eel-966113.hostingersite.com/`

---

## ✅ TEST CREDENTIALS

```
Email: manager@company.com
Password: Manager123!
```

---

## 🔍 VERIFICATION CHECKLIST

- [ ] Page loads: https://magenta-eel-966113.hostingersite.com/
- [ ] Login form visible
- [ ] Can login with credentials
- [ ] Dashboard appears
- [ ] "Add Employees" visible
- [ ] "Departments" visible
- [ ] "Assign Tasks" visible
- [ ] Can add employee
- [ ] Can create department
- [ ] Can assign task

---

## ⏱️ TIMELINE

```
0 min    : Click Deploy
1 min    : GitHub clone start
2 min    : npm install
5 min    : Build in progress
8 min    : PocketBase start
10 min   : ✅ LIVE!
```

---

## 🆘 QUICK TROUBLESHOOT

| Problem | Solution |
|---------|----------|
| "npm not found" | Select Node 20.x |
| "Cannot GET /" | Check build logs |
| "API error" | PocketBase may be starting (wait more) |
| "Can't login" | Collections creating (wait) |
| "Page blank" | Hard refresh (Ctrl+Shift+R) |

---

## 📞 IF STUCK

1. **Check Hostinger Logs** → Copy error
2. **Check repository exists** → https://github.com/jonathan1hivetechsol-bot/performance-
3. **Verify Environment Variables** → All 7 added?
4. **Try redeploying** → From Hostinger dashboard
5. **Contact Hostinger Support** → Share logs

---

**GO AHEAD! DEPLOY NOW! 🚀**
