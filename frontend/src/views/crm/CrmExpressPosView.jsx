import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Plus, Minus, Trash2, Printer, CheckCircle2, Zap, DollarSign, CreditCard, QrCode, ArrowRight, User, Phone, MapPin, Calculator, ChefHat, Bike, History, Utensils, Edit3, X, Sparkles, Check } from 'lucide-react';
import TicketPrintModal from '../../components/TicketPrintModal';

export default function CrmExpressPosView() {
  const context = useApp() || {};
  const products = Array.isArray(context.products) ? context.products : [];
  const categories = Array.isArray(context.categories) ? context.categories : [];
  const orders = Array.isArray(context.orders) ? context.orders : [];
  const placeOrder = typeof context.placeOrder === 'function' ? context.placeOrder : () => {};
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  const [posTab, setPosTab] = useState('terminal'); // 'terminal' | 'history'
  const [selectedCategory, setSelectedCategory] = useState('Favoritos');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Express Order State
  const [expressCart, setExpressCart] = useState([]);
  const [fulfillmentType, setFulfillmentType] = useState('takeaway'); // 'takeaway' | 'dinein' | 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo'); // 'Efectivo' | 'MercadoPago' | 'Tarjeta' | 'Transferencia'
  const [cashAmount, setCashAmount] = useState('');

  // Editing Extras/Additives Modal State
  const [editingCartIndex, setEditingCartIndex] = useState(null);

  // Print Ticket State
  const [printingOrder, setPrintingOrder] = useState(null);
  const [ticketType, setTicketType] = useState(null);

  // Helper to map categories for quick grid
  const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('favorito')) return 'star';
    if (lower === 'todas') return 'grid_view';
    if (lower.includes('hamburguesa')) return 'lunch_dining';
    if (lower.includes('pizza')) return 'local_pizza';
    if (lower.includes('pollo') || lower.includes('milanesa')) return 'kebab';
    if (lower.includes('papa') || lower.includes('guarnicion')) return 'fastfood';
    if (lower.includes('bebida')) return 'local_bar';
    return 'restaurant';
  };

  // Filter products safely by selected category / search
  const filteredProducts = products.filter(p => {
    if (!p) return false;
    const pName = (p.name || '').toLowerCase();
    const pId = (p.id || '').toString();
    const matchesSearch = pName.includes(searchQuery.toLowerCase()) || pId.includes(searchQuery);
    if (selectedCategory === 'Favoritos') {
      return matchesSearch && (p.isPopular || (p.price && p.price > 0));
    }
    if (selectedCategory === 'Todas') {
      return matchesSearch;
    }
    return matchesSearch && p.category === selectedCategory;
  });

  // Available Aditives / Extras Definition
  const EXTRAS_LIST = [
    { id: 'addCheese', name: '+ Queso Cheddar Extra', price: 1.50 },
    { id: 'extraPatty', name: '+ Medallón de Carne Extra', price: 2.50 },
    { id: 'extraBacon', name: '+ Bacon Crocante Extra', price: 1.50 },
    { id: 'extraOnion', name: '+ Cebolla Caramelizada', price: 1.00 },
    { id: 'extraEgg', name: '+ Huevo Frito Extra', price: 1.00 },
    { id: 'extraSauce', name: '+ Salsa Especial CRASH', price: 0.75 },
    { id: 'extraFries', name: '+ Papas Fritas Extra', price: 2.00 },
  ];

  const REMOVALS_LIST = [
    'Sin Pepinillos',
    'Sin Cebolla',
    'Sin Mayonesa / Salsa',
    'Sin Tomate',
    'Sin Queso',
  ];

  // Cart operations
  const addToPosCart = (product) => {
    if (!product) return;
    setExpressCart(prev => {
      const basePrice = Number(product.price || 0);
      const newItem = {
        ...product,
        basePrice,
        price: basePrice,
        quantity: 1,
        options: {
          size: 'Doble',
          extras: [],
          removals: [],
          notes: ''
        }
      };
      const newCart = [...prev, newItem];
      // Automatically open extras editing for the newly added item
      setEditingCartIndex(newCart.length - 1);
      return newCart;
    });
  };

  const updateQuantity = (index, delta) => {
    setExpressCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromPosCart = (index) => {
    setExpressCart(prev => prev.filter((_, i) => i !== index));
    if (editingCartIndex === index) {
      setEditingCartIndex(null);
    }
  };

  const clearPosCart = () => {
    setExpressCart([]);
    setCashAmount('');
    setEditingCartIndex(null);
  };

  // Toggle Extra in Item
  const toggleExtraInItem = (extraObj) => {
    if (editingCartIndex === null || !expressCart[editingCartIndex]) return;

    setExpressCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      const currentExtras = item.options.extras || [];
      
      const exists = currentExtras.some(e => e.id === extraObj.id);
      let newExtras = [];
      if (exists) {
        newExtras = currentExtras.filter(e => e.id !== extraObj.id);
      } else {
        newExtras = [...currentExtras, extraObj];
      }

      // Recalculate price
      const extrasSum = newExtras.reduce((sum, e) => sum + e.price, 0);
      let sizeExtra = 0;
      if (item.options.size === 'Doble') sizeExtra = 0;
      if (item.options.size === 'Triple') sizeExtra = 2.00;

      item.options = { ...item.options, extras: newExtras };
      item.price = item.basePrice + extrasSum + sizeExtra;
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  // Toggle Removal in Item
  const toggleRemovalInItem = (removalName) => {
    if (editingCartIndex === null || !expressCart[editingCartIndex]) return;

    setExpressCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      const currentRemovals = item.options.removals || [];

      const exists = currentRemovals.includes(removalName);
      let newRemovals = [];
      if (exists) {
        newRemovals = currentRemovals.filter(r => r !== removalName);
      } else {
        newRemovals = [...currentRemovals, removalName];
      }

      item.options = { ...item.options, removals: newRemovals };
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  // Set Size in Item
  const setSizeInItem = (sizeName) => {
    if (editingCartIndex === null || !expressCart[editingCartIndex]) return;

    setExpressCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      
      let sizeExtra = 0;
      if (sizeName === 'Triple') sizeExtra = 2.00;

      const extrasSum = (item.options.extras || []).reduce((sum, e) => sum + e.price, 0);
      item.options = { ...item.options, size: sizeName };
      item.price = item.basePrice + extrasSum + sizeExtra;
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  // Set Notes in Item
  const setNotesInItem = (notesText) => {
    if (editingCartIndex === null || !expressCart[editingCartIndex]) return;

    setExpressCart(prev => {
      const updated = [...prev];
      const item = { ...updated[editingCartIndex] };
      item.options = { ...item.options, notes: notesText };
      updated[editingCartIndex] = item;
      return updated;
    });
  };

  // Calculations
  const subtotal = expressCart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const total = subtotal;
  const cashPaid = parseFloat(cashAmount) || 0;
  const changeDue = Math.max(0, cashPaid - total);

  // Submit Express POS Order
  const handleConfirmAndPay = (targetTicketType = 'cliente') => {
    if (expressCart.length === 0) {
      showToast('⚠️ Agrega productos al ticket antes de cobrar');
      return;
    }

    const orderCode = `#EXP-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedItems = expressCart.map(item => {
      const extrasStr = (item.options?.extras || []).map(e => e.name).join(', ');
      const removalsStr = (item.options?.removals || []).join(', ');
      const notesStr = item.options?.notes ? `[Nota: ${item.options.notes}]` : '';
      const summaryParts = [
        item.options?.size ? `Tamaño: ${item.options.size}` : '',
        extrasStr,
        removalsStr,
        notesStr
      ].filter(Boolean).join(' | ');

      return {
        id: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        options: {
          size: item.options?.size || 'Doble',
          addCheese: (item.options?.extras || []).some(e => e.id === 'addCheese'),
          extraPatty: (item.options?.extras || []).some(e => e.id === 'extraPatty'),
          summaryText: summaryParts
        }
      };
    });

    const newOrder = {
      id: Date.now(),
      code: orderCode,
      customerName: customerName.trim() || 'Cliente Mostrador',
      customerPhone: customerPhone.trim() ? `+54 9 ${customerPhone.trim()}` : '+54 9 --',
      fulfillmentType,
      address: fulfillmentType === 'delivery' ? (deliveryAddress || 'Delivery Express') : (fulfillmentType === 'dinein' ? `Mesa ${tableNumber || '1'}` : 'Retiro en Mostrador Express'),
      paymentMethod,
      itemsSummary: formattedItems.map(i => `${i.qty}x ${i.name} ${i.options.summaryText ? `(${i.options.summaryText})` : ''}`).join('; '),
      itemsJson: JSON.stringify(formattedItems),
      total,
      date: new Date().toLocaleString(),
      status: 'Aceptado'
    };

    // Place order into global app context
    placeOrder(newOrder);

    showToast(`⚡ Pedido ${orderCode} cobrado ($${total.toFixed(2)})`);

    // Open Thermal Ticket Print Modal immediately
    setPrintingOrder(newOrder);
    setTicketType(targetTicketType);

    // Reset Form
    setExpressCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setDeliveryAddress('');
    setCashAmount('');
    setEditingCartIndex(null);
  };

  // Express History Filter (orders today)
  const expressOrdersToday = orders.filter(o => o && o.code && typeof o.code === 'string' && o.code.startsWith('#EXP'));

  const activeEditingItem = editingCartIndex !== null ? expressCart[editingCartIndex] : null;

  return (
    <div className="flex flex-col w-full gap-lg font-sans relative">
      
      {/* Thermal Ticket Modal */}
      {printingOrder && ticketType && (
        <TicketPrintModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => { setPrintingOrder(null); setTicketType(null); }}
        />
      )}

      {/* ================= POS EXTRAS & ADITIVOS CUSTOMIZATION MODAL ================= */}
      {activeEditingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#18181b] border border-[#ffb700]/40 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffb700]" />
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg">Aditivos y Extras: {activeEditingItem.name}</h3>
                  <p className="text-xs text-[#ffb700] font-mono font-bold">Precio Unitario: ${activeEditingItem.price.toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={() => setEditingCartIndex(null)}
                className="w-8 h-8 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customization Options Body */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar pr-1 text-xs">
              
              {/* 1. TAMAÑO DE HAMBURGUESA / PORCIÓN */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block">1. Tamaño / Presentación:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sencilla', 'Doble', 'Triple'].map((size) => {
                    const isSel = activeEditingItem.options?.size === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSizeInItem(size)}
                        className={`py-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center justify-between ${
                          isSel ? 'bg-[#ffb700] text-black border-[#ffb700] shadow-md' : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <span>{size}</span>
                        {size === 'Triple' && <span className="text-[10px] opacity-80">+$2.00</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. AGREGAR ADITIVOS EXTRAS (Suma al precio) */}
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block">2. Aditivos y Agregados (Extras):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXTRAS_LIST.map((extra) => {
                    const isSelected = (activeEditingItem.options?.extras || []).some(e => e.id === extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtraInItem(extra)}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between text-left ${
                          isSelected ? 'bg-amber-500/20 border-[#ffb700] text-[#ffb700] font-black' : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-[#ffb700] text-black' : 'border border-neutral-500'}`}>
                            {isSelected ? '✓' : '+'}
                          </div>
                          <span className="truncate">{extra.name}</span>
                        </div>
                        <span className="font-mono text-[11px] shrink-0">+${extra.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. QUITAR INGREDIENTES (Sin costo) */}
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block">3. Quitar Ingredientes (Sin costo):</label>
                <div className="flex flex-wrap gap-1.5">
                  {REMOVALS_LIST.map((rem) => {
                    const isRemoved = (activeEditingItem.options?.removals || []).includes(rem);
                    return (
                      <button
                        key={rem}
                        onClick={() => toggleRemovalInItem(rem)}
                        className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          isRemoved ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-black' : 'bg-[#242426] border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isRemoved ? `🚫 ${rem}` : rem}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. NOTA PARA COCINA */}
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block">4. Aclaración / Nota para Cocina:</label>
                <input
                  type="text"
                  placeholder="Ej: Carne bien cocida, sin sal en papas..."
                  value={activeEditingItem.options?.notes || ''}
                  onChange={(e) => setNotesInItem(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                />
              </div>

            </div>

            {/* Modal Confirm Action */}
            <button
              onClick={() => setEditingCartIndex(null)}
              className="w-full py-3 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              GUARDAR ADITIVOS Y CONTINUAR TICKET
            </button>

          </div>
        </div>
      )}

      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ffb700] text-black rounded-2xl shadow-lg">
              <Zap className="w-6 h-6 fill-black" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Mostrador Express POS</h1>
              <p className="text-xs text-neutral-400 font-bold">Terminal de Cobro Rápido en Caja con Personalización de Aditivos</p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Pedidos vs Historial */}
        <div className="flex items-center gap-2 bg-[#242426] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setPosTab('terminal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              posTab === 'terminal' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            Terminal POS
          </button>

          <button
            onClick={() => setPosTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              posTab === 'history' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            Historial Express ({expressOrdersToday.length})
          </button>
        </div>
      </div>

      {posTab === 'terminal' ? (
        /* MAIN POS TERMINAL SPLIT SCREEN */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          
          {/* ================= LEFT SIDE: PRODUCT CATALOG & TOUCH GRID (8 COLS) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-md">
            
            {/* Search & Categories Bar */}
            <div className="flex flex-col gap-sm bg-[#18181b] p-4 rounded-3xl border border-white/10 shadow-xl">
              
              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código (ej. Smash, Pollo, 102)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700] transition-colors"
                />
              </div>

              {/* Touch Category Selector Tiles */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
                {['Favoritos', 'Todas', ...categories.map(c => c?.name || c)].map((catName) => {
                  const isActive = selectedCategory === catName;
                  return (
                    <button
                      key={typeof catName === 'string' ? catName : Math.random()}
                      onClick={() => setSelectedCategory(catName)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 whitespace-nowrap ${
                        isActive
                          ? 'bg-[#ffb700] text-black font-black shadow-md scale-105'
                          : 'bg-[#242426] border border-white/10 text-neutral-300 hover:text-white hover:bg-[#2c2c30]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {getCategoryIcon(catName)}
                      </span>
                      <span>{catName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Touch Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-md">
              {filteredProducts.map((product) => {
                const inCartItem = expressCart.find(i => i.id === product.id);
                const count = inCartItem ? inCartItem.quantity : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => addToPosCart(product)}
                    className="group relative bg-[#18181b] hover:bg-[#222226] border border-white/10 hover:border-[#ffb700]/60 rounded-3xl p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 shadow-xl active:scale-95 select-none"
                  >
                    {/* Quantity Badge if added */}
                    {count > 0 && (
                      <span className="absolute top-2.5 right-2.5 z-20 bg-[#ffb700] text-black font-black text-xs px-2.5 py-1 rounded-full shadow-lg border border-black/20 animate-bounce">
                        {count}x en ticket
                      </span>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-28 relative flex items-center justify-center my-1">
                      <img
                        src={product.image || '/images/burger-supreme.jpg'}
                        alt={product.name}
                        className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Info */}
                    <div className="mt-2 space-y-1">
                      <h4 className="font-extrabold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-[#ffb700] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="font-mono text-[#ffb700] font-black text-sm">
                          ${Number(product.price || 0).toFixed(2)}
                        </span>
                        <span className="w-7 h-7 rounded-full bg-[#ffb700]/10 group-hover:bg-[#ffb700] text-[#ffb700] group-hover:text-black font-bold flex items-center justify-center text-xs transition-colors">
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ================= RIGHT SIDE: FIXED POS TICKET & CHECKOUT PANEL (5 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#18181b] border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl space-y-4 sticky top-24">
            
            <div>
              {/* Ticket Header & Fulfillment Switcher */}
              <div className="border-b border-white/10 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#ffb700]" />
                    <h3 className="font-black text-white text-lg tracking-tight">Ticket Express</h3>
                  </div>
                  {expressCart.length > 0 && (
                    <button
                      onClick={clearPosCart}
                      className="text-xs text-rose-400 hover:text-white font-bold flex items-center gap-1 underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Limpiar
                    </button>
                  )}
                </div>

                {/* 3 Fulfillment Modes */}
                <div className="grid grid-cols-3 gap-1.5 bg-[#242426] p-1 rounded-2xl border border-white/10 text-xs">
                  <button
                    onClick={() => setFulfillmentType('takeaway')}
                    className={`py-1.5 px-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                      fulfillmentType === 'takeaway' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Mostrador</span>
                  </button>

                  <button
                    onClick={() => setFulfillmentType('dinein')}
                    className={`py-1.5 px-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                      fulfillmentType === 'dinein' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Mesa</span>
                  </button>

                  <button
                    onClick={() => setFulfillmentType('delivery')}
                    className={`py-1.5 px-1 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${
                      fulfillmentType === 'delivery' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Quick Customer Info Fields */}
              <div className="py-3 border-b border-white/10 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Cliente (opcional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-[#242426] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-[#242426] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                  />
                </div>

                {fulfillmentType === 'dinein' && (
                  <input
                    type="text"
                    placeholder="Número de Mesa (ej. Mesa 3)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                  />
                )}

                {fulfillmentType === 'delivery' && (
                  <input
                    type="text"
                    placeholder="Dirección completa y entrecalles"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                  />
                )}
              </div>

              {/* Cart Items Summary List */}
              <div className="my-3 space-y-2 max-h-[30vh] overflow-y-auto hide-scrollbar pr-1">
                {expressCart.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 space-y-1">
                    <ShoppingBag className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs font-bold">Ticket vacío</p>
                    <p className="text-[11px]">Toca productos de la izquierda para sumar.</p>
                  </div>
                ) : (
                  expressCart.map((item, idx) => {
                    const extrasList = item.options?.extras || [];
                    const removalsList = item.options?.removals || [];
                    const hasExtras = extrasList.length > 0 || removalsList.length > 0 || item.options?.size !== 'Doble' || item.options?.notes;

                    return (
                      <div key={idx} className="bg-[#242426] border border-white/10 p-2.5 rounded-2xl flex flex-col gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-white truncate">{item.name}</p>
                            <p className="text-[11px] text-[#ffb700] font-mono font-black">
                              ${((item.price || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Edit Aditives Button */}
                            <button
                              onClick={() => setEditingCartIndex(idx)}
                              className="px-2 py-1 bg-[#18181b] hover:bg-[#ffb700] hover:text-black text-[#ffb700] border border-white/10 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all"
                              title="Editar aditivos y extras"
                            >
                              <Edit3 className="w-3 h-3" />
                              Extras
                            </button>

                            {/* Qty +/- */}
                            <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-white/10">
                              <button
                                onClick={() => updateQuantity(idx, -1)}
                                className="w-5 h-5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-4 text-center font-black text-white text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(idx, 1)}
                                className="w-5 h-5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Extras Breakdown Tag Row */}
                        {hasExtras && (
                          <div className="flex flex-wrap gap-1 text-[10px] bg-[#18181b] p-1.5 rounded-xl border border-white/5">
                            {item.options?.size && <span className="bg-neutral-800 text-neutral-300 font-bold px-1.5 py-0.5 rounded-md">• {item.options.size}</span>}
                            {extrasList.map((e, ei) => (
                              <span key={ei} className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-md">• {e.name}</span>
                            ))}
                            {removalsList.map((r, ri) => (
                              <span key={ri} className="bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded-md">• {r}</span>
                            ))}
                            {item.options?.notes && (
                              <span className="bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded-md">📝 {item.options.notes}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Payment Methods & Total */}
            {expressCart.length > 0 && (
              <div className="border-t border-white/10 pt-3 space-y-3">
                
                {/* 4 Payment Methods Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Medio de Pago:</label>
                  <div className="grid grid-cols-4 gap-1 bg-[#242426] p-1 rounded-xl border border-white/10 text-[11px]">
                    {[
                      { id: 'Efectivo', label: 'Efectivo', icon: DollarSign },
                      { id: 'MercadoPago', label: 'MP / QR', icon: QrCode },
                      { id: 'Tarjeta', label: 'Tarjeta', icon: CreditCard },
                      { id: 'Transferencia', label: 'Transf', icon: Zap },
                    ].map((pm) => {
                      const IconComp = pm.icon;
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`py-1.5 px-1 rounded-lg font-extrabold flex flex-col items-center gap-0.5 transition-all ${
                            isSelected ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cash Change Calculator */}
                {paymentMethod === 'Efectivo' && (
                  <div className="bg-[#242426] p-2.5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-bold">Paga con ($):</span>
                      <input
                        type="number"
                        placeholder="Ej. 20000"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-28 bg-[#18181b] border border-white/10 rounded-xl px-2 py-1 text-right text-xs font-mono font-black text-white outline-none focus:border-[#ffb700]"
                      />
                    </div>

                    {cashPaid > 0 && (
                      <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1">
                        <span className="text-emerald-400 font-bold">Vuelto a entregar:</span>
                        <span className="font-mono font-black text-emerald-300 text-sm">${changeDue.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Big Total Banner */}
                <div className="flex justify-between items-center bg-[#242426] p-3 rounded-2xl border border-white/10">
                  <span className="font-bold text-white text-sm">TOTAL A COBRAR:</span>
                  <span className="font-mono text-[#ffb700] text-2xl font-black">${total.toFixed(2)}</span>
                </div>

                {/* Confirm & Print Ticket Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleConfirmAndPay('cliente')}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ⚡ CONFIRMAR Y COBRAR
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleConfirmAndPay('cocina')}
                      className="py-2 rounded-xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-neutral-300 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-white/10 transition-all"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Comanda Cocina
                    </button>

                    <button
                      onClick={() => handleConfirmAndPay('delivery')}
                      className="py-2 rounded-xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-neutral-300 font-extrabold text-[11px] flex items-center justify-center gap-1 border border-white/10 transition-all"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      Ticket Delivery
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      ) : (
        /* EXPRESS HISTORY TAB */
        <div className="space-y-md">
          <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <History className="w-5 h-5 text-[#ffb700]" />
              Ventas de Mostrador Express de Hoy
            </h3>

            {expressOrdersToday.length === 0 ? (
              <p className="text-neutral-400 text-sm font-bold py-6 text-center">
                Aún no se han registrado ventas express hoy. Realiza un cobro desde la terminal POS.
              </p>
            ) : (
              <div className="space-y-3">
                {expressOrdersToday.map((order) => (
                  <div key={order.id} className="bg-[#242426] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-[#ffb700] font-black text-base">{order.code}</span>
                      <p className="text-xs text-white font-bold">{order.customerName} • {order.paymentMethod || 'Efectivo'}</p>
                      <p className="text-[11px] text-neutral-400">{order.date}</p>
                      <p className="text-xs text-neutral-300 mt-1 font-mono">{order.itemsSummary}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xl font-black text-emerald-400">${Number(order.total || 0).toFixed(2)}</span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setPrintingOrder(order); setTicketType('cliente'); }}
                          className="px-3 py-1.5 rounded-xl bg-[#ffb700] text-[#000000] font-black text-xs hover:bg-yellow-300 transition-colors flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Reimprimir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
