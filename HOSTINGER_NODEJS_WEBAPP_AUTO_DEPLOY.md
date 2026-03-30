# 🚀 HOSTINGER NODE.JS WEB APP - AUTO DEPLOY FROM GITHUB

> **سب خود بخود ہو جائے گا!**
>
> GitHub سے لیں → Hostinger میں آئے → Automatically Deploy ✅

---

## 📋 Plan

```
1. Hostinger میں Node.js Web App بنائیں
2. GitHub سے Connect کریں
3. Environment Variables سیٹ کریں
4. Deploy شروع کریں - DONE!
5. Browser میں کھولیں
6. Test کریں
```

---

## STEP 1️⃣: Hostinger میں Node.js Web App بنائیں

### A. Hostinger Control Panel کھولیں
- جاؤ: `https://hpanel.hostinger.com/`
- Login کریں

### B. اپنے Domain سے Connect کریں
```
1. Sidebar میں "Node.js Applications" یا "Web App" چھیڑیں
2. "+ Add New Application" دبائیں
3. Domain Select کریں: magenta-eel-966113.hostingersite.com
4. Application Name دیں: "performance-app"
5. Node.js Version: 20.x یا latest
6. Next دبائیں
```

### C. Repository سے Connect کریں

```
1. "Connect to Repository" پر click کریں
2. GitHub Select کریں
3. Authorize Hostinger to access GitHub
4. Repository Select کریں:
   jonathan1hivetechsol-bot/performance-
5. Branch: main
6. Next
```

---

## STEP 2️⃣: Build اور Deploy Settings

### A. Build Commands

```
npm install
npm run build --prefix apps/web
```

**Explanation:**
```
- npm install: تمام packages install ہوں
- npm run build: React app build ہو
```

### B. Start Command

```
cd apps/pocketbase && ./pocketbase serve --http=0.0.0.0:8090 &
```

**OR** (بہتر طریقہ):

اگر Hostinger آپ کو custom start script دے، تو یہ بنائیں:

**File: `start.sh`** (project root میں)

```bash
#!/bin/bash

# Start PocketBase in background
cd apps/pocketbase
./pocketbase serve --http=0.0.0.0:8090 > /tmp/pocketbase.log 2>&1 &

# Serve frontend from dist
cd ../web
npx serve -s dist -l 3000
```

Then Start Command میں:
```
bash start.sh
```

---

## STEP 3️⃣: Environment Variables سیٹ کریں

### Hostinger میں Environment Variables Add کریں

**Click:** "Environment Variables" یا "Settings"

**Add یہ Variables:**

```
# Frontend
VITE_POCKETBASE_URL=https://magenta-eel-966113.hostingersite.com/api

# Backend (PocketBase)
PB_ENCRYPTION_KEY=your-32-char-random-key-here
PB_ADMIN_EMAIL=admin@magenta-eel-966113.hostingersite.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=magenta-eel-966113.hostingersite.com,*.magenta-eel-966113.hostingersite.com
```

**How to generate PB_ENCRYPTION_KEY:**

Windows PowerShell میں:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

یا آسان طریقہ - کوئی بھی random 32-character string:
```
qwEr7yUiOpAsdfGhIjKlZxCvBnM123456
```

---

## STEP 4️⃣: Deploy شروع کریں

### Hostinger میں Click کریں:

```
"Deploy" یا "Deploy Now"
```

**یہ کام ہوگا:**

```
✓ GitHub سے code download ہوگا
✓ npm install چلے گا
✓ Frontend build ہوگا (dist/)
✓ PocketBase start ہوگا
✓ Server ready ہوگا
```

**⏱️ Wait کریں:** 5-10 منٹ

---

## STEP 5️⃣: Browser میں کھولیں

```
https://magenta-eel-966113.hostingersite.com/
```

**دیکھیں:**
```
✅ Login page آئے
✅ Email field ہو
✅ Password field ہو
```

---

## STEP 6️⃣: Login کریں اور Test کریں

