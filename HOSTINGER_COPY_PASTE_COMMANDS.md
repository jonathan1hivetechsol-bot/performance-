# 🎯 HOSTINGER DEPLOY - EXACT COMMANDS (Copy-Paste کریں!)

> **Copy-Paste Ready Commands**
> 
> ہر Step میں بالکل یہی commands چلائیں!

---

## 📋 BEFORE YOU START - 5 THINGS CHECK کریں

```
☑️ 1. Hostinger account ہے
☑️ 2. Domain registered ہے
☑️ 3. SSH access enabled ہے
☑️ 4. Local computer پر Node.js ہے
☑️ 5. یہ code folder ہے: C:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0
```

---

## 🔄 STEP 1: Local Computer پر (Your Computer)

### 📂 Folder میں جائیں:
```powershell
cd C:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0
```

### ✅ Check کریں سب files ہیں:
```powershell
ls .env.local
ls apps\pocketbase\.env
ls deploy.sh
ls apps\web\src\lib\pocketbaseClient.js
```

**Expected**: تمام 4 ✅ دکھیں

---

## 🔐 STEP 2: اپنے Domain اور Password Decide کریں

**یہ values استعمال کریں:**

```
DOMAIN = schoolmanager.com          (اپنا domain)
ADMIN_EMAIL = admin@schoolmanager.com
ADMIN_PASSWORD = YourSecure123!     (خود بنائیں)
ENCRYPTION_KEY = qwEr7yUiOpAsdf     (کوئی random 32 char)
```

**💡 Tip:** یہ values کہیں note کر لیں!

---

## 📝 STEP 3: Create Production Environment File

### 3A: Frontend environment بنائیں

**File**: `apps/web/.env.production`

```powershell
# Terminal میں (Windows):
echo 'VITE_POCKETBASE_URL=https://schoolmanager.com' > apps\web\.env.production

# Verify:
cat apps\web\.env.production
```

**Expected Output**:
```
VITE_POCKETBASE_URL=https://schoolmanager.com
```

### 3B: Backend environment update کریں

**File**: `apps/pocketbase/.env`

```powershell
# پہلے موجودہ content delete کریں:
rm apps\pocketbase\.env

# نیا create کریں (replace اپنے values سے):
$content = @"
PB_ENCRYPTION_KEY=qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=YourSecure123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
"@

$content | Out-File -FilePath apps\pocketbase\.env -Encoding UTF8

# Verify:
cat apps\pocketbase\.env
```

**Expected**: تمام settings دکھیں

---

## 📤 STEP 4: Code کو Git سے Push کریں

```powershell
# Check current folder:
pwd
# Should show: C:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0

# Add all files:
git add .

# Commit:
git commit -m "Production deployment ready"

# Push to main branch:
git push origin main
```

**Expected**: Code successfully uploaded ✅

---

## 💻 STEP 5: Hostinger Server Connect کریں (SSH)

### PowerShell/CMD میں یہ command لیکھیں:

```powershell
# اپنے Hostinger username اور domain سے:
ssh user@schoolmanager.com
```

**Replace کریں:**
- `user` = آپ کے Hostinger SSH username
- `schoolmanager.com` = آپ کا domain

### Password ڈالیں جو Hostinger نے دی

**اگر Success ہوا تو:**
```
user@hostname:~$
```

✅ **اب آپ Hostinger server پر ہیں!**

---

## 📁 STEP 6: App Folder Setup (Hostinger Server میں)

### یہ سب commands Hostinger server پر چلائیں:

```bash
# App directory میں جائیں:
cd public_html

# App folder بنائیں:
mkdir -p app
cd app

# Repository clone کریں (اگر git سے upload کیا تو):
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
git pull origin main

# یا اگر File Manager سے upload کیا:
ls -la
# یہ دیکھنا چاہیے: apps/  package.json  deploy.sh
```

---

## 🔧 STEP 7: Environment File Server پر Create کریں

### Hostinger server میں یہ command چلائیں:

