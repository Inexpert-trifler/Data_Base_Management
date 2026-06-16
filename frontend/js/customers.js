// ========================================
// Customers Page Logic
// ========================================

let customers = [];

document.addEventListener('DOMContentLoaded', () => {
  initApp('customers.html', 'Customer', 'Management');
  fetchCustomers();
});

async function fetchCustomers() {
  try {
    console.log('[API] Fetching customers from:', `${API_BASE_URL}/customers`);
    const res = await fetch(`${API_BASE_URL}/customers`);
    if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status}`);
    customers = await res.json();
    console.log('[API] Customers received:', customers);
    updateCustomerStats();
    renderCustomers();
  } catch (err) {
    console.error('[ERROR] Failed to fetch customers:', err);
    showToast('Failed to load customers from server', 'error');
  }
}

function updateCustomerStats() {
  document.getElementById('statTotal').textContent = customers.length;
  document.getElementById('statActive').textContent = customers.filter(c => c.status === 'active').length;
  document.getElementById('statSpent').textContent = formatCurrency(customers.reduce((s, c) => s + parseFloat(c.totalSpent), 0));
  const avgOrders = customers.length ? Math.round(customers.reduce((s, c) => s + parseInt(c.totalOrders), 0) / customers.length) : 0;
  document.getElementById('statAvgOrders').textContent = avgOrders;
}

function renderCustomers() {
  const search = document.getElementById('searchCustomers').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search) || c.phone.includes(search);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tbody = document.getElementById('customersTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-users"></i><h5>No customers found</h5><p>Try adjusting your search or filters.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="customer-info">
          <div class="customer-avatar" style="background: ${getAvatarColor(c.name)}">${getInitials(c.name)}</div>
          <div>
            <div class="name">${c.name}</div>
            <div class="email">${c.email}</div>
          </div>
        </div>
      </td>
      <td>${c.phone}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.address}</td>
      <td>${formatDate(c.joinDate)}</td>
      <td><strong>${c.totalOrders}</strong></td>
      <td><strong style="color:var(--accent-green);">${formatCurrency(c.totalSpent)}</strong></td>
      <td><span class="badge-status ${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-action edit" title="Edit" onclick="openEditCustomerModal(${c.id})"><i class="fas fa-pen"></i></button>
          <button class="btn-action delete" title="Delete" onclick="openDeleteModal(${c.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddCustomerModal() {
  document.getElementById('customerModalTitle').textContent = 'Add Customer';
  document.getElementById('customerId').value = '';
  document.getElementById('customerName').value = '';
  document.getElementById('customerEmail').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerAddress').value = '';
  document.getElementById('customerStatus').value = 'active';
  new bootstrap.Modal(document.getElementById('customerModal')).show();
}

function openEditCustomerModal(id) {
  const c = customers.find(c => c.id === id);
  if (!c) return;
  document.getElementById('customerModalTitle').textContent = 'Edit Customer';
  document.getElementById('customerId').value = c.id;
  document.getElementById('customerName').value = c.name;
  document.getElementById('customerEmail').value = c.email;
  document.getElementById('customerPhone').value = c.phone;
  document.getElementById('customerAddress').value = c.address;
  document.getElementById('customerStatus').value = c.status;
  new bootstrap.Modal(document.getElementById('customerModal')).show();
}

async function saveCustomer() {
  const id = document.getElementById('customerId').value;
  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const status = document.getElementById('customerStatus').value;

  if (!name || !email || !phone) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const payload = { name, email, phone, address, status };

  try {
    if (id) {
      // Update
      const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Update failed');
      showToast(`Customer "${name}" updated successfully!`);
    } else {
      // Create
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Creation failed');
      showToast(`Customer "${name}" added successfully!`);
    }

    bootstrap.Modal.getInstance(document.getElementById('customerModal')).hide();
    fetchCustomers(); // Reload list
  } catch (err) {
    console.error(err);
    showToast('Failed to save customer', 'error');
  }
}

let deleteCustomerId = null;

function openDeleteModal(id) {
  deleteCustomerId = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/${deleteCustomerId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion failed');
      
      showToast('Customer deleted successfully!');
      fetchCustomers();
      modal.hide();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete customer', 'error');
      modal.hide();
    }
  };
  modal.show();
}
