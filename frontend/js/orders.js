// ========================================
// Orders Page Logic
// ========================================

let orders = [];
let customers = []; // We need customers to populate the dropdown

document.addEventListener('DOMContentLoaded', () => {
  initApp('orders.html', 'Order', 'Management');
  fetchCustomersForDropdown();
  fetchOrders();
});

async function fetchCustomersForDropdown() {
  try {
    console.log('[API] Fetching customers for dropdown from:', `${API_BASE_URL}/customers`);
    const res = await fetch(`${API_BASE_URL}/customers`);
    if (res.ok) {
      customers = await res.json();
      console.log('[API] Customers received:', customers);
      populateOrderCustomerSelect();
    }
  } catch (err) {
    console.error('[ERROR] Failed to load customers for dropdown:', err);
  }
}

function populateOrderCustomerSelect() {
  const select = document.getElementById('orderCustomer');
  select.innerHTML = '<option value="">Select Customer</option>';
  customers.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

async function fetchOrders() {
  try {
    console.log('[API] Fetching orders from:', `${API_BASE_URL}/orders`);
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    orders = await res.json();
    console.log('[API] Orders received:', orders);
    updateOrderStats();
    renderOrders();
  } catch (err) {
    console.error('[ERROR] Failed to fetch orders:', err);
    showToast('Failed to load orders from server', 'error');
  }
}

function updateOrderStats() {
  document.getElementById('statTotalOrders').textContent = orders.length;
  document.getElementById('statDelivered').textContent = orders.filter(o => o.status === 'delivered').length;
  document.getElementById('statPendingOrders').textContent = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  document.getElementById('statOrderRevenue').textContent = formatCurrency(orders.reduce((s, o) => s + parseFloat(o.total), 0));
}

function renderOrders() {
  const search = document.getElementById('searchOrders').value.toLowerCase();
  const statusFilter = document.getElementById('filterOrderStatus').value;
  const paymentFilter = document.getElementById('filterPaymentStatus').value;

  const filtered = orders.filter(o => {
    const matchSearch = String(o.id).toLowerCase().includes(search) || (o.customerName && o.customerName.toLowerCase().includes(search));
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchPayment = !paymentFilter || o.paymentStatus === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const tbody = document.getElementById('ordersTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-shopping-cart"></i><h5>No orders found</h5><p>Try adjusting your search or filters.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td><span style="font-weight:600;color:var(--accent-indigo);">ORD-${o.id}</span></td>
      <td>
        <div class="customer-info">
          <div class="customer-avatar" style="background:${getAvatarColor(o.customerName)};width:30px;height:30px;font-size:0.7rem;">${getInitials(o.customerName)}</div>
          <span>${o.customerName || 'Unknown'}</span>
        </div>
      </td>
      <td>${formatDate(o.date)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.82rem;color:var(--text-secondary);" title="${o.items.join(', ')}">${o.items.length} item${o.items.length > 1 ? 's' : ''}</td>
      <td><strong>${formatCurrency(o.total)}</strong></td>
      <td><span class="badge-status ${o.status}">${(o.status || '').charAt(0).toUpperCase() + (o.status || '').slice(1)}</span></td>
      <td><span class="badge-status ${o.paymentStatus}">${(o.paymentStatus || '').charAt(0).toUpperCase() + (o.paymentStatus || '').slice(1)}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-action view" title="View" onclick="viewOrder(${o.id})"><i class="fas fa-eye"></i></button>
          <button class="btn-action edit" title="Edit Status" onclick="openEditOrderModal(${o.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-action delete" title="Delete" onclick="openDeleteModal(${o.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function viewOrder(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;

  document.getElementById('viewOrderBody').innerHTML = `
    <div style="display:grid;gap:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--border-color);">
        <div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--accent-indigo);">ORD-${o.id}</div>
          <div style="font-size:0.82rem;color:var(--text-muted);">Placed on ${formatDate(o.date)}</div>
        </div>
        <span class="badge-status ${o.status}" style="font-size:0.82rem;">${(o.status || '').charAt(0).toUpperCase() + (o.status || '').slice(1)}</span>
      </div>
      <div>
        <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Customer</label>
        <div class="customer-info" style="margin-top:6px;">
          <div class="customer-avatar" style="background:${getAvatarColor(o.customerName)}">${getInitials(o.customerName)}</div>
          <div><div class="name">${o.customerName || 'Unknown'}</div></div>
        </div>
      </div>
      <div>
        <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">Items Ordered</label>
        <div style="margin-top:8px;">
          ${o.items.map(item => `<div style="padding:6px 0;border-bottom:1px solid var(--border-color);font-size:0.88rem;"><i class="fas fa-box" style="color:var(--accent-green);margin-right:8px;font-size:0.78rem;"></i>${item}</div>`).join('')}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border-color);">
        <div>
          <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">Payment</label>
          <div style="margin-top:4px;"><span class="badge-status ${o.paymentStatus}">${(o.paymentStatus || '').charAt(0).toUpperCase() + (o.paymentStatus || '').slice(1)}</span></div>
        </div>
        <div style="text-align:right;">
          <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">Total Amount</label>
          <div style="font-size:1.3rem;font-weight:800;color:var(--accent-green);margin-top:4px;">${formatCurrency(o.total)}</div>
        </div>
      </div>
    </div>
  `;
  new bootstrap.Modal(document.getElementById('viewOrderModal')).show();
}

function openAddOrderModal() {
  document.getElementById('orderModalTitle').textContent = 'New Order';
  document.getElementById('orderEditId').value = '';
  document.getElementById('orderCustomer').value = '';
  document.getElementById('orderCustomer').disabled = false;
  document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('orderDate').disabled = false;
  document.getElementById('orderItems').value = '';
  document.getElementById('orderItems').disabled = false;
  document.getElementById('orderTotal').value = '';
  document.getElementById('orderTotal').disabled = false;
  document.getElementById('orderStatus').value = 'pending';
  document.getElementById('orderPaymentStatus').value = 'pending';
  document.getElementById('orderPaymentStatus').disabled = true; // Payment handled via payment endpoint
  new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function openEditOrderModal(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  document.getElementById('orderModalTitle').textContent = 'Edit Order Status';
  document.getElementById('orderEditId').value = o.id;
  document.getElementById('orderCustomer').value = o.customerId;
  document.getElementById('orderCustomer').disabled = true; // Readonly
  document.getElementById('orderDate').value = o.date;
  document.getElementById('orderDate').disabled = true; // Readonly
  document.getElementById('orderItems').value = o.items.join(', ');
  document.getElementById('orderItems').disabled = true; // Readonly
  document.getElementById('orderTotal').value = o.total;
  document.getElementById('orderTotal').disabled = true; // Readonly
  document.getElementById('orderStatus').value = o.status;
  document.getElementById('orderPaymentStatus').value = o.paymentStatus;
  document.getElementById('orderPaymentStatus').disabled = true; // Readonly
  new bootstrap.Modal(document.getElementById('orderModal')).show();
}

async function saveOrder() {
  const editId = document.getElementById('orderEditId').value;
  const status = document.getElementById('orderStatus').value;

  try {
    if (editId) {
      // Update (only updating status for simplicity based on our API design)
      const res = await fetch(`${API_BASE_URL}/orders/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      showToast(`Order status updated successfully!`);
    } else {
      // Create new order
      const customerId = parseInt(document.getElementById('orderCustomer').value);
      const date = document.getElementById('orderDate').value;
      const itemsStr = document.getElementById('orderItems').value.trim();
      const items = itemsStr ? itemsStr.split(',').map(i => i.trim()).filter(Boolean) : [];

      if (!customerId || !date) {
        showToast('Please select customer and date.', 'error');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, date, status, items })
      });
      if (!res.ok) throw new Error('Creation failed');
      showToast(`Order created successfully!`);
    }

    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
    fetchOrders();
  } catch (err) {
    console.error(err);
    showToast('Failed to save order', 'error');
  }
}

let deleteOrderId = null;

function openDeleteModal(id) {
  deleteOrderId = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${deleteOrderId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion failed');
      
      showToast('Order deleted successfully!');
      fetchOrders();
      modal.hide();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete order', 'error');
      modal.hide();
    }
  };
  modal.show();
}
