const API_BASE = 'http://localhost:5000/api/v1';

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (error) {
    return { id: Date.now(), ...productData };
  }
}

export async function updateProduct(id, productData) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (error) {
    return { id, ...productData };
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    return { id };
  }
}

// Custom Offers API
export async function fetchOffers() {
  try {
    const res = await fetch(`${API_BASE}/offers`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createOffer(offerData) {
  try {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    return await res.json();
  } catch (error) {
    return { id: Date.now(), ...offerData };
  }
}

export async function updateOffer(id, offerData) {
  try {
    const res = await fetch(`${API_BASE}/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    return await res.json();
  } catch (error) {
    return { id, ...offerData };
  }
}

export async function deleteOffer(id) {
  try {
    const res = await fetch(`${API_BASE}/offers/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    return { id };
  }
}

// Coupons API
export async function fetchCoupons() {
  try {
    const res = await fetch(`${API_BASE}/coupons`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createCoupon(couponData) {
  try {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    return await res.json();
  } catch (error) {
    return { id: Date.now(), ...couponData };
  }
}

export async function validateCoupon(code, items, cartTotal) {
  try {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, items, cartTotal })
    });
    return await res.json();
  } catch (error) {
    return { valid: false, message: 'Error de conexión con el servidor de cupones' };
  }
}

export async function updateCoupon(id, couponData) {
  try {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    return await res.json();
  } catch (error) {
    return { id, ...couponData };
  }
}

export async function deleteCoupon(id) {
  try {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    return { id };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createCategory(catData) {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    return await res.json();
  } catch (error) {
    return { id: Date.now(), ...catData };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (error) {
    return {
      id: Date.now(),
      code: `#PED-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName || 'Cliente',
      itemsSummary: orderData.items ? orderData.items.map(i => `${i.qty || 1}x ${i.name}`).join(', ') : 'Pedido',
      total: orderData.total,
      status: 'Pendiente',
      date: 'Justo ahora',
    };
  }
}

export async function acceptOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (error) {
    return { message: 'Aceptado localmente' };
  }
}

export async function rejectOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (error) {
    return { message: 'Rechazado localmente' };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (error) {
    return { id: orderId, status };
  }
}

export async function fetchInventory() {
  try {
    const res = await fetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function updateStockQuantity(id, stockQuantity) {
  try {
    const res = await fetch(`${API_BASE}/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockQuantity })
    });
    return await res.json();
  } catch (error) {
    return { id, stockQuantity, status: stockQuantity < 50 ? 'Stock Bajo' : 'En Stock' };
  }
}

export async function addIngredient(data) {
  try {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return {
      id: Date.now(),
      ...data,
      sku: data.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      status: (data.stockQuantity || 100) < 50 ? 'Stock Bajo' : 'En Stock',
      lastRestock: 'Justo ahora'
    };
  }
}
