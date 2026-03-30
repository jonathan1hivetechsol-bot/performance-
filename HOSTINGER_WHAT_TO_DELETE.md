# 🗑️ HOSTINGER - WHAT TO DELETE (Files/Folders to Remove)

> **IMPORTANT:** Only delete OLD frontend files, NOT your PocketBase backend!

---

## ✅ SAFE TO DELETE (OLD Frontend Files)

On Hostinger in `public_html/` folder, DELETE these ONLY if they exist and are old:

```
❌ DELETE THESE (OLD FILES):

1. index.html                    (old single file)
2. assets/                       (old assets folder)
   - *.js files inside
   - *.css files inside
3. favicon.ico                   (if old)
4. .vite/                        (cache folder - safe to delete)
5. manifest.json                 (if old)
```

---

## ❌ DO NOT DELETE THESE (Your Backend!)

```
✅ KEEP THESE (PocketBase - Your Database!):

1. pocketbase/                   (YOUR BACKEND - CRITICAL!)
   └── pocketbase (binary)
   └── pb_data/                  (YOUR DATABASE!)
   └── .env                       (YOUR SETTINGS!)
   
2. apps/pocketbase/              (if in separate folder)
   └── .env
   └── pb_data/

3. .env files                    (any .env files - have passwords!)

4. pb_data/                      (THIS IS YOUR DATABASE!)
```

---

## 📋 CHECKLIST: Before and After Upload

### ❌ BEFORE Uploading New dist/ Files:

- [ ] Navigate to Hostinger public_html/
- [ ] Delete old `index.html` file (if exists)
- [ ] Delete old `assets/` folder completely
- [ ] Check: `pocketbase/` folder still exists ✅
- [ ] Check: `pb_data/` folder (database) still exists ✅
- [ ] Check: `.env` file still exists ✅

### ✅ AFTER Uploading New dist/ Files:

Open Hostinger File Manager and verify:
```
public_html/
├── index.html                  ✅ NEW (just uploaded)
├── .htaccess                   ✅ NEW (just uploaded)
├── assets/                     ✅ NEW (just uploaded)
│   ├── index-CsoA0btb.css
│   ├── index.es-Cii5F5fg.js
│   ├── jspdf.es.min-C8IJVTD_.js
│   ├── xlsx-CNerDvZX.js
│   └── purify.es-DrLDRNlj.js
│
├── pocketbase/                 ✅ ORIGINAL (NOT deleted)
│   ├── pocketbase (binary)
│   ├── pb_data/
│   │   └── data.db (YOUR DATA!)
│   └── .env
│
└── [other folders you created]
```

---

## 🎯 Summary

| What | Before Upload | After Upload | Status |
|-----|---|---|---|
| `index.html` | ❌ Delete old | ✅ Upload new | Replace |
| `assets/` | ❌ Delete old | ✅ Upload new | Replace |
| `pocketbase/` | ✅ Keep | ✅ Keep | Never delete |
| `pb_data/` | ✅ Keep | ✅ Keep | Your database! |
| `.htaccess` | ❓ Maybe old | ✅ Upload new | Replace |

---

## ⚠️ CRITICAL REMINDER

```
DO NOT DELETE:
  
  pb_data/ folder
  ↓
  This contains all your data!
  ↓
  Deleting it = LOSING ALL DATA
```

**Be very careful which folder you delete!**

---

## 🔍 How to Verify You Deleted Correctly

After deleting old files, check in Hostinger File Manager:

```bash
# List files in public_html:
# You should see:
  ✅ pocketbase/          (backend still there)
  ✅ pb_data/             (database still there)
  ✅ [old index.html deleted]
  ✅ [old assets/ deleted]
  ✅ Ready to upload new files
```

---

## 🚀 Next Step

1. Delete old files (with caution!)
2. Upload new `dist/` folder contents
3. Verify in browser: `https://indigo-hedgehog-642620.hostingersite.com/`

**Proceed carefully!** The database cannot be recovered if deleted. ⚠️
