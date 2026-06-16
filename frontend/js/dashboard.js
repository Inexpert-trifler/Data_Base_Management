// ========================================
// Dashboard Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp('index.html', 'Dashboard', 'Overview');
  fetchDashboardData();
});

async function fetchDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    
    const data = await response.json();
    
    // Update Stats
    document.getElementById('statRevenue').textContent = formatCurrency(data.totalRevenue);
    document.getElementById('statOrders').textContent = data.totalOrders;
    document.getElementById('statCustomers').textContent = data.totalCustomers;
    document.getElementById('statProducts').textContent = data.totalProducts;
    
    // Render Recent Orders
    renderRecentOrders(data.recentOrders || []);
    
    // Mock recent activity and top products as they aren't part of standard endpoints in this scope
    // But they could easily be added to the backend API later.
    renderRecentActivity();
    renderTopProducts();
    
  } catch (err) {
    console.error(err);
    showToast('Error loading dashboard data', 'error');
  }
}

function renderRecentOrders(recent) {
  const container = document.getElementById('recentOrdersBody');

  if (!recent || recent.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="text-center">No recent orders</td></tr>`;
    return;
  }

  container.innerHTML = recent.map(order => `
    <tr>
      <td><span style="font-weight: 600; color: var(--accent-indigo);">ORD-${order.id}</span></td>
      <td>
        <div class="customer-info">
          <div class="customer-avatar" style="background: ${getAvatarColor(order.customerName)}; width: 30px; height: 30px; font-size: 0.7rem;">
            ${getInitials(order.customerName)}
          </div>
          <span>${order.customerName || 'Unknown'}</span>
        </div>
      </td>
      <td>${formatDate(order.date)}</td>
      <td><strong>${formatCurrency(order.total)}</strong></td>
      <td><span class="badge-status ${order.status}">${(order.status || 'unknown').charAt(0).toUpperCase() + (order.status || 'unknown').slice(1)}</span></td>
    </tr>
  `).join('');
}

function renderRecentActivity() {
  const container = document.getElementById('recentActivity');
  const activities = [
    { icon: 'order',    iconClass: 'fa-shopping-cart', text: 'System connected to MySQL Database', time: 'Just now' },
    { icon: 'payment',  iconClass: 'fa-check-circle',  text: 'Dashboard fully migrated to REST APIs', time: '2 mins ago' },
  ];

  container.innerHTML = activities.map(a => `
    <div class="recent-activity-item">
      <div class="activity-icon ${a.icon}"><i class="fas ${a.iconClass}"></i></div>
      <div class="activity-text">
        <p>${a.text}</p>
        <span>${a.time}</span>
      </div>
    </div>
  `).join('');
}

function renderTopProducts() {
  const container = document.getElementById('topProducts');
  const topProds = [
    { name: 'Basmati Rice (5kg)',  category: 'Grains',     sales: 15800, units: 142 },
    { name: 'Amul Milk (1L)',      category: 'Dairy',      sales: 12450, units: 385 }
  ];

  container.innerHTML = topProds.map((p, i) => `
    <div class="top-product-item">
      <div class="top-product-info">
        <div class="top-product-rank">${i + 1}</div>
        <div>
          <div class="top-product-name">${p.name}</div>
          <div class="top-product-category">${p.category}</div>
        </div>
      </div>
      <div class="top-product-sales">
        <div class="amount">${formatCurrency(p.sales)}</div>
        <div class="units">${p.units} sold</div>
      </div>
    </div>
  `).join('');
}
