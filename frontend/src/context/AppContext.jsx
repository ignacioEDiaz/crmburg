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
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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
      setOrders(ords);
      setInventory(inv);
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
        setOrders(updatedOrders);
        setInventory(updatedInv);
        setOffers(updatedOffers);
        setCoupons(updatedCoupons);
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

  const placeOrder = async () => {
    if (cart.length === 0) return;
    const rawTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTotal = Math.max(0, rawTotal - discountAmount);

    const newOrderData = {
      customerName: 'Alex',
      items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price, options: i.options })),
      total: Number(finalTotal.toFixed(2)),
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    };
    
    const created = await api.createOrder(newOrderData);
    setOrders(prev => [created, ...prev]);
    clearCart();
    showToast(`🎉 ¡Pedido ${created.code} registrado! Estado: Pendiente`);
    setClientTab('orders');
  };

  const handleAcceptOrder = async (orderId) => {
    await api.acceptOrder(orderId);
    const [updatedOrders, updatedInv] = await Promise.all([
      api.fetchOrders(),
      api.fetchInventory(),
    ]);
    setOrders(updatedOrders);
    setInventory(updatedInv);
    showToast(`✅ Pedido #${orderId} ACEPTADO. ¡Stock de inventario descontado automáticamente!`);
  };

  const handleRejectOrder = async (orderId) => {
    await api.rejectOrder(orderId);
    const updatedOrders = await api.fetchOrders();
    setOrders(updatedOrders);
    showToast(`❌ Pedido #${orderId} RECHAZADO.`);
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
    showToast(`Producto "${prodData.name || 'actualizado'}" modificado correctamente`);
  };

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    const updatedProds = await api.fetchProducts();
    setProducts(updatedProds);
    showToast(`Producto eliminado del menú`);
  };

  const handleCreateOffer = async (offerData) => {
    const created = await api.createOffer(offerData);
    const updatedOffers = await api.fetchOffers();
    setOffers(updatedOffers);
    showToast(`Oferta "${created.title}" creada con éxito`);
  };

  const handleUpdateOffer = async (id, offerData) => {
    await api.updateOffer(id, offerData);
    const updatedOffers = await api.fetchOffers();
    setOffers(updatedOffers);
    showToast(`Oferta "${offerData.title || 'actualizada'}" modificada correctamente`);
  };

  const handleDeleteOffer = async (id) => {
    await api.deleteOffer(id);
    const updatedOffers = await api.fetchOffers();
    setOffers(updatedOffers);
    showToast(`Oferta eliminada correctamente`);
  };

  const handleCreateCoupon = async (couponData) => {
    const created = await api.createCoupon(couponData);
    const updatedCoupons = await api.fetchCoupons();
    setCoupons(updatedCoupons);
    showToast(`Cupón "${created.code}" creado con éxito`);
  };

  const handleUpdateCoupon = async (id, couponData) => {
    await api.updateCoupon(id, couponData);
    const updatedCoupons = await api.fetchCoupons();
    setCoupons(updatedCoupons);
    showToast(`Cupón modificado correctamente`);
  };

  const handleDeleteCoupon = async (id) => {
    await api.deleteCoupon(id);
    const updatedCoupons = await api.fetchCoupons();
    setCoupons(updatedCoupons);
    showToast(`Cupón eliminado correctamente`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === 'Aceptado') {
      return handleAcceptOrder(orderId);
    }
    if (newStatus === 'Rechazado') {
      return handleRejectOrder(orderId);
    }
    await api.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Pedido #${orderId} actualizado a ${newStatus}`);
  };

  const handleUpdateStock = async (ingredientId, newStock) => {
    await api.updateStockQuantity(ingredientId, newStock);
    setInventory(prev => prev.map(i => i.id === ingredientId ? { ...i, stockQuantity: newStock, status: newStock < 50 ? 'Stock Bajo' : 'En Stock' } : i));
    showToast(`Stock actualizado`);
  };

  const handleAddIngredient = async (newIng) => {
    const created = await api.addIngredient(newIng);
    setInventory(prev => [...prev, created]);
    showToast(`Ingrediente ${created.name} añadido`);
  };

  return (
    <AppContext.Provider value={{
      currentMode, setCurrentMode,
      clientTab, setClientTab,
      crmTab, setCrmTab,
      isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen,
      products, categories, offers, coupons, orders, inventory,
      selectedProduct, setSelectedProduct,
      cart, appliedCoupon, setAppliedCoupon, isCartOpen, setIsCartOpen,
      addToCart, removeFromCart, clearCart, placeOrder,
      handleAcceptOrder, handleRejectOrder,
      handleCreateCategory, handleCreateProduct, handleUpdateProduct, handleDeleteProduct,
      handleCreateOffer, handleUpdateOffer, handleDeleteOffer,
      handleCreateCoupon, handleUpdateCoupon, handleDeleteCoupon,
      handleUpdateOrderStatus, handleUpdateStock, handleAddIngredient,
      toastMessage, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
