# 🚀 HOSTINGER DEPLOY - A TO Z GUIDE (आसान اردו میں!)

> **Complete Step-by-Step Deployment Guide**
> 
> یہ guide ہے اگر آپ کو Hostinger پر deploy کرنا ہے

---

## 📋 پہلے چیزیں جو آپ کو چاہیے:

### ✅ Hostinger Account
- [ ] Hostinger پر account بنایا
- [ ] Domain خریدی یا register کی
- [ ] SSH access enabled کی

### ✅ Your Computer پر
- [ ] Node.js installed ہے (check: `node --version`)
- [ ] Git installed ہے (optional لیکن آسان ہے)
- [ ] Code تیار ہے (یہ already تیار ہے!)

---

## 🎯 STEP 1: اپنے Code کو Prepare کریں (Local Computer پر)

### اسی folder میں جاؤ جہاں code ہے:
```bash
cd C:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0
```

### Verify کریں کہ یہ files ہیں:
```bash
# Files check کریں
ls -la .env.local
ls -la apps/pocketbase/.env
ls -la deploy.sh
```

**اگر سب موجود ہے تو آگے بڑھیں! ✅**

---

## 📝 STEP 2: اپنا Domain اور Credentials Decide کریں

### مثال (اپنا domain replace کریں):
```
Domain: schoolmanager.com
Email: admin@schoolmanager.com
Password: YourSecurePassword123!

(یہ سب یاد رکھیں!)
```

---

## 🔐 STEP 3: Environment Files تیار کریں

### Step 3A: Frontend Environment File بنائیں

**File path:** `apps/web/.env.production`

```env
# یہ کھولیں:
nano apps/web/.env.production

# یہ type کریں (اپنا domain لکھیں):
VITE_POCKETBASE_URL=https://schoolmanager.com

# Save کریں: Ctrl+X, پھر Y, پھر Enter
```

### Step 3B: Backend Environment File تیار کریں

**File path:** `apps/pocketbase/.env`

```env
# یہ file پہلے سے ہے، اسے edit کریں:
nano apps/pocketbase/.env

# اس میں یہ لکھیں:
PB_ENCRYPTION_KEY=your-random-32-char-string-here
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com

# Save: Ctrl+X, Y, Enter
```

**PB_ENCRYPTION_KEY کیسے generate کریں:**
```bash
# اگر Mac/Linux ہے:
openssl rand -base64 32

# اگر Windows ہے:
# کوئی random 32-character string لیں، مثال:
# qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=
```

---

## 📤 STEP 4: Code کو Hostinger پر Upload کریں

### Option A: Git استعمال کریں (EASIEST ⭐)

```bash
# Local computer پر:

# پہلے git میں add کریں
git add .

# Commit کریں
git commit -m "Ready for production"

# Push کریں
git push origin main
```

**فائدہ:** بس یہ 3 command چلائیں اور تمام code Hostinger پر ہو جائے گا!

### Option B: File Manager سے Upload کریں

1. **Hostinger Control Panel کھولیں**
2. **File Manager کھولیں**
3. **public_html میں جائیں**
4. **اپنے folders upload کریں:**
   - `apps/` folder
   - `package.json` file
   - `deploy.sh` file

---

## 💻 STEP 5: Hostinger Server سے Connect کریں (SSH)

### Terminal/PowerShell کھولیں اور لیکھیں:

```bash
ssh user@schoolmanager.com
```

**جہاں:**
- `user` = آپ کے Hostinger username
- `schoolmanager.com` = آپ کا domain

### Password ڈالیں جو Hostinger نے دی ہے

**اگر Connected ہو گئے تو آپ یہ دیکھیں گے:**
```bash
user@hostname:~$
```

✅ اب آپ Hostinger server پر ہیں!

---

## 📁 STEP 6: Application Folder میں جائیں

```bash
# Hostinger server پر:

# App folder میں جائیں
cd public_html

# اگر app folder نہیں ہے تو بنائیں
mkdir app
cd app

# Check کریں کہ code ہے
ls -la
# یہ دیکھنا چاہیے: apps/, package.json, deploy.sh
```

