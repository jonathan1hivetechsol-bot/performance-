# 🚀 HOSTINGER UPLOAD - EXACT STEPS

## ✅ Build Complete! Here's your UPLOAD PACKAGE

Your files are ready in: `c:\Users\Futur\Downloads\horizons-export-945a9ac3-86d1-4391-91a3-db16b6b4c9d0\apps\web\dist`

---

## 📦 WHAT TO UPLOAD (Files from dist folder)

```
dist/
├── index.html            ← Upload this
├── .htaccess             ← Upload this (for API routing)
└── assets/               ← Upload entire folder
    ├── index-CsoA0btb.css
    ├── index.es-Cii5F5fg.js
    ├── jspdf.es.min-C8IJVTD_.js
    ├── xlsx-CNerDvZX.js
    └── [other files]
```

---

## 🎯 3 EASY STEPS

### STEP 1: Go to Hostinger File Manager
- Open Hostinger Control Panel
- Click **File Manager**
- Navigate to **public_html**

### STEP 2: DELETE OLD FILES (But NOT PocketBase folder!)
```
❌ DELETE THESE:
  - index.html (old)
  - assets/ (old)
  
✅ DO NOT DELETE:
  - pocketbase/ folder
  - apps/ folder (with pocketbase)
  - .env files
```

### STEP 3: UPLOAD NEW FILES from `dist/` folder
```
Copy FROM your laptop:
  c:\Users\Futur\...\apps\web\dist\

Copy TO Hostinger public_html:
  ✓ index.html
  ✓ .htaccess
  ✓ assets/ folder (entire)
```

### ✅ Result should be:
```
public_html/
├── index.html          (✅ FRESH - just uploaded)
├── .htaccess           (✅ FRESH - with API proxy)
├── assets/             (✅ FRESH - new build)
│   ├── index-CsoA0btb.css
│   ├── index.es-Cii5F5fg.js
│   └── ...
│
├── pocketbase/         (❌ KEEP - your backend)
├── apps/               (❌ KEEP - with pocketbase)
│
└── [other old files]   (can delete or keep)
```

---

## 🧠 WHY EACH FILE?

| File | What it does |
|------|-------------|
| `index.html` | Main page that loads your app |
| `.htaccess` | Routes API calls to PocketBase on port 8090 |
| `assets/` | Images, CSS, JavaScript bundles |

---

## ✅ VERIFICATION (After Upload)

1. Go to browser: `https://indigo-hedgehog-642620.hostingersite.com/`
2. Should see **Login page** ✅
3. Enter: `manager@company.com` / `Manager123!`
4. Should see **Dashboard** ✅

If you see error like "Cannot reach API":
- Check if PocketBase is running on Hostinger
- Command: `curl http://127.0.0.1:8090/api/health`

---

## 📝 SUMMARY

```
What you built:   dist/ folder (1,950 KB total)
Where it is:      c:\Users\Futur\...\apps\web\dist
What to upload:   Everything inside dist/
Where to put it:  Hostinger public_html/
Will take:        2-3 minutes to upload
```

**Ready to upload!** 🚀

---

## 🆘 If Something Goes Wrong

1. **"Cannot GET /"** → Check if index.html uploaded
2. **"Cannot read API"** → Check if .htaccess uploaded (proxy rules)
3. **"Login doesn't work"** → PocketBase might not be running
   ```bash
   # SSH to Hostinger and check:
   curl http://127.0.0.1:8090/api/health
   ```
4. **"Assets not loading"** → Check if assets/ folder uploaded

---

**Next Step: Upload files to Hostinger now!** ✅
