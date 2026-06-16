# Grocery Management System - Complete Setup Guide

## 📋 Overview

This is a full-stack Grocery Management System with:
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Backend**: Node.js + Express.js REST API
- **Database**: MySQL (Docker)

## 🔧 Issues Fixed

### 1. **API_BASE_URL Mismatch** ✓
   - **Problem**: Frontend was pointing to `http://localhost:3000/api` but backend runs on port 5000
   - **Solution**: Updated `frontend/js/app.js` to use `http://localhost:5000/api`

### 2. **Missing API Endpoints** ✓
   - **Problem**: Backend only had `/customers` route without `/api` prefix
   - **Solution**: Rewrote `backend/server.js` with all endpoints:
     - GET `/api/customers` - List all customers
     - GET `/api/products` - List all products
     - GET `/api/orders` - List all orders
     - GET `/api/payments` - List all payments
     - GET `/api/dashboard` - Dashboard statistics

### 3. **Database Connection** ✓
   - **Problem**: Using callback-based mysql2 module
   - **Solution**: Switched to `mysql2/promise` with connection pooling in `backend/db.js`

### 4. **CORS Configuration** ✓
   - **Problem**: CORS not properly configured
   - **Solution**: Added proper CORS middleware in `backend/server.js`

### 5. **Error Handling** ✓
   - **Problem**: No error handling or logging
   - **Solution**: Added comprehensive error handling and console logging throughout

### 6. **Project Structure** ✓
   - **Problem**: Duplicate `server.js` in `/server` directory
   - **Solution**: Removed `/server` directory

### 7. **Package Scripts** ✓
   - **Problem**: No `start` or `dev` commands
   - **Solution**: Added scripts in `backend/package.json`:
     - `npm start` - Run production server
     - `npm run dev` - Run with nodemon (auto-reload)

### 8. **Test Routes** ✓
   - **Problem**: No way to verify backend is running
   - **Solution**: Added test routes:
     - GET `/` - Root health check
     - GET `/api/test` - API test endpoint

---

## 📁 Final Project Structure

```
DBMS-Project/
├── backend/
│   ├── server.js              # Main Express server
│   ├── db.js                  # MySQL connection pool
│   ├── package.json           # Dependencies & scripts
│   ├── routes/
│   │   ├── customers.js       # Customer API routes
│   │   ├── products.js        # Product API routes
│   │   ├── orders.js          # Order API routes
│   │   ├── payments.js        # Payment API routes
│   │   └── dashboard.js       # Dashboard API routes
│   └── node_modules/          # (Generated after npm install)
│
├── frontend/
│   ├── index.html             # Dashboard page
│   ├── customers.html         # Customers page
│   ├── products.html          # Products page
│   ├── orders.html            # Orders page
│   ├── payments.html          # Payments page
│   ├── css/
│   │   └── style.css          # All styles
│   └── js/
│       ├── app.js             # Shared logic & API_BASE_URL
│       ├── api.js             # API helper (optional)
│       ├── dashboard.js       # Dashboard page logic
│       ├── customers.js       # Customers page logic
│       ├── products.js        # Products page logic
│       ├── orders.js          # Orders page logic
│       └── payments.js        # Payments page logic
│
├── SETUP_GUIDE.sh             # Setup script
├── README.md                  # This file
└── package.json               # Root package.json
```

---

## ⚙️ Prerequisites

1. **MySQL Database** (Docker)
   ```bash
   # If using Docker Compose
   docker-compose up -d
   
   # Or manually with Docker
   docker run -d \
     -e MYSQL_ROOT_PASSWORD=root123 \
     -e MYSQL_DATABASE=grocery_management \
     -p 3306:3306 \
     mysql:8.0
   ```