---

## 🔧 STEP 7: Environment Files Server پر Create کریں

### PocketBase کے لیے .env file بنائیں:

```bash
# Hostinger server پر، app folder میں:

cat > apps/pocketbase/.env << 'EOF'
PB_ENCRYPTION_KEY=your-32-char-random-key-here
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=YourSecurePassword123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
EOF

# Verify کریں
cat apps/pocketbase/.env
# یہ دیکھنا چاہیے سب settings
```

---

## 🚀 STEP 8: Deploy Script چلائیں

### یہ command لیکھیں:

```bash
# Hostinger server پر, app folder میں
bash deploy.sh
```

### اب یہ auto-ہوگا:
```
1. Dependencies install ہوں گے
2. Frontend build ہوگا
3. PocketBase start ہوگا
4. Database auto-create ہوگا
5. Collections auto-create ہوں گے
6. Demo users add ہوں گے
7. System ready! ✅
```

**5-10 منٹ انتظار کریں...**

---

## ✅ STEP 9: Verify کریں کہ سب کام کر رہا ہے

### Check کریں کہ PocketBase چل رہا ہے:

```bash
# Hostinger server پر:
curl http://localhost:8090/api/health

# Response ہونا چاہیے:
# {"code":200,"message":"OK"}
```

### اگر یہ response آیا تو ✅ Perfect!

---

## 🌐 STEP 10: Browser میں کھولیں اور Test کریں

### اپنے browser میں:

```
https://schoolmanager.com
```

**جو ہونا چاہیے:**
1. ✅ Login page دکھائی دے
2. ✅ Email کا field ہو
3. ✅ Password کا field ہو

### Login کریں:
```
Email: manager@company.com
Password: Manager123!
```

### اگر Dashboard دکھائی دے تو ✅ SUCCESS!

---

## 🎯 STEP 11: Features Test کریں

### تینوں features check کریں:

```
1. "Add Employees" link دیکھیں → Click کریں → کوئی employee add کریں
   ✅ اگر employee list میں آ گیا تو OK!

2. "Departments" link دیکھیں → Click کریں → Department بنائیں
   ✅ اگر department save ہو گیا تو OK!

3. "Assign Tasks" link دیکھیں → Click کریں → Task assign کریں
   ✅ اگر task list میں آ گیا تو OK!
```

**اگر سب کام کر رہا ہے تو:**

# 🎉 CONGRATULATIONS! آپ کا system LIVE ہے!

---

## 📊 اب کیا کریں؟

### Option 1: System کو Manage کریں

```bash
# Hostinger server سے SSH میں:

# Logs دیکھیں
tail -f apps/pocketbase/pocketbase.log

# Services کو restart کریں
pkill pocketbase
cd apps/pocketbase
./pocketbase serve --http=0.0.0.0:8090 &
```

### Option 2: Update کریں

```bash
# جب code update کی ہو:

cd public_html/app

# Latest code pull کریں
git pull origin main

# Rebuild کریں
cd apps/web
npm run build

# PocketBase restart کریں
pkill pocketbase
cd ../pocketbase
./pocketbase serve --http=0.0.0.0:8090 &
```

### Option 3: Database Backup لیں

```bash
# Hostinger server سے:

# Backup بنائیں
cp -r apps/pocketbase/pb_data apps/pocketbase/pb_data.backup-$(date +%Y%m%d)

echo "Backup complete!"
```

---

## 🆘 اگر کوئی مسئلہ آئے

### مسئلہ 1: "Cannot find deploy.sh"

```bash
# Check کریں
ls -la deploy.sh

# اگر نہیں ہے تو:
chmod +x deploy.sh
```

### مسئلہ 2: "npm: command not found"

```bash
# Node.js install ہے اگر check کریں
node --version

# اگر نہیں ہے تو Hostinger سے contact کریں
# یا SSH میں یہ run کریں:
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
```

### مسئلہ 3: "PocketBase won't start"