```bash
# PocketBase environment file بنائیں:
cat > apps/pocketbase/.env << 'EOF'
PB_ENCRYPTION_KEY=qwEr7yUiOpAsdfGh+jKlZxCvBnM/12345=
PB_ADMIN_EMAIL=admin@schoolmanager.com
PB_ADMIN_PASSWORD=YourSecure123!
PB_SERVER_HOST=0.0.0.0
PB_SERVER_PORT=8090
PB_SERVER_ORIGINS=schoolmanager.com,*.schoolmanager.com
PB_SMTP_HOST=smtp.hostinger.com
PB_SMTP_PORT=587
PB_SMTP_USERNAME=your-email@schoolmanager.com
PB_SMTP_PASSWORD=your-email-password
EOF

# Verify کریں:
cat apps/pocketbase/.env
```

**Expected**: تمام settings دکھیں ✅

---

## 🚀 STEP 8: Deploy Script چلائیں

### یہ Hostinger server میں:

```bash
# Deploy script کو executable بنائیں:
chmod +x deploy.sh

# Deploy شروع کریں:
bash deploy.sh
```

### اب منتظر رہیں! یہ auto-ہوگا:

```
✅ Cleaning previous services...
✅ Creating directories...
✅ Installing PocketBase dependencies...
✅ Installing web dependencies...
✅ Building frontend...
✅ Starting PocketBase...
✅ Waiting for PocketBase to initialize...
✅ PocketBase is responding...
✅ Deployment complete!
```

**⏱️ 5-10 منٹ لگ سکتے ہیں...**

---

## ✅ STEP 9: Verify کریں PocketBase چل رہا ہے

### Hostinger server میں:

```bash
# PocketBase کی health check کریں:
curl http://localhost:8090/api/health

# Expected Output:
# {"code":200,"message":"OK"}
```

**اگر یہ ✅ آیا تو Perfect!**

---

## 🌐 STEP 10: Browser میں Test کریں

### اپنے computer کے browser میں:

```
https://schoolmanager.com
```

### کیا دیکھنا چاہیے:

```
✅ Page load ہو
✅ Login form دکھائی دے
✅ Email field موجود ہو
✅ Password field موجود ہو
```

**اگر یہ سب دکھائی دے تو ✅ Great!**

---

## 🔓 STEP 11: Login کریں

### Browser میں یہ enter کریں:

```
Email: manager@company.com
Password: Manager123!

Click: Login Button
```

### اگر Dashboard لود ہو تو ✅ SUCCESS!

---

## 🎯 STEP 12: Features Test کریں

### تینوں features کو test کریں:

#### 1️⃣ Employees
```
Click: "Add Employees" (Users icon)
Click: "Add New Employee" button
Fill: Name, Email, Department
Click: Save
Expected: Employee appears in list ✅
```

#### 2️⃣ Departments
```
Click: "Departments" (Building icon)
Click: "Create Department" button
Fill: Name, Custom Fields
Click: Save
Expected: Department appears in list ✅
```

#### 3️⃣ Tasks
```
Click: "Assign Tasks" (CheckSquare icon)
Click: "Create Task" button
Fill: Title, Employee, Priority, Date
Click: Save
Expected: Task appears in list ✅
```

### اگر تینوں کام کریں تو:

# 🎉 YOUR SYSTEM IS LIVE!

---

## 📊 Verify کریں Database ہے اور کام کر رہی ہے

### Hostinger server میں:

```bash
# Database location:
ls -la apps/pocketbase/pb_data/

# Expected:
# data.db         (Main database)
# logs/           (Logs folder)
# storage/        (File storage)

# Collections check کریں:
curl http://localhost:8090/api/collections

# Expected: Users, Departments, Tasks collections
```

---

## 🔄 اگر کوئی Issue ہو تو Restart کریں

### Hostinger server میں:

```bash
# PocketBase کو restart کریں:
pkill pocketbase

# Verify kill ہوا:
ps aux | grep pocketbase
# Should show nothing

# دوبارہ start کریں:
cd apps/pocketbase
nohup ./pocketbase serve --http=0.0.0.0:8090 > pocketbase.log 2>&1 &

# Check status:
curl http://localhost:8090/api/health
```

---

## 📝 Important: .env Files کو GIT سے Protect کریں

### Local computer میں:

```powershell
# Add to .gitignore:
echo ".env*" >> .gitignore
echo "pb_data/" >> .gitignore
echo "node_modules/" >> .gitignore

# Commit:
git add .gitignore
git commit -m "Add gitignore for secrets"
git push origin main
```

