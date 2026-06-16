// ========================================
// Grocery Management System – Shared App Logic
// ========================================

const API_BASE_URL = 'http://localhost:8081';

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
  '#10b981', '#14b8a6', '#3b82f6', '#f97316', '#06b6d4'
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Sidebar Toggle ──
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }
}

// ── Toast Notifications ──
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast-custom ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.add('hiding'); setTimeout(() => this.parentElement.remove(), 300);">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Generate Sidebar HTML ──
function getSidebarHTML(activePage) {
  const menuItems = [
    { page: 'index.html',     icon: 'fa-th-large',      label: 'Dashboard' },
    { page: 'customers.html', icon: 'fa-users',          label: 'Customers' },
    { page: 'products.html',  icon: 'fa-boxes',          label: 'Products' },
    { page: 'orders.html',    icon: 'fa-shopping-cart',  label: 'Orders' },
    { page: 'payments.html',  icon: 'fa-credit-card',    label: 'Payments' },
  ];

  return `
    <div class="sidebar-brand">
      <div class="brand-icon"><i class="fas fa-leaf"></i></div>
      <div class="brand-text">
        <h5>GroceryPro</h5>
        <span>Management System</span>
      </div>
    </div>
    <nav class="sidebar-menu">
      <div class="menu-label">Main Menu</div>
      ${menuItems.map(item => `
        <div class="nav-item">
          <a href="${item.page}" class="nav-link ${activePage === item.page ? 'active' : ''}">
            <i class="fas ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        </div>
      `).join('')}
      <div class="menu-label" style="margin-top: 20px;">Settings</div>
      <div class="nav-item">
        <a href="#" class="nav-link"><i class="fas fa-cog"></i><span>Settings</span></a>
      </div>
      <div class="nav-item">
        <a href="#" class="nav-link"><i class="fas fa-question-circle"></i><span>Help Center</span></a>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">SY</div>
        <div class="user-details">
          <p>Saransh Yadav</p>
          <span>Admin</span>
        </div>
      </div>
    </div>
  `;
}

// ── Generate Header HTML ──
function getHeaderHTML(title, highlight) {
  return `
    <div class="header-left">
      <button class="btn-sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></button>
      <h1 class="page-title">${title} <span>${highlight}</span></h1>
    </div>
    <div class="header-right">
      <div class="header-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search anything..." id="globalSearch">
      </div>
      <button class="header-icon-btn"><i class="fas fa-bell"></i><span class="notification-dot"></span></button>
      <button class="header-icon-btn"><i class="fas fa-expand"></i></button>
    </div>
  `;
}

// ── Init App ──
function initApp(activePage, title, highlight) {
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('topHeader');

  if (sidebar) sidebar.innerHTML = getSidebarHTML(activePage);
  if (header) header.innerHTML = getHeaderHTML(title, highlight);

  initSidebar();
}
