import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

const DEFAULT_INITIAL_INVENTORY = [
  // Salsas & Aditivos
  { id: 101, name: 'Salsa Barbacoa Sweet & Smoked', category: 'Aditivos y Salsas', stockQuantity: 95, unit: 'porciones', price: 1.00, minStock: 20, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=80' },
  { id: 102, name: 'Salsa Especial CRASH', category: 'Aditivos y Salsas', stockQuantity: 120, unit: 'porciones', price: 0.75, minStock: 25, image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=80' },
  { id: 103, name: 'Queso Cheddar Fetear Fundido', category: 'Lácteos y Quesos', stockQuantity: 280, unit: 'fetas', price: 1.50, minStock: 50, image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80' },
  { id: 104, name: 'Medallón de Carne Certified Angus 120g', category: 'Hamburguesas y Carnes', stockQuantity: 450, unit: 'unidades', price: 2.50, minStock: 100, image: '/images/burger-supreme.jpg' },
  { id: 105, name: 'Bacon / Panceta Crocante Ahumada', category: 'Hamburguesas y Carnes', stockQuantity: 180, unit: 'fetas', price: 1.50, minStock: 40, image: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&auto=format&fit=crop&q=80' },
  { id: 106, name: 'Cebolla Caramelizada Dulce', category: 'Vegetales y Frescos', stockQuantity: 75, unit: 'porciones', price: 1.00, minStock: 15, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&auto=format&fit=crop&q=80' },
  { id: 107, name: 'Huevo Frito a la Plancha', category: 'Aditivos y Salsas', stockQuantity: 110, unit: 'unidades', price: 1.00, minStock: 20, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80' },
  { id: 108, name: 'Papas Bastón McCain Corte Tradicional', category: 'Papas y Guarniciones', stockQuantity: 220, unit: 'kg', price: 2.00, minStock: 50, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80' },
  
  // Bebidas
  { id: 1, name: 'Coca-Cola Zero 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 120, unit: 'latas', price: 2.50, minStock: 30, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Cerveza Patagonia Amber Ale 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 85, unit: 'botellas', price: 3.50, minStock: 25, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Agua Mineral Con Gas 600ml', category: 'Bebidas y Gaseosas', stockQuantity: 140, unit: 'botellas', price: 1.80, minStock: 40, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80' },
];

export function AppProvider({ children }) {
  const [currentMode, setCurrentMode] = useState('client'); // 'client' | 'crm'
  const [clientTab, setClientTab] = useState('home');
  const [crmTab, setCrmTab] = useState('daily-orders');
  const [isCrmMobileSidebarOpen, setIsCrmMobileSidebarOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  
  // Persistent Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_orders_real_db_v3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persistent Inventory State
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_inventory_db_v3');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_INVENTORY;
    } catch (e) {
      return DEFAULT_INITIAL_INVENTORY;
    }
  });

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

  // Sync inventory to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('crm_inventory_db_v3', JSON.stringify(inventory));
    } catch (e) {
      console.error('Error guardando inventario:', e);
    }
  }, [inventory]);

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

      if (Array.isArray(inv) && inv.length > 0) {
        setInventory(prev => {
          const existingIds = new Set(prev.map(i => i.id));
          const newFromApi = inv.filter(i => !existingIds.has(i.id));
          return [...prev, ...newFromApi];
        });
      }

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

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Automatic Stock Deduction from Order Items & Extras
  const deductStockFromOrderItems = (items) => {
    if (!Array.isArray(items)) return;

    setInventory(prevInv => {
      let updatedInv = [...prevInv];

      items.forEach(item => {
        const itemQty = item.qty || item.quantity || 1;
        const itemNameLower = (item.name || '').toLowerCase();

        // 1. Deduct main product if matched in inventory
        updatedInv = updatedInv.map(invItem => {
          const invNameLower = (invItem.name || '').toLowerCase();
          if (invNameLower.includes(itemNameLower) || itemNameLower.includes(invNameLower)) {
            const newQty = Math.max(0, (invItem.stockQuantity || 0) - itemQty);
            return { ...invItem, stockQuantity: newQty };
          }
          return invItem;
        });

        // 2. Deduct options/extras if present
        if (item.options && Array.isArray(item.options.extras)) {
          item.options.extras.forEach(extra => {
            const extraNameLower = (extra.rawName || extra.name || '').toLowerCase().replace(/^\+\s*/, '');
            
            updatedInv = updatedInv.map(invItem => {
              const invNameLower = (invItem.name || '').toLowerCase();
              if (invItem.id === extra.inventoryId || invNameLower.includes(extraNameLower) || extraNameLower.includes(invNameLower)) {
                const newQty = Math.max(0, (invItem.stockQuantity || 0) - itemQty);
                return { ...invItem, stockQuantity: newQty };
              }
              return invItem;
            });
          });
        }
      });

      return updatedInv;
    });
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
      let parsedItems = [];
      try {
        parsedItems = typeof customOrderObj.itemsJson === 'string' ? JSON.parse(customOrderObj.itemsJson) : (customOrderObj.itemsJson || customOrderObj.items || []);
      } catch (e) {
        parsedItems = customOrderObj.items || [];
      }

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
        itemsJson: typeof customOrderObj.itemsJson === 'string' ? customOrderObj.itemsJson : JSON.stringify(parsedItems),
        total: Number(customOrderObj.total || 0),
        status: customOrderObj.status || 'Aceptado',
        date: customOrderObj.date || new Date().toLocaleString()
      };

      try {
        await api.createOrder(newOrder);
      } catch (e) {
        console.error('Error guardando en API backend:', e);
      }

      // Automatically deduct stock for items and extras
      deductStockFromOrderItems(parsedItems);

      setOrders(prev => [newOrder, ...prev]);
      showToast(`🎉 ¡Pedido ${newOrder.code} registrado y stock de inventario descontado!`);
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

    // Deduct stock
    deductStockFromOrderItems(itemsFormatted);

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
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      let parsedItems = [];
      try {
        parsedItems = typeof targetOrder.itemsJson === 'string' ? JSON.parse(targetOrder.itemsJson) : (targetOrder.itemsJson || targetOrder.items || []);
      } catch (e) {}
      deductStockFromOrderItems(parsedItems);
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Aceptado' } : o));
    try {
      await api.acceptOrder(orderId);
    } catch (e) {}
    showToast(`✅ Pedido #${orderId} ACEPTADO y stock descontado.`);
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

  const loadRealTestData = () => {
    // 1. Transparent PNG Products & Real Menu Items
    const realProducts = [
      {
        id: 1,
        name: 'CRASH Smash Cheeseburger',
        category: 'Hamburguesas',
        price: 4800.0,
        originalPrice: 5600.0,
        rating: 4.9,
        reviewsCount: 240,
        description: 'Medallón Smash Angus de 120g costrado a la plancha, doble cheddar fundido, pepinillos dulce encurtidos y salsa secreta CRASH en pan brioche de manteca.',
        isPopular: true,
        image: 'https://pngimg.com/d/burger_PNG19.png'
      },
      {
        id: 2,
        name: 'CRASH Double Bacon Supreme',
        category: 'Hamburguesas',
        price: 6900.0,
        originalPrice: 7900.0,
        rating: 5.0,
        reviewsCount: 380,
        description: 'Doble medallón Angus de 240g, triple queso cheddar inglés, tiras de panceta bacon ahumada ultra crocante y cebolla caramelizada.',
        isPopular: true,
        tag: 'Más Vendido',
        image: 'https://pngimg.com/d/burger_PNG2.png'
      },
      {
        id: 3,
        name: 'Crispy Chicken Crunchy',
        category: 'Hamburguesas',
        price: 5500.0,
        rating: 4.8,
        reviewsCount: 190,
        description: 'Pechuga de pollo seleccionada marinada y rebozada super crocante, lechuga hidropónica, tomate fresco y mayonesa de alioli artesanal.',
        isPopular: false,
        image: 'https://pngimg.com/d/burger_PNG12.png'
      },
      {
        id: 4,
        name: 'Triple Beast Angus Burger',
        category: 'Hamburguesas',
        price: 8500.0,
        rating: 4.9,
        reviewsCount: 310,
        description: 'Triple medallón de res Angus de 360g, cuádruple cheddar derretido, bacon crocante ahumado y huevo frito a la plancha.',
        isPopular: true,
        tag: 'GIGANTE',
        image: 'https://pngimg.com/d/burger_PNG3.png'
      },
      {
        id: 5,
        name: 'Combo Mega CRASH Supreme',
        category: 'Combos y Menúes',
        price: 9200.0,
        originalPrice: 11500.0,
        rating: 5.0,
        reviewsCount: 420,
        description: 'Incluye 1x Double Bacon Supreme + Papas Fritas Bastón Grandes con Cheddar & Bacon + 1x Gaseosa Coca-Cola 500ml.',
        isPopular: true,
        tag: '20% OFF',
        image: 'https://pngimg.com/d/burger_PNG3.png'
      },
      {
        id: 6,
        name: 'Combo Pareja 2x Smash + Papas XL',
        category: 'Combos y Menúes',
        price: 11500.0,
        originalPrice: 14000.0,
        rating: 4.9,
        reviewsCount: 290,
        description: 'Incluye 2x CRASH Smash Cheeseburgers + 1x Papas Bastón XL Familiar + 2x Gaseosas a elección.',
        isPopular: true,
        tag: 'PROMO PAREJAS',
        image: 'https://pngimg.com/d/burger_PNG19.png'
      },
      {
        id: 7,
        name: 'Papas Fritas Cheddar & Bacon',
        category: 'Guarniciones',
        price: 3200.0,
        rating: 4.9,
        reviewsCount: 510,
        description: 'Papas fritas bastón McCain crocantes bañadas en fundido de cheddar artesanal y bits de bacon ahumado.',
        isPopular: true,
        image: 'https://pngimg.com/d/french_fries_PNG30.png'
      },
      {
        id: 8,
        name: 'Aros de Cebolla Crispy',
        category: 'Guarniciones',
        price: 2800.0,
        rating: 4.7,
        reviewsCount: 160,
        description: 'Aros de cebolla morada rebozados y dorados en su punto justo, acompañados de dip barbacoa ahumada.',
        isPopular: false,
        image: 'https://pngimg.com/d/onion_rings_PNG11.png'
      },
      {
        id: 9,
        name: 'Coca-Cola Zero 500ml',
        category: 'Bebidas y Tragos',
        price: 1800.0,
        rating: 5.0,
        reviewsCount: 620,
        description: 'Botella 500ml helada.',
        isPopular: true,
        image: 'https://pngimg.com/d/cocacola_PNG22.png'
      },
      {
        id: 10,
        name: 'Cerveza Patagonia IPA 500ml',
        category: 'Bebidas y Tragos',
        price: 2900.0,
        rating: 4.8,
        reviewsCount: 230,
        description: 'Cerveza artesanal embotellada tirada bien helada.',
        isPopular: true,
        image: 'https://pngimg.com/d/beer_PNG2388.png'
      },
      {
        id: 11,
        name: 'Milkshake Dulce de Leche & Oreo',
        category: 'Postres y Malteadas',
        price: 3400.0,
        rating: 4.9,
        reviewsCount: 340,
        description: 'Helado batido artesanal de dulce de leche con galletitas Oreo trituradas y crema batida.',
        isPopular: true,
        image: 'https://pngimg.com/d/milkshake_PNG25.png'
      }
    ];

    // 2. Real Categories with icons
    const realCategories = [
      { id: 1, name: 'Hamburguesas', icon: 'lunch_dining', description: 'Hamburguesas artesanas 100% Angus' },
      { id: 2, name: 'Combos y Menúes', icon: 'stars', description: 'Combos promocionales con papas y bebida' },
      { id: 3, name: 'Guarniciones', icon: 'fastfood', description: 'Papas cheddar, aros de cebolla y dicos' },
      { id: 4, name: 'Bebidas y Tragos', icon: 'local_bar', description: 'Gaseosas frías, cervezas y bebidas' },
      { id: 5, name: 'Postres y Malteadas', icon: 'icecream', description: 'Milkshakes y postres artesanales' },
    ];

    // 3. Real Inventory Ingredients with Real Quantities & Unit Costs
    const realInventory = [
      { id: 101, name: 'Salsa Barbacoa Sweet & Smoked', category: 'Aditivos y Salsas', stockQuantity: 150, unit: 'porciones', price: 900.0, unitCost: 180.0, minStock: 30, image: 'https://pngimg.com/d/burger_PNG19.png' },
      { id: 102, name: 'Salsa Especial CRASH', category: 'Aditivos y Salsas', stockQuantity: 180, unit: 'porciones', price: 750.0, unitCost: 150.0, minStock: 30, image: 'https://pngimg.com/d/burger_PNG2.png' },
      { id: 103, name: 'Queso Cheddar Fetear Fundido', category: 'Lácteos y Quesos', stockQuantity: 620, unit: 'fetas', price: 1500.0, unitCost: 220.0, minStock: 100, image: 'https://pngimg.com/d/french_fries_PNG30.png' },
      { id: 104, name: 'Medallón de Carne Certified Angus 120g', category: 'Hamburguesas y Carnes', stockQuantity: 480, unit: 'unidades', price: 2500.0, unitCost: 950.0, minStock: 80, image: 'https://pngimg.com/d/burger_PNG19.png' },
      { id: 105, name: 'Bacon / Panceta Crocante Ahumada', category: 'Hamburguesas y Carnes', stockQuantity: 280, unit: 'fetas', price: 1500.0, unitCost: 310.0, minStock: 50, image: 'https://pngimg.com/d/burger_PNG2.png' },
      { id: 106, name: 'Cebolla Caramelizada Dulce', category: 'Vegetales y Frescos', stockQuantity: 95, unit: 'porciones', price: 1000.0, unitCost: 200.0, minStock: 20, image: 'https://pngimg.com/d/onion_rings_PNG11.png' },
      { id: 107, name: 'Huevo Frito a la Plancha', category: 'Aditivos y Salsas', stockQuantity: 120, unit: 'unidades', price: 1000.0, unitCost: 250.0, minStock: 25, image: 'https://pngimg.com/d/burger_PNG3.png' },
      { id: 108, name: 'Papas Bastón McCain Corte Tradicional', category: 'Papas y Guarniciones', stockQuantity: 240, unit: 'kg', price: 2000.0, unitCost: 1200.0, minStock: 40, image: 'https://pngimg.com/d/french_fries_PNG30.png' },
      { id: 109, name: 'Panes Brioche Artesanales con Manteca', category: 'Panadería', stockQuantity: 350, unit: 'unidades', price: 1200.0, unitCost: 380.0, minStock: 60, image: 'https://pngimg.com/d/burger_PNG19.png' },
      { id: 110, name: 'Coca-Cola Zero 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 140, unit: 'latas', price: 1800.0, unitCost: 900.0, minStock: 35, image: 'https://pngimg.com/d/cocacola_PNG22.png' },
      { id: 111, name: 'Cerveza Patagonia IPA 500ml', category: 'Bebidas y Gaseosas', stockQuantity: 95, unit: 'botellas', price: 2900.0, unitCost: 1400.0, minStock: 25, image: 'https://pngimg.com/d/beer_PNG2388.png' },
    ];

    // 4. Real Orders with Order Codes, Mozos, Payments & Amounts
    const realOrders = [
      {
        id: Date.now() - 5000,
        code: '#EXP-4921',
        customerName: 'Santiago Rodríguez',
        waiter: 'Sofía R.',
        fulfillmentType: 'pos',
        paymentMethod: 'Efectivo',
        itemsSummary: '1x Combo Mega CRASH Supreme, 1x Papas Cheddar & Bacon',
        itemsJson: JSON.stringify([
          { name: 'Combo Mega CRASH Supreme', qty: 1, price: 9200.0, options: { size: 'Doble', extras: [{ name: '+ Queso Cheddar Extra', price: 1500.0 }] } },
          { name: 'Papas Fritas Cheddar & Bacon', qty: 1, price: 3200.0 }
        ]),
        total: 13900.0,
        cashAmount: 15000.0,
        changeAmount: 1100.0,
        status: 'Aceptado',
        date: new Date().toLocaleString()
      },
      {
        id: Date.now() - 10000,
        code: '#MESA-104',
        customerName: 'Mesa 4 (Planta Baja)',
        waiter: 'Lucas M.',
        fulfillmentType: 'dinein',
        paymentMethod: 'MercadoPago',
        address: 'Mesa: 4 (Salón)',
        itemsSummary: '2x CRASH Double Bacon Supreme, 2x Coca-Cola Zero',
        itemsJson: JSON.stringify([
          { name: 'CRASH Double Bacon Supreme', qty: 2, price: 6900.0, options: { size: 'Doble', extras: [{ name: '+ Bacon Ahumado', price: 1500.0 }] } },
          { name: 'Coca-Cola Zero 500ml', qty: 2, price: 1800.0 }
        ]),
        total: 20400.0,
        status: 'Aceptado',
        date: new Date().toLocaleString()
      },
      {
        id: Date.now() - 15000,
        code: '#ORD-9023',
        customerName: 'Valeria Gómez',
        customerPhone: '+54 9 11 5544-2211',
        fulfillmentType: 'delivery',
        paymentMethod: 'Tarjeta',
        address: 'Av. Corrientes 1450, 6B (Delivery)',
        itemsSummary: '1x Triple Beast Angus Burger, 1x Milkshake Oreo',
        itemsJson: JSON.stringify([
          { name: 'Triple Beast Angus Burger', qty: 1, price: 8500.0, options: { size: 'Triple' } },
          { name: 'Milkshake Dulce de Leche & Oreo', qty: 1, price: 3400.0 }
        ]),
        total: 11900.0,
        status: 'Pendiente',
        date: new Date().toLocaleString()
      }
    ];

    // Set state
    setProducts(realProducts);
    setCategories(realCategories);
    setInventory(realInventory);
    setOrders(realOrders);

    // Save to LocalStorage
    try {
      localStorage.setItem('crm_orders_real_db_v3', JSON.stringify(realOrders));
      localStorage.setItem('crm_inventory_db_v3', JSON.stringify(realInventory));
    } catch (e) {}

    showToast('🎉 ¡Base de Datos cargada con TEST DATA REAL (Menús, Combos, PNGs Transparentes y Stock)!');
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
      handleAddIngredient,
      loadRealTestData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