---

## 🆘 Common Issues اور Solutions

### ❌ "SSH connection refused"

```bash
# Check SSH enabled ہے Hostinger میں:
# 1. Hostinger Control Panel → Advanced → SSH/Shell Access
# 2. Check: SSH is enabled
# 3. Verify username and password

# Try again:
ssh user@schoolmanager.com
```

### ❌ "bash: deploy.sh: command not found"

```bash
# Check file exists:
ls -la deploy.sh

# Make executable:
chmod +x deploy.sh

# Try again:
bash deploy.sh
```

### ❌ "npm: command not found"

```bash
# Check Node.js:
node --version

# If not found, ask Hostinger to install Node.js
# Or use this:
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### ❌ "Cannot connect to https://schoolmanager.com"

```bash
# Check PocketBase:
curl http://localhost:8090/api/health

# Check Nginx:
ps aux | grep nginx

# Check domain DNS:
nslookup schoolmanager.com

# If all OK, wait 5-10 minutes for DNS propagation
```

### ❌ "Login doesn't work"

```bash
# Check if admin users exist:
curl http://localhost:8090/api/collections/users/records

# If empty, run deploy.sh again
bash deploy.sh

# Or manually seed:
# Go to: https://schoolmanager.com/_/
# Add user via admin panel
```

---

## 📋 COMPLETE CHECKLIST

- [ ] Hostinger account ready
- [ ] Domain pointing to Hostinger
- [ ] SSH access working
- [ ] Local .env.production created
- [ ] Local apps/pocketbase/.env configured
- [ ] Code pushed to Git
- [ ] SSH connected to server
- [ ] app folder created
- [ ] Code cloned/uploaded
- [ ] .env created on server
- [ ] deploy.sh executed
- [ ] PocketBase health check passed ✅
- [ ] https://yourdomain.com loads ✅
- [ ] Login works ✅
- [ ] Employee feature works ✅
- [ ] Departments feature works ✅
- [ ] Tasks feature works ✅
- [ ] Database backup created ✅

---

## ⏱️ Timeline

| Step | Command | Time |
|------|---------|------|
| 1 | cd + ls | 1 min |
| 2 | Decide values | 2 min |
| 3 | Create .env files | 5 min |
| 4 | git push | 5 min |
| 5 | ssh connect | 2 min |
| 6 | cd + mkdir + clone | 5 min |
| 7 | cat > .env | 2 min |
| 8 | bash deploy.sh | 10 min |
| 9 | curl health check | 1 min |
| 10 | Browser test | 2 min |
| 11 | Login + features test | 5 min |
| **Total** | - | **~40 min** ✅ |

---

## 💡 Tips

```
✅ Copy-paste سے typing errors نہیں ہوں گی
✅ ہر step verify کریں پھر اگلا کریں
✅ Logs دیکھیں: tail -f apps/pocketbase/pocketbase.log
✅ PocketBase restart: pkill pocketbase
✅ Database location: apps/pocketbase/pb_data/

⚠️ IMPORTANT:
✅ .env files پر GitHub expose نہ ہوں
✅ Passwords safe رکھیں
✅ Regular backups لیں
✅ Logs monitor کریں
```

---

## 🎯 FINAL: اگر سب OK ہے تو

```
✅ https://yourdomain.com کھولا
✅ Login page دیکھا
✅ manager@company.com سے logged in
✅ Dashboard load ہوا
✅ Employee add کیا
✅ Department بنایا
✅ Task assign کیا
✅ تمام features کام کیے

🎉 CONGRATULATIONS! SYSTEM LIVE ہے!
```

---

## 📞 Next Steps

```
1. Use کریں - System استعمال کریں
2. Monitor - Logs دیکھتے رہیں
3. Backup - Regular backups لیں
4. Update - Code updates پر redeploy کریں
5. Customize - اپنی ضروریات کے مطابق customize کریں
```

---

**Ready?** چلیں deployment کریں! 🚀

ہر step کو carefully اور ترتیب سے کریں۔ 
اگر کوئی issue ہو تو logs دیکھیں یا COMPLETE_DEPLOYMENT_GUIDE.md پڑھیں۔

**آپ کر سکتے ہو!** 💪
