// ========================================
// Payments Page Logic
// ========================================

let payments = [];
let orders = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp('payments.html', 'Payment', 'Transactions');
  fetchOrdersForDropdown();
  fetchPayments();
});

async function fetchOrdersForDropdown() {
  try {
    console.log('[API] Fetching orders for dropdown from:', `${API_BASE_URL}/orders`);
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (res.ok) {
      orders = await res.json();
      console.log('[API] Orders received:', orders);
      populatePaymentOrderSelect();
    }
  } catch (err) {
    console.error('[ERROR] Failed to load orders for dropdown:', err);
  }
}

function populatePaymentOrderSelect() {
  const select = document.getElementById('paymentOrderId');
  select.innerHTML = '<option value="">Select Order</option>';
  orders.forEach(o => {
    // Only show orders that are not fully paid
    if (o.paymentStatus !== 'paid') {
      select.innerHTML += `<option value="${o.id}">ORD-${o.id} — ${o.customerName} (${formatCurrency(o.total)})</option>`;
    }
  });
}

async function fetchPayments() {
  try {
    console.log('[API] Fetching payments from:', `${API_BASE_URL}/payments`);
    const res = await fetch(`${API_BASE_URL}/payments`);
    if (!res.ok) throw new Error(`Failed to fetch payments: ${res.status}`);
    payments = await res.json();
    console.log('[API] Payments received:', payments);
    updatePaymentStats();
    renderPayments();
  } catch (err) {
    console.error('[ERROR] Failed to fetch payments:', err);
    showToast('Failed to load payments from server', 'error');
  }
}

function updatePaymentStats() {
  const completed = payments.filter(p => p.status === 'completed');
  document.getElementById('statTotalPayments').textContent = formatCurrency(completed.reduce((s, p) => s + parseFloat(p.amount), 0));
  document.getElementById('statCompleted').textContent = completed.length;
  document.getElementById('statPendingPayments').textContent = payments.filter(p => p.status === 'pending').length;
  document.getElementById('statRefunded').textContent = payments.filter(p => p.status === 'refunded').length;
}

function getMethodIcon(method) {
  const map = {
    'Credit Card': { icon: 'fa-credit-card', cls: 'card' },
    'Debit Card':  { icon: 'fa-credit-card', cls: 'card' },
    'Cash':        { icon: 'fa-money-bill',   cls: 'cash' },
    'UPI':         { icon: 'fa-mobile-alt',   cls: 'upi' },
    'Net Banking': { icon: 'fa-university',   cls: 'wallet' },
  };
  return map[method] || { icon: 'fa-circle', cls: 'card' };
}

function renderPayments() {
  const search = document.getElementById('searchPayments').value.toLowerCase();
  const statusFilter = document.getElementById('filterPayStatus').value;
  const methodFilter = document.getElementById('filterPayMethod').value;

  const filtered = payments.filter(p => {
    const matchSearch = String(p.id).toLowerCase().includes(search) ||
                        String(p.orderId).toLowerCase().includes(search) ||
                        (p.customerName && p.customerName.toLowerCase().includes(search)) ||
                        (p.transactionId && p.transactionId.toLowerCase().includes(search));
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchMethod = !methodFilter || p.method === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  const tbody = document.getElementById('paymentsTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fas fa-credit-card"></i><h5>No payments found</h5><p>Try adjusting your search or filters.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const mi = getMethodIcon(p.method);
    return `
    <tr>
      <td><span style="font-weight:600;color:var(--accent-green);">PAY-${p.id}</span></td>
      <td><span style="color:var(--accent-indigo);font-weight:500;">ORD-${p.orderId}</span></td>
      <td>
        <div class="customer-info">
          <div class="customer-avatar" style="background:${getAvatarColor(p.customerName)};width:30px;height:30px;font-size:0.7rem;">${getInitials(p.customerName)}</div>
          <span>${p.customerName || 'Unknown'}</span>
        </div>
      </td>
      <td><strong>${formatCurrency(p.amount)}</strong></td>
      <td>
        <div class="payment-method">
          <div class="payment-method-icon ${mi.cls}"><i class="fas ${mi.icon}"></i></div>
          <span style="font-size:0.85rem;">${p.method}</span>
        </div>
      </td>
      <td>${formatDate(p.date)}</td>
      <td><code style="font-size:0.78rem;color:var(--text-muted);background:rgba(99,102,241,0.08);padding:2px 8px;border-radius:4px;">${p.transactionId}</code></td>
      <td><span class="badge-status ${p.status}">${(p.status || '').charAt(0).toUpperCase() + (p.status || '').slice(1)}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-action delete" title="Delete" onclick="openDeleteModal(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `}).join('');
}

function openAddPaymentModal() {
  document.getElementById('paymentModalTitle').textContent = 'Record Payment';
  document.getElementById('paymentEditId').value = '';
  document.getElementById('paymentOrderId').value = '';
  document.getElementById('paymentAmount').value = '';
  document.getElementById('paymentMethod').value = 'Cash';
  document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('paymentTxnId').value = '';
  document.getElementById('paymentStatus').value = 'completed';
  new bootstrap.Modal(document.getElementById('paymentModal')).show();
}

async function savePayment() {
  const orderId = document.getElementById('paymentOrderId').value;
  const amount = parseFloat(document.getElementById('paymentAmount').value);
  const method = document.getElementById('paymentMethod').value;
  const date = document.getElementById('paymentDate').value;
  const transactionId = document.getElementById('paymentTxnId').value.trim(); // Ignored currently by backend API but kept for UI

  if (!orderId || isNaN(amount) || !date) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const payload = { orderId, amount, method, date };

  try {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Creation failed');
    
    showToast(`Payment recorded successfully!`);
    bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
    fetchPayments();
    fetchOrdersForDropdown(); // refresh dropdown
  } catch (err) {
    console.error(err);
    showToast('Failed to record payment', 'error');
  }
}

let deletePaymentId = null;

function openDeleteModal(id) {
  deletePaymentId = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${deletePaymentId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion failed');
      
      showToast('Payment deleted successfully!');
      fetchPayments();
      modal.hide();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete payment', 'error');
      modal.hide();
    }
  };
  modal.show();
}
