// ========================================
// Products Page Logic
// ========================================

let products = [];
let categories = ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Grains', 'Meat', 'Bakery'];

document.addEventListener('DOMContentLoaded', () => {
  initApp('products.html', 'Product', 'Inventory');
  populateCategoryFilter();
  fetchProducts();
});

async function fetchProducts() {
  try {
    console.log('[API] Fetching products from:', `${API_BASE_URL}/products`);
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    products = await res.json();
    console.log('[API] Products received:', products);
    updateProductStats();
    renderProducts();
  } catch (err) {
    console.error('[ERROR] Failed to fetch products:', err);
    showToast('Failed to load products from server', 'error');
  }
}

function populateCategoryFilter() {
  const filterSelect = document.getElementById('filterCategory');
  const modalSelect = document.getElementById('productCategory');

  categories.forEach(cat => {
    filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    modalSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function updateProductStats() {
  document.getElementById('statTotalProducts').textContent = products.length;
  const usedCategories = [...new Set(products.map(p => p.category))];
  document.getElementById('statCategories').textContent = usedCategories.length;
  document.getElementById('statTotalStock').textContent = products.reduce((s, p) => s + p.stock, 0).toLocaleString();
  document.getElementById('statLowStock').textContent = products.filter(p => p.stock < 50).length;
}

function getStockLevel(stock) {
  if (stock < 50) return 'low';
  if (stock <= 200) return 'medium';
  return 'high';
}

function getStockPercent(stock) {
  return Math.min((stock / 600) * 100, 100);
}

function renderProducts() {
  const search = document.getElementById('searchProducts').value.toLowerCase();
  const categoryFilter = document.getElementById('filterCategory').value;
  const stockFilter = document.getElementById('filterStock').value;

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search) || (p.supplier && p.supplier.toLowerCase().includes(search));
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    let matchStock = true;
    if (stockFilter === 'low') matchStock = p.stock < 50;
    else if (stockFilter === 'medium') matchStock = p.stock >= 50 && p.stock <= 200;
    else if (stockFilter === 'high') matchStock = p.stock > 200;
    return matchSearch && matchCategory && matchStock;
  });

  const grid = document.getElementById('productsGrid');
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-12"><div class="empty-state"><i class="fas fa-box-open"></i><h5>No products found</h5><p>Try adjusting your search or filters.</p></div></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const level = getStockLevel(p.stock);
    const catClass = (p.category || 'other').toLowerCase();
    return `
    <div class="col-12 col-md-6 col-xl-4 col-xxl-3">
      <div class="product-card">
        <div class="product-card-header">
          <span class="product-sku">${p.sku}</span>
          <div class="d-flex gap-1">
            <button class="btn-action edit" title="Edit" onclick="openEditProductModal(${p.id})"><i class="fas fa-pen"></i></button>
            <button class="btn-action delete" title="Delete" onclick="openDeleteModal(${p.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <h5 class="product-title">${p.name}</h5>
        <div class="product-category">
          <span class="badge-category ${catClass}">${p.category}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Unit: ${p.unit} &bull; Supplier: ${p.supplier}</div>
        <div class="product-stats">
          <div class="product-price">${formatCurrency(p.price)}</div>
          <div class="product-stock ${level}">Stock: ${p.stock}</div>
        </div>
      </div>
    </div>
  `}).join('');
}

function openAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productSku').value = '';
  document.getElementById('productCategory').value = categories[0];
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productUnit').value = '';
  document.getElementById('productSupplier').value = ''; // We won't use this directly since supplier_id is needed, but we keep the UI same
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

function openEditProductModal(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = p.id;
  document.getElementById('productName').value = p.name;
  document.getElementById('productSku').value = p.sku;
  document.getElementById('productCategory').value = p.category;
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productStock').value = p.stock;
  document.getElementById('productUnit').value = p.unit;
  document.getElementById('productSupplier').value = p.supplier;
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

async function saveProduct() {
  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);

  if (!name || isNaN(price) || isNaN(stock)) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const payload = { name, category, price, stock };

  try {
    if (id) {
      // Update
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Update failed');
      showToast(`Product "${name}" updated successfully!`);
    } else {
      // Create
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Creation failed');
      showToast(`Product "${name}" added successfully!`);
    }

    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    fetchProducts();
  } catch (err) {
    console.error(err);
    showToast('Failed to save product', 'error');
  }
}

let deleteProductId = null;

function openDeleteModal(id) {
  deleteProductId = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${deleteProductId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion failed');
      
      showToast('Product deleted successfully!');
      fetchProducts();
      modal.hide();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
      modal.hide();
    }
  };
  modal.show();
}
