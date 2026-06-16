const express = require("express");
const cors = require("cors");
const path = require("path");

// Import database (this will test connection)
const db = require("./db");

// Import route modules
const customerRoutes = require("./routes/customers");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 8081;

// ================================
// MIDDLEWARE
// ================================
app.use(cors({
  origin: "*", // Allow all origins (restrict in production)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ================================
// ROOT TEST ENDPOINT
// ================================
app.get("/", (req, res) => {
  console.log("[✓] Root endpoint accessed");
  res.json({
    status: "success",
    message: "Backend Running",
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// ================================
// API TEST ENDPOINT
// ================================
app.get("/api/test", (req, res) => {
  console.log("[✓] API test endpoint accessed");
  res.json({
    message: "API Working",
    endpoints: {
      customers: "GET /api/customers",
      products: "GET /api/products",
      orders: "GET /api/orders",
      payments: "GET /api/payments",
      dashboard: "GET /api/dashboard"
    }
  });
});

// ================================
// API ROUTES - Both with and without /api prefix
// ================================
// Root level routes (as per requirement)
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard", dashboardRoutes);

// Also available with /api prefix for compatibility
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ================================
// 404 HANDLER
// ================================
app.use((req, res) => {
  console.log(`[✗] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// ================================
// ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error("[✗] Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// ================================
// START SERVER
// ================================
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║   🚀 Server running on port ${PORT}       ║`);
  console.log(`║   📍 http://localhost:${PORT}                ║`);
  console.log(`║   🔗 API: http://localhost:${PORT}/api        ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});

module.exports = app;