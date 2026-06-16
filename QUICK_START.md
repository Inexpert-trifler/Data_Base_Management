# 🚀 QUICK START GUIDE - Grocery Management System

## ⚡ 30-Second Setup

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Frontend (choose one)
# Option A: Using Python
cd frontend
python3 -m http.server 5500

# Option B: Using VS Code Live Server
# Right-click frontend/index.html → "Open with Live Server"
```

## 📍 Access URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Dashboard | `http://127.0.0.1:5500/frontend/index.html` | Main UI |
| API Root | `http://localhost:5000/` | Health check |
| API Test | `http://localhost:5000/api/test` | API status |

---

## ✅ Verification Commands

Copy and paste each command to verify everything works:

### 1️⃣ Backend Health Check
```bash
curl http://localhost:5000/
```
**Expected**: `{"status":"success","message":"Backend Running"}`

### 2️⃣ API Status
```bash
curl http://localhost:5000/api/test
```
**Expected**: List of endpoints

### 3️⃣ Get Customers
```bash
curl http://localhost:5000/api/customers
```
**Expected**: Array of customer objects

### 4️⃣ Get Products
```bash
curl http://localhost:5000/api/products
```
**Expected**: Array of product objects

### 5️⃣ Get Orders
```bash
curl http://localhost:5000/api/orders
```
**Expected**: Array of order objects

### 6️⃣ Get Payments
```bash
curl http://localhost:5000/api/payments
```
**Expected**: Array of payment objects

### 7️⃣ Dashboard Stats
```bash
curl http://localhost:5000/api/dashboard
```
**Expected**: Statistics object

---

## 📋 What Was Fixed

✅ API_BASE_URL: 3000 → 5000  
✅ Database Connection: Callback → Promise  
✅ Server Routes: Missing → All endpoints  
✅ CORS: Not configured → Configured  
✅ Error Handling: None → Complete  
✅ Logging: Missing → Implemented  
✅ Test Routes: Missing → Added  
✅ Duplicate Files: /server/server.js → Removed  

---

## 🎯 Expected Results

When you access the frontend at `http://127.0.0.1:5500/frontend/index.html`:

- ✅ Dashboard loads without errors
- ✅ Statistics display live MySQL data
- ✅ Customers page shows customer list
- ✅ Products page shows product inventory
- ✅ Orders page shows orders from database
- ✅ Payments page shows payment records
- ✅ No 403 errors
- ✅ No CORS errors
- ✅ All data from MySQL database

---

## 🚨 Common Issues & Fixes

| Error | Solution |
|-------|----------|
| "Cannot GET /" | Backend not running on port 5000 |
| "404 on /api/customers" | Check server console for route loading |
| "Connection refused" | MySQL not running or wrong port |
| CORS Error | Server.js CORS already configured |
| "Cannot find module" | Run `npm install` in backend folder |

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| backend/server.js | Express server | ✅ Fixed |
| backend/db.js | MySQL connection | ✅ Fixed |
| frontend/js/app.js | Config & helpers | ✅ Fixed |
| backend/routes/*.js | API endpoints | ✅ Working |
| backend/package.json | Dependencies | ✅ Updated |

---

## 📊 File Structure

```
DBMS-Project/
├── backend/
│   ├── server.js ✅
│   ├── db.js ✅
│   ├── package.json ✅
│   └── routes/
│       ├── customers.js
│       ├── products.js
│       ├── orders.js
│       ├── payments.js
│       └── dashboard.js
├── frontend/
│   ├── index.html
│   ├── customers.html
│   ├── products.html
│   ├── orders.html
│   ├── payments.html
│   └── js/
│       ├── app.js ✅
│       ├── api.js ✅
│       └── [page files]
├── README.md ✅
├── CHANGES.md ✅
└── VERIFICATION.md ✅
```

---

## 🎓 How It Works

1. **Frontend** sends API requests to `http://localhost:5000/api`
2. **Backend** Express server listens on port 5000
3. **Routes** in `/routes/` handle each resource
4. **Database** mysql2/promise fetches live data
5. **Frontend** displays data in tables/cards

---

## ⏱️ Typical Session

```bash
# T=0min: Open 2 terminals

# Terminal 1: Start backend
cd ~/Documents/DBMS-Project/backend
npm run dev
# Waits for "✓ MySQL Connected successfully"

# Terminal 2: Start frontend
cd ~/Documents/DBMS-Project/frontend
python3 -m http.server 5500

# T=1min: Open browser
# Navigate to: http://127.0.0.1:5500/frontend/index.html
# See live data from MySQL ✅

# T=N mins: Develop & test
# Make changes to code
# Browser auto-refreshes with Live Server
# Backend auto-restarts with nodemon
```

---

## 🔧 Development

### Backend Changes
```bash
# Edit: backend/server.js or routes/*.js
# Save file → Server auto-restarts via nodemon
# Test with: curl http://localhost:5000/api/[endpoint]
```

### Frontend Changes
```bash
# Edit: frontend/js/*.js or frontend/*.html
# Save file → Browser auto-refreshes
# Check console (F12) for errors
```

### Database Changes
```bash
# Connect to MySQL:
mysql -u root -proot123 grocery_management

# Example queries:
SELECT * FROM Customer;
SELECT * FROM Product;
SELECT * FROM Orders;
SELECT * FROM Payment;
```

---

## 📈 Next Steps

1. ✅ Verify backend starts
2. ✅ Verify MySQL connection
3. ✅ Test all API endpoints with curl
4. ✅ Open frontend in browser
5. ✅ Verify all pages load and display data
6. ✅ Check browser console for errors
7. ✅ Test search/filter features
8. ✅ Test add/edit/delete (if implemented in frontend)

---

## 📞 Need Help?

Check these in order:
1. Browser Console (F12) for JavaScript errors
2. Backend Terminal for database/API errors
3. README.md for detailed docs
4. CHANGES.md for what was modified
5. VERIFICATION.md for complete checklist

---

## ✨ Success!

When you see:
- ✅ Backend: "✓ MySQL Connected successfully"
- ✅ Frontend: Dashboard with live data
- ✅ No errors in console

**You're done!** System is fully operational. 🎉

---

**Quick Commands Reference**
```
Start Backend:       cd backend && npm run dev
Start Frontend:      cd frontend && python3 -m http.server 5500
Test API:            curl http://localhost:5000/api/customers
Open UI:             http://127.0.0.1:5500/frontend/index.html
```
