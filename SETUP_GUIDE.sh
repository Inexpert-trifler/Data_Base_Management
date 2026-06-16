#!/bin/bash
# Setup and Test Script for Grocery Management System
# Run this script to set up and test the entire system

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Grocery Management System - Setup & Test Guide        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 PRE-FLIGHT CHECKLIST${NC}"
echo "================================"
echo ""

# 1. Check if MySQL is running
echo -e "${YELLOW}[1/5] Checking MySQL Connection...${NC}"
if mysql -u root -proot123 -h localhost -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓ MySQL is running${NC}"
else
    echo -e "${RED}✗ MySQL is NOT running${NC}"
    echo -e "   ${YELLOW}→ Start MySQL with: docker-compose up -d${NC}"
    exit 1
fi

# 2. Check if database exists
echo -e "${YELLOW}[2/5] Checking Database...${NC}"
if mysql -u root -proot123 -h localhost -e "USE grocery_management;" &> /dev/null; then
    echo -e "${GREEN}✓ Database 'grocery_management' exists${NC}"
else
    echo -e "${RED}✗ Database 'grocery_management' NOT found${NC}"
    exit 1
fi

# 3. Check required tables
echo -e "${YELLOW}[3/5] Checking Database Tables...${NC}"
TABLES=$(mysql -u root -proot123 grocery_management -e "SHOW TABLES;" 2>/dev/null)
if [[ $TABLES == *"Customer"* ]] && [[ $TABLES == *"Product"* ]] && [[ $TABLES == *"Orders"* ]]; then
    echo -e "${GREEN}✓ All required tables exist${NC}"
    echo "  Tables: Customer, Product, Orders, Payment"
else
    echo -e "${RED}✗ Missing required tables${NC}"
    exit 1
fi

# 4. Check Node.js installation
echo -e "${YELLOW}[4/5] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js NOT installed${NC}"
    exit 1
fi

# 5. Check npm installation
echo -e "${YELLOW}[5/5] Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm NOT installed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 INSTALLATION STEPS${NC}"
echo "================================"
echo ""

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}🚀 RUNNING THE SYSTEM${NC}"
echo "================================"
echo ""

# Start backend server
echo -e "${YELLOW}Starting backend server...${NC}"
echo "  $ cd backend && npm run dev"
echo ""
echo "  The server will run on: http://localhost:5000"
echo "  API endpoints will be available at: http://localhost:5000/api"
echo ""

# Instructions for running frontend
echo -e "${BLUE}📱 ACCESSING THE FRONTEND${NC}"
echo "================================"
echo ""
echo "Option 1: Using Live Server (VS Code Extension)"
echo "  1. Open /frontend/index.html in VS Code"
echo "  2. Right-click and select 'Open with Live Server'"
echo "  3. Browser will open at: http://127.0.0.1:5500/frontend/index.html"
echo ""
echo "Option 2: Using Python HTTP Server"
echo "  $ cd frontend"
echo "  $ python3 -m http.server 5500"
echo "  Then open: http://localhost:5500/index.html"
echo ""

echo -e "${BLUE}🧪 TESTING THE APIs${NC}"
echo "================================"
echo ""
echo "Test Routes (curl commands):"
echo ""
echo "1. Root Health Check:"
echo "   ${YELLOW}curl http://localhost:5000/${NC}"
echo ""
echo "2. API Test Endpoint:"
echo "   ${YELLOW}curl http://localhost:5000/api/test${NC}"
echo ""
echo "3. Get All Customers:"
echo "   ${YELLOW}curl http://localhost:5000/api/customers${NC}"
echo ""
echo "4. Get All Products:"
echo "   ${YELLOW}curl http://localhost:5000/api/products${NC}"
echo ""
echo "5. Get All Orders:"
echo "   ${YELLOW}curl http://localhost:5000/api/orders${NC}"
echo ""
echo "6. Get All Payments:"
echo "   ${YELLOW}curl http://localhost:5000/api/payments${NC}"
echo ""
echo "7. Get Dashboard Data:"
echo "   ${YELLOW}curl http://localhost:5000/api/dashboard${NC}"
echo ""

echo -e "${BLUE}✅ FINAL CHECKLIST${NC}"
echo "================================"
echo ""
echo "After starting the server and frontend:"
echo "  [ ] Backend console shows: '✓ MySQL Connected successfully'"
echo "  [ ] Frontend loads without 403 errors"
echo "  [ ] Dashboard shows data from MySQL"
echo "  [ ] Customers page shows customers list"
echo "  [ ] Products page shows products list"
echo "  [ ] Orders page shows orders list"
echo "  [ ] Payments page shows payments list"
echo ""

echo -e "${GREEN}Setup guide complete!${NC}"