```bash
# Logs check کریں
tail -f apps/pocketbase/pocketbase.log

# اگر port in use ہے:
lsof -i :8090
kill -9 <PID>

# Try again
./apps/pocketbase/pocketbase serve --http=0.0.0.0:8090
```

### مسئلہ 4: "Can't login"

```
1. Check کریں: https://schoolmanager.com/_/
   (یہ PocketBase admin panel ہے)

2. اگر collections نہیں ہیں تو:
   - deploy.sh دوبارہ run کریں
   - یا PocketBase restart کریں
```

---

## 📋 Quick Checklist

- [ ] Hostinger account ready
- [ ] Domain setup ہو گیا
- [ ] SSH access working ہے
- [ ] Local .env.production بنایا
- [ ] Local apps/pocketbase/.env updated
- [ ] Code Hostinger پر uploaded (Git یا File Manager)
- [ ] SSH سے connect کیا
- [ ] app folder میں ہوں
- [ ] bash deploy.sh چلایا
- [ ] curl سے PocketBase test کیا
- [ ] Browser میں 5 منٹ انتظار کیا
- [ ] https://yourdomain.com کھولا
- [ ] Login کیا
- [ ] Features test کی
- [ ] ✅ LIVE ہے!

---

## 🎯 Expected Timeline

| Step | Time | کیا ہوتا ہے |
|------|------|-----------|
| 1-3 | 5 min | Environment files تیार |
| 4 | 5 min | Code upload (Git یا File Manager) |
| 5 | 2 min | SSH connect |
| 6-7 | 5 min | Folders اور files setup |
| 8 | 10 min | Deploy script runs |
| 9-10 | 3 min | Verify اور test |
| **Total** | **~30 min** | **LIVE!** ✅ |

---

## 💡 Pro Tips

1. **Tab کو open رکھیں**: پہلے deployment guide پڑھیں پھر step by step کریں
2. **Copy-Paste کریں**: Typing errors سے بچنے کے لیے
3. **ہر step verify کریں**: پھر اگلا کریں
4. **Logs دیکھیں**: اگر مسئلہ ہو تو `tail -f *.log` دیکھیں
5. **Backup رکھیں**: پہلے existing data کا backup لیں اگر ہو

---

## 📞 اگر Help چاہیے

### مختلف error/scenarios کے لیے:

1. **LOCAL_VERIFICATION_GUIDE.md** - Local issues کے لیے
2. **COMPLETE_DEPLOYMENT_GUIDE.md** - Detailed guide
3. **HOSTINGER_ENV_CONFIGURATION.md** - .env سیٹنگز
4. **SYSTEM_VERIFICATION_REPORT.md** - System status check

---

## ✅ Final Confirmation

جب یہ ہو جائے:

```
✅ https://yourdomain.com لی جائے
✅ Login page دکھائی دے
✅ manager@company.com سے login ہو جائے
✅ Dashboard لود ہو
✅ 3 features کام کریں
✅ Database میں data save ہو
```

**تو آپ کا system PRODUCTION LIVE ہے!** 🎉

---

## 🚀 اب کیا ہے؟

### آپ اب یہ کر سکتے ہیں:

1. **Use کریں**: System استعمال کریں
2. **Add Features**: نئی features add کریں
3. **Customize**: اپنی ضرورت کے مطابق customize کریں
4. **Monitor**: Logs دیکھتے رہیں
5. **Maintain**: Regular updates اور backups لیں

---

## 📌 یہ یاد رکھیں

```
✅ Database auto-create ہوتا ہے
✅ Collections auto-create ہوتے ہیں
✅ Demo users auto-seed ہوتے ہیں
✅ Zero manual database setup!
✅ بس deploy.sh چلاؤ اور بیٹھ جاؤ!
```

---

**Question? Problem?**

→ COMPLETE_DEPLOYMENT_GUIDE.md پڑھیں
→ LOCAL_VERIFICATION_GUIDE.md check کریں
→ Logs `tail -f apps/pocketbase/pocketbase.log` سے دیکھیں

---

**Status**: ✅ **آپ تیار ہیں deployment کے لیے!**

**چلیں! Deploy کریں!** 🚀