2. **Node.js & npm**
   - Download from [nodejs.org](https://nodejs.org)
   - Verify: `node -v` and `npm -v`

3. **Database Schema**
   - Ensure these tables exist in `grocery_management` database:
     - `Customer`
     - `Product`
     - `Orders`
     - `Payment`

---

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Expected output:
```
✓ MySQL Connected successfully
╔════════════════════════════════════════╗
║   🚀 Server running on port 5000       ║
║   📍 http://localhost:5000             ║
║   🔗 API: http://localhost:5000/api    ║
╚════════════════════════════════════════╝
```

### Step 3: Start Frontend
**Option A: Using VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"
4. Opens automatically at `http://127.0.0.1:5500/frontend/index.html`

**Option B: Using Python HTTP Server**
```bash
cd frontend
python3 -m http.server 5500
```
Then open: `http://localhost:5500/index.html`

---

## 🧪 Testing API Endpoints

### Test Root Endpoint
```bash
curl http://localhost:5000/
```
Response:
```json
{
  "status": "success",
  "message": "Backend Running",
  "timestamp": "2024-06-16T10:30:00.000Z",
  "port": 5000
}
```

### Test API Endpoint
```bash
curl http://localhost:5000/api/test
```
Response:
```json
{
  "message": "API Working",
  "endpoints": {
    "customers": "GET /api/customers",
    "products": "GET /api/products",
    "orders": "GET /api/orders",
    "payments": "GET /api/payments",
    "dashboard": "GET /api/dashboard"
  }
}
```

### Get Customers
```bash
curl http://localhost:5000/api/customers
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get Orders
```bash
curl http://localhost:5000/api/orders
```

### Get Payments
```bash
curl http://localhost:5000/api/payments
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/dashboard
```

---

## 📊 Database Schema Reference

### Customer Table
```sql
SELECT * FROM Customer;
-- Fields: customer_id, name, email, phone, address, status, joinDate, totalOrders, totalSpent
```

### Product Table
```sql
SELECT * FROM Product;
-- Fields: product_id, product_name, category, price, stock, supplier_id, sku
```

### Orders Table
```sql
SELECT * FROM Orders;
-- Fields: order_id, customer_id, order_date, status, total, items
```

### Payment Table
```sql
SELECT * FROM Payment;
-- Fields: payment_id, order_id, amount, payment_method, payment_date, transactionId
```

---

## 🔍 Troubleshooting

### Issue: "Cannot GET /api/customers" (404)
**Solution**: 
- Check backend is running on port 5000
- Verify MySQL is running and connected
- Check tables exist in database

### Issue: "Connection refused" on port 5000
**Solution**:
- Backend server not started
- Run: `cd backend && npm run dev`

### Issue: HTTP 403 Forbidden
**Solution**:
- CORS issue fixed in new server.js
- Clear browser cache
- Try incognito/private window

### Issue: "Cannot find module mysql2"
**Solution**:
```bash
cd backend
npm install mysql2
```

### Issue: MySQL Connection Failed
**Solution**:
- Verify MySQL is running: `mysql -u root -proot123 -h localhost -e "SELECT 1;"`
- Check credentials in `backend/db.js`
- Verify database exists: `mysql -u root -proot123 -e "SHOW DATABASES;"`

---

## 📝 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

#### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

#### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

---

## 🔐 Security Notes

⚠️ **Current Configuration is for Development Only**

For production:
1. Change CORS origin from `*` to specific domain
2. Move credentials to environment variables
3. Add input validation and sanitization
4. Add authentication (JWT)
5. Use HTTPS
6. Add rate limiting

---

## 📚 Frontend JavaScript Files

### app.js
- Defines `API_BASE_URL = 'http://localhost:5000/api'`
- Contains helper functions: `formatCurrency()`, `formatDate()`, `getAvatarColor()`, etc.
- Manages sidebar, toast notifications, header

### dashboard.js
- Fetches dashboard statistics
- Displays recent orders and activities

### customers.js
- Fetches and displays customer list
- Search and filter functionality
- Add/Edit/Delete customer modals

### products.js
- Fetches and displays product inventory
- Stock level indicators
- Category filtering

### orders.js
- Fetches and displays orders
- Requires customers for dropdown
- Status tracking

### payments.js
- Fetches and displays payments
- Links to orders
- Payment method tracking

### api.js (Optional)
- Centralized API helper for future use
- Reusable CRUD methods
- Error handling and logging

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend shows "✓ MySQL Connected successfully"
- [ ] `http://localhost:5000/` returns success message
- [ ] `http://localhost:5000/api/test` returns API status
- [ ] Frontend loads without console errors
- [ ] Dashboard displays data from MySQL
- [ ] Customers page shows customer list
- [ ] Products page shows product inventory
- [ ] Orders page shows orders list
- [ ] Payments page shows payments list
- [ ] No 403 errors in console
- [ ] No CORS errors in console

---

## 📞 Support

If you encounter issues:
1. Check error messages in browser console (F12)
2. Check backend terminal for error logs
3. Verify MySQL is running
4. Verify database connection credentials
5. Clear browser cache

---

## 🎉 You're All Set!

Your Grocery Management System is now ready to use. Start the backend with:

```bash
cd backend && npm run dev
```

Then access the frontend at:
```
http://127.0.0.1:5500/frontend/index.html
```

Enjoy! 🚀
