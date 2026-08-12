import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentMode, setCurrentMode] = useState('client'); // 'client' | 'crm'
  const [clientTab, setClientTab] = useState('home'); // 'home', 'offers', 'orders', 'favorites'
  const [crmTab, setCrmTab] = useState('daily-orders'); // 'daily-orders', 'reports', 'coupons', 'offers', 'dashboard', 'menu', 'monthly-orders', 'inventory', 'customers', 'settings'
  const [isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  
  // Persistent Orders State from LocalStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_orders_real_db_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('crm_orders_real_db_v3', JSON.stringify(orders));
    } catch (e) {
      console.error('Error guardando pedidos:', e);
    }
  }, [orders]);

  // Load initial data from API
  const loadData = async () => {
    try {
      const [prods, cats, offs, coups, ords, inv] = await Promise.all([
        api.fetchProducts(),
        api.fetchCategories(),
        api.fetchOffers(),
        api.fetchCoupons(),
        api.fetchOrders(),
        api.fetchInventory(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOffers(offs);
      setCoupons(coups);
      setInventory(inv);

      // Merge API orders with local persistent orders
      if (Array.isArray(ords) && ords.length > 0) {
        setOrders(prev => {
          const existingIds = new Set(prev.map(o => o.id));
          const newFromApi = ords.filter(o => !existingIds.has(o.id));
          return [...prev, ...newFromApi];
        });
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  // Real-Time Polling for Daily Orders, Offers & Inventory (every 5s when tab active)
  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      if (document.hidden) return;
      try {
        const [updatedOrders, updatedInv, updatedOffers, updatedCoupons] = await Promise.all([
          api.fetchOrders(),
          api.fetchInventory(),
          api.fetchOffers(),
          api.fetchCoupons(),
        ]);
        
        setInventory(updatedInv);
        setOffers(updatedOffers);
        setCoupons(updatedCoupons);

        if (Array.isArray(updatedOrders) && updatedOrders.length > 0) {
          setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const newFromApi = updatedOrders.filter(o => !existingIds.has(o.id));
            if (newFromApi.length > 0) {
              return [...prev, ...newFromApi];
            }
            return prev;
          });
        }
      } catch (e) {
        // silent sync
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (product, quantity = 1, options = {}) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, options }];
    });
    showToast(`¡Añadido ${product.name} al carrito!`);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Universal placeOrder Handler for POS, Tables, and Client App
  const placeOrder = async (customOrderObj = null) => {
    if (customOrderObj) {
      // Custom Order from Mostrador Express POS or Gestión de Mesas
      const newOrder = {
        id: customOrderObj.id || Date.now(),
        code: customOrderObj.code || `#PED-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customOrderObj.customerName || 'Cliente Mostrador',
        customerPhone: customOrderObj.customerPhone || '',
        waiter: customOrderObj.waiter || '',
        fulfillmentType: customOrderObj.fulfillmentType || 'pos',
        paymentMethod: customOrderObj.paymentMethod || 'Efectivo',
        address: customOrderObj.address || '',
        itemsSummary: customOrderObj.itemsSummary || '',
        itemsJson: customOrderObj.itemsJson || (customOrderObj.items ? JSON.stringify(customOrderObj.items) : '[]'),
        total: Number(customOrderObj.total || 0),
        status: customOrderObj.status || 'Aceptado',
        date: customOrderObj.date || new Date().toLocaleString()
      };

      try {
        await api.createOrder(newOrder);
      } catch (e) {
        console.error('Error guardando en API backend:', e);
      }

      setOrders(prev => [newOrder, ...prev]);
      showToast(`🎉 ¡Pedido ${newOrder.code} registrado y visible en Pedidos del Día!`);
      return newOrder;
    }

    // Client App Cart Order
    if (cart.length === 0) return;
    const rawTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTotal = Math.max(0, rawTotal - discountAmount);

    const itemsFormatted = cart.map(i => ({
      id: i.id,
      name: i.name,
      qty: i.quantity,
      price: i.price,
      options: i.options || {}
    }));

    const newOrderData = {
      id: Date.now(),
      code: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Alex',
      customerPhone: '+54 9 11 5555-0192',
      fulfillmentType: 'takeaway',
      paymentMethod: 'MercadoPago',
      items: itemsFormatted,
      itemsSummary: itemsFormatted.map(i => `${i.qty}x ${i.name}`).join(', '),
      itemsJson: JSON.stringify(itemsFormatted),
      total: Number(finalTotal.toFixed(2)),
      status: 'Pendiente',
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      date: new Date().toLocaleString()
    };
    
    try {
      const created = await api.createOrder(newOrderData);
      const orderToAdd = created && created.code ? created : newOrderData;
      setOrders(prev => [orderToAdd, ...prev]);
      showToast(`🎉 ¡Pedido ${orderToAdd.code} registrado! Estado: Pendiente`);
    } catch (e) {
      setOrders(prev => [newOrderData, ...prev]);
      showToast(`🎉 ¡Pedido ${newOrderData.code} registrado! Estado: Pendiente`);
    }

    clearCart();
    setClientTab('orders');
  };

  const handleAcceptOrder = async (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Aceptado' } : o));
    try {
      await api.acceptOrder(orderId);
    } catch (e) {}
    showToast(`✅ Pedido #${orderId} ACEPTADO.`);
  };

  const handleRejectOrder = async (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Rechazado' } : o));
    try {
      await api.rejectOrder(orderId);
    } catch (e) {}
    showToast(`❌ Pedido #${orderId} RECHAZADO.`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`🔄 Estado de pedido #${orderId} actualizado a "${newStatus}"`);
  };

  const handleCreateCategory = async (catData) => {
    const created = await api.createCategory(catData);
    setCategories(prev => [...prev, created]);
    showToast(`Categoría "${created.name}" creada con éxito`);
  };

  const handleCreateProduct = async (prodData) => {
    const created = await api.createProduct(prodData);
    const updatedProds = await api.fetchProducts();
    setProducts(updatedProds);
    showToast(`Producto "${created.name}" añadido al menú`);
  };

  const handleUpdateProduct = async (id, prodData) => {
    await api.updateProduct(id, prodData);
    const updatedProds = await api.fetchProducts();
    setProducts(updatedProds);
    showToast(`Producto actualizado con éxito`);
  };

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Producto eliminado`);
  };

  const handleUpdateStock = (id, newQuantity) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, stockQuantity: newQuantity } : item));
  };

  const handleAddIngredient = (newIngredient) => {
    setInventory(prev => [...prev, { ...newIngredient, id: Date.now() }]);
    showToast(`Ingrediente "${newIngredient.name}" añadido al inventario`);
  };

  const applyCoupon = (code) => {
    const found = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (found) {
      setAppliedCoupon(found);
      showToast(`¡Cupón "${found.code}" aplicado! Descuento: $${found.discountAmount}`);
      return true;
    } else {
      showToast(`Cupón inválido o expirado`);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentMode, setCurrentMode,
      clientTab, setClientTab,
      crmTab, setCrmTab,
      isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen,
      products, setProducts,
      categories, setCategories,
      offers, setOffers,
      coupons, setCoupons,
      orders, setOrders,
      inventory, setInventory,
      selectedProduct, setSelectedProduct,
      cart, addToCart, removeFromCart, clearCart,
      appliedCoupon, applyCoupon,
      isCartOpen, setIsCartOpen,
      toastMessage, showToast,
      placeOrder,
      handleAcceptOrder,
      handleRejectOrder,
      handleUpdateOrderStatus,
      handleCreateCategory,
      handleCreateProduct,
      handleUpdateProduct,
      handleDeleteProduct,
      handleUpdateStock,
      handleAddIngredient
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