### Login Credentials:

```
Email: manager@company.com
Password: Manager123!
```

### Test Features:

```
✅ Dashboard دکھے
✅ "Add Employees" click کریں
✅ Employee add کریں
✅ "Departments" دیکھیں
✅ "Assign Tasks" دیکھیں
```

---

## 🎯 اگر کچھ غلط ہو

### Issue 1: "Cannot read API"

```
Hostinger میں "Logs" دیکھیں
→ PocketBase شروع نہیں ہوا ہو سکتا
→ Start command دوبارہ چیک کریں
```

### Issue 2: "npm: command not found"

```
Hostinger میں Node.js version چیک کریں
→ 20.x یا higher ہونا چاہیے
```

### Issue 3: "Build failed"

```
1. Hostinger Logs دیکھیں
2. اگر vite error ہے - Hostinger سے contact کریں
3. یا locally build کر کے upload کریں
```

---

## 🔄 Future Updates کے لیے

جب کوئی نیا code لکھو:

```bash
# Local computer پر:

1. Code لکھیں/Edit کریں
2. git add .
3. git commit -m "description"
4. git push origin main
```

**Automatically:**
```
→ Hostinger ne detect کرے گا
→ GitHub pull ہوگا
→ Build ہوگا
→ Deploy ہوگا
→ LIVE ہوگا ✅
```

**No manual work needed!**

---

## 📝 .env File (Hostinger میں)

اگر .env file Hostinger پر خودکار نہیں ہے:

**Create file:** `apps/pocketbase/.env.production`

```env
PB_ENCRYPTION_KEY=your-key-here
PB_ADMIN_EMAIL=admin@magenta-eel-966113.hostingersite.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=magenta-eel-966113.hostingersite.com,*.magenta-eel-966113.hostingersite.com
```

Push کریں GitHub پر (لیکن password safe رکھیں!)

---

## ✅ COMPLETE CHECKLIST

- [ ] Hostinger میں Node.js App بنایا
- [ ] GitHub سے Connect کیا
- [ ] Build Command سیٹ کی: `npm install && npm run build --prefix apps/web`
- [ ] Start Command سیٹ کی
- [ ] Environment Variables Add کیے
- [ ] Deploy button دبایا
- [ ] 10 منٹ انتظار کیا
- [ ] Browser میں `https://magenta-eel-966113.hostingersite.com/` کھولا
- [ ] Login page دیکھا
- [ ] Login کیا
- [ ] Features test کیے
- [ ] ✅ LIVE!

---

## 🚀 HOSTINGER SETTINGS QUICK REFERENCE

| Setting | Value |
|---------|-------|
| Domain | magenta-eel-966113.hostingersite.com |
| Framework | Node.js |
| Node Version | 20.x |
| Repository | jonathan1hivetechsol-bot/performance- |
| Branch | main |
| Build Cmd | `npm install && npm run build --prefix apps/web` |
| Start Cmd | `cd apps/pocketbase && ./pocketbase serve --http=0.0.0.0:8090 &` |
| Port | 8090 (PocketBase), 3000 (Frontend) |

---

## 💡 Pro Tips

1. **Logs دیکھیں:** Hostinger Dashboard → Logs → معلومات ملے گی
2. **Auto-redeploy:** ہر `git push` پر خود deploy ہوگا
3. **Backup:** Regular backup لیں database کا
4. **Monitoring:** PocketBase health check کریں: `curl http://localhost:8090/api/health`

---

## 📞 Hostinger Support

اگر problem ہو:
```
1. Hostinger Support Chat کھولیں
2. "Node.js App سے GitHub deploy nahi ho raha"
3. Logs share کریں
```

---

## 🎉 That's it!

```
✅ GitHub Push کریں
✅ Hostinger Auto Deploy
✅ Domain پر Live
✅ Done!
```

**No manual server setup needed!** 🚀

---

**کوئی سوال؟ یہاں پوچھیں!**
