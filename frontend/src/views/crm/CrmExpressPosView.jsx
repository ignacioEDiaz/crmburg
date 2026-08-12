import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Plus, Minus, Trash2, Printer, CheckCircle2, Zap, DollarSign, CreditCard, QrCode, ArrowRight, User, Phone, MapPin, Calculator, ChefHat, Bike, History, Utensils, Edit3, X, Sparkles, Check, Package } from 'lucide-react';
import TicketPrintModal from '../../components/TicketPrintModal';

export default function CrmExpressPosView() {
  const context = useApp() || {};
  const products = Array.isArray(context.products) ? context.products : [];
  const categories = Array.isArray(context.categories) ? context.categories : [];
  const orders = Array.isArray(context.orders) ? context.orders : [];
  const inventory = Array.isArray(context.inventory) ? context.inventory : [];
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

  // Dynamically derive available Extras & Aditivos 100% from REAL INVENTORY!
  const inventoryExtrasList = inventory.map(item => {
    let defaultPrice = 1.00;
    const lower = (item.name || '').toLowerCase();
    if (lower.includes('carne') || lower.includes('medallon') || lower.includes('pollo')) defaultPrice = 2.50;
    else if (lower.includes('cheddar') || lower.includes('queso') || lower.includes('bacon') || lower.includes('panceta')) defaultPrice = 1.50;
    else if (lower.includes('salsa') || lower.includes('barbacoa') || lower.includes('cebolla')) defaultPrice = 0.90;
    else if (lower.includes('papa')) defaultPrice = 2.00;

    return {
      id: item.id || `inv-${item.name}`,
      inventoryId: item.id,
      name: item.name.startsWith('+') ? item.name : `+ ${item.name}`,
      rawName: item.name,
      price: item.price || defaultPrice,
      stockQuantity: item.stockQuantity || 0,
      unit: item.unit || 'unidades',
      category: item.category || 'Insumo'
    };
  });

  const REMOVALS_LIST = [
    'Sin Pepinillos',
    'Sin Cebolla',
    'Sin Mayonesa / Salsa',
    'Sin Tomate',
    'Sin Queso',
  ];

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

  // Cart operations
  const addToPosCart = (product, customize = true) => {
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
      if (customize) {
        setEditingCartIndex(newCart.length - 1);
      }
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

    if ((extraObj.stockQuantity || 0) <= 0) {
      showToast(`⚠️ "${extraObj.rawName}" no tiene stock suficiente en el inventario`);
      return;
    }

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
          extras: item.options?.extras || [],
          removals: item.options?.removals || [],
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
      address: fulfillmentType === 'dinein' ? `Mesa: ${tableNumber || 'Salón'}` : (fulfillmentType === 'delivery' ? (deliveryAddress || 'Domicilio') : 'Retiro en Mostrador'),
      paymentMethod,
      itemsSummary: formattedItems.map(i => `${i.qty}x ${i.name}`).join(', '),
      itemsJson: JSON.stringify(formattedItems),
      items: formattedItems,
      total: Number(total.toFixed(2)),
      cashAmount: paymentMethod === 'Efectivo' ? cashPaid : total,
      changeAmount: paymentMethod === 'Efectivo' ? changeDue : 0,
      date: new Date().toLocaleString(),
      status: 'Aceptado'
    };

    // Save & Deduct Stock from Inventory
    placeOrder(newOrder);

    // Prepare Thermal Ticket Print
    setPrintingOrder(newOrder);
    setTicketType(targetTicketType);

    // Reset POS form
    clearPosCart();
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setDeliveryAddress('');
  };

  const activeEditingItem = editingCartIndex !== null ? expressCart[editingCartIndex] : null;

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* Thermal Ticket Printer Modal */}
      {printingOrder && ticketType && (
        <TicketPrintModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => {
            setPrintingOrder(null);
            setTicketType(null);
          }}
        />
      )}

      {/* ================= MODAL: EDITAR EXTRAS Y ADITIVOS DESDE INVENTARIO ================= */}
      {activeEditingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffb700]" />
                <div>
                  <h3 className="font-black text-white text-base">Aditivos y Extras: {activeEditingItem.name}</h3>
                  <p className="text-xs text-[#ffb700] font-mono font-bold">Precio Unitario: ${activeEditingItem.price.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCartIndex(null)}
                className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="space-y-4 text-xs">
              
              {/* 1. TAMAÑO / PRESENTACION */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block">1. Tamaño / Presentación:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sencilla', 'Doble', 'Triple'].map((size) => {
                    const isSel = (activeEditingItem.options?.size || 'Doble') === size;
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

              {/* 2. AGREGAR ADITIVOS EXTRAS (CONECTADOS 100% AL INVENTARIO DE LA TIENDA) */}
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-[#ffb700]" />
                    2. Aditivos y Extras Cargados en el Inventario:
                  </label>
                  <span className="text-[10px] text-neutral-400 font-bold">Descuenta de stock al cobrar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto hide-scrollbar pr-1">
                  {inventoryExtrasList.map((extra) => {
                    const isSelected = (activeEditingItem.options?.extras || []).some(e => e.id === extra.id);
                    const isOutOfStock = (extra.stockQuantity || 0) <= 0;

                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtraInItem(extra)}
                        disabled={isOutOfStock}
                        className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between text-left ${
                          isOutOfStock ? 'opacity-40 cursor-not-allowed bg-[#1c1c1e] border-white/5' : (
                            isSelected ? 'bg-amber-500/20 border-[#ffb700] text-[#ffb700] font-black' : 'bg-[#242426] border-white/10 text-neutral-300 hover:text-white'
                          )
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isSelected ? 'bg-[#ffb700] text-black' : 'border border-neutral-500'}`}>
                            {isSelected ? '✓' : '+'}
                          </div>
                          <div className="min-w-0">
                            <span className="truncate block">{extra.name}</span>
                            <span className="text-[9px] text-neutral-400 block">Stock: {extra.stockQuantity} {extra.unit}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] shrink-0 font-black text-[#ffb700]">+${extra.price.toFixed(2)}</span>
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
              ✓ GUARDAR ADITIVOS Y CONTINUAR TICKET
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Mostrador Express POS (Caja)</h1>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Terminal Rápida
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-bold">
            Toma pedidos en mostrador en segundos, calcula el vuelto e imprime comanda de cocina o cliente en 1-Tap.
          </p>
        </div>

        {/* Tab Switcher: Terminal vs History */}
        <div className="flex items-center gap-1 bg-[#242426] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setPosTab('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              posTab === 'terminal' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Terminal Caja</span>
          </button>

          <button
            onClick={() => setPosTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              posTab === 'history' ? 'bg-[#ffb700] text-black font-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial POS ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Grid */}
      {posTab === 'terminal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          
          {/* LEFT 7 COLS: TOUCH CATALOG OF PRODUCTS */}
          <div className="lg:col-span-7 flex flex-col gap-md">
            
            {/* Search Bar & Touch Categories Bar */}
            <div className="flex flex-col gap-3 bg-[#18181b] p-4 rounded-3xl border border-white/10 shadow-xl">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o código (ej. Supreme, 102)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
                {['Favoritos', 'Todas', ...categories.map(c => c?.name || c)].map((catName) => {
                  const isActive = selectedCategory === catName;
                  return (
                    <button
                      key={typeof catName === 'string' ? catName : Math.random()}
                      onClick={() => setSelectedCategory(catName)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 whitespace-nowrap ${
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
                    onClick={() => addToPosCart(product, true)}
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

          {/* RIGHT 5 COLS: EXPRESS POS CART & CASHIER CHECKOUT */}
          <div className="lg:col-span-5 flex flex-col gap-md">
            
            <div className="bg-[#18181b] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
              
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ffb700]" />
                  <h3 className="font-black text-white text-base">Ticket de Venta POS</h3>
                </div>

                {expressCart.length > 0 && (
                  <button
                    onClick={clearPosCart}
                    className="text-xs text-rose-400 hover:text-rose-300 font-extrabold flex items-center gap-1 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar
                  </button>
                )}
              </div>

              {/* Order Mode Switcher: Retiro / Salón / Delivery */}
              <div className="grid grid-cols-3 gap-1 bg-[#242426] p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setFulfillmentType('takeaway')}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    fulfillmentType === 'takeaway' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Mostrador
                </button>

                <button
                  onClick={() => setFulfillmentType('dinein')}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    fulfillmentType === 'dinein' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Salón
                </button>

                <button
                  onClick={() => setFulfillmentType('delivery')}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    fulfillmentType === 'delivery' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  Delivery
                </button>
              </div>

              {/* Customer Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold block mb-0.5">Nombre Cliente:</label>
                  <input
                    type="text"
                    placeholder="Ej. Martín"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#ffb700]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-bold block mb-0.5">Teléfono (WhatsApp):</label>
                  <input
                    type="tel"
                    placeholder="11 5555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#ffb700]"
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-[30vh] overflow-y-auto hide-scrollbar pr-1 border-t border-b border-white/10 py-3">
                {expressCart.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 font-bold text-xs space-y-1">
                    <p>Toca productos del catálogo para cargar el ticket.</p>
                    <p className="text-[10px] text-neutral-600 font-normal">Toca en la tarjeta para elegir aditivos y extras de inventario.</p>
                  </div>
                ) : (
                  expressCart.map((item, index) => {
                    const extrasStr = (item.options?.extras || []).map(e => e.name).join(', ');
                    const removalsStr = (item.options?.removals || []).join(', ');
                    const notesStr = item.options?.notes ? `[Nota: ${item.options.notes}]` : '';

                    return (
                      <div
                        key={index}
                        className="bg-[#242426] border border-white/10 rounded-2xl p-3 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <h5 className="font-extrabold text-white truncate text-xs">{item.name}</h5>
                            <span className="font-mono text-[#ffb700] font-black text-xs">
                              ${((item.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingCartIndex(index)}
                              className="p-1.5 rounded-xl bg-[#18181b] text-neutral-400 hover:text-[#ffb700] border border-white/10 transition-colors"
                              title="Editar extras de inventario"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-white/10">
                              <button
                                onClick={() => updateQuantity(index, -1)}
                                className="w-5 h-5 rounded-lg bg-[#242426] flex items-center justify-center font-black text-white hover:bg-[#ffb700] hover:text-black text-xs"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-black text-white font-mono">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(index, 1)}
                                className="w-5 h-5 rounded-lg bg-[#242426] flex items-center justify-center font-black text-white hover:bg-[#ffb700] hover:text-black text-xs"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromPosCart(index)}
                              className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Options summary breakdown */}
                        {(item.options?.size || extrasStr || removalsStr || notesStr) && (
                          <div className="text-[10px] text-neutral-400 font-bold bg-[#18181b] p-1.5 rounded-xl leading-tight space-y-0.5 border border-white/5">
                            {item.options?.size && <p className="text-[#ffb700]">• Tamaño: {item.options.size}</p>}
                            {extrasStr && <p className="text-emerald-400">• Extras: {extrasStr}</p>}
                            {removalsStr && <p className="text-rose-400">• {removalsStr}</p>}
                            {notesStr && <p className="text-sky-300">{notesStr}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Medio de Pago:</label>
                <div className="grid grid-cols-4 gap-1 bg-[#242426] p-1 rounded-2xl border border-white/10 text-xs">
                  {['Efectivo', 'MercadoPago', 'Tarjeta', 'Transferencia'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-1.5 text-[10px] rounded-xl font-bold transition-all ${
                        paymentMethod === method ? 'bg-[#ffb700] text-black font-black shadow-md' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* Cash Calculator if Efectivo */}
                {paymentMethod === 'Efectivo' && (
                  <div className="bg-[#242426] p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block">Paga con ($):</span>
                      <input
                        type="number"
                        placeholder="Ej. 10000"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="w-28 bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-mono font-black outline-none focus:border-[#ffb700]"
                      />
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 font-bold block">Vuelto a Entregar:</span>
                      <span className="font-mono text-xl font-black text-[#ffb700]">${changeDue.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Total & Checkout Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center bg-[#242426] p-3 rounded-2xl border border-white/10">
                  <span className="font-bold text-white text-sm">TOTAL A COBRAR:</span>
                  <span className="font-mono text-2xl font-black text-emerald-400">${total.toFixed(2)}</span>
                </div>

                {/* 1-Tap Print & Charge Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleConfirmAndPay('cocina')}
                    className="py-3 rounded-2xl bg-[#242428] hover:bg-[#323236] text-white font-extrabold text-xs border border-white/15 flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <ChefHat className="w-4 h-4 text-emerald-400" />
                    🚀 COBRAR Y MANDAR A COCINA
                  </button>

                  <button
                    onClick={() => handleConfirmAndPay('cliente')}
                    className="py-3 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xl active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    ⚡ COBRAR Y EMITIR TICKET
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* POS HISTORY VIEW */
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-white text-lg">Historial de Ventas POS Hoy</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Origen</th>
                  <th className="py-3 px-4">Medio de Pago</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Reimprimir Comanda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#222226] transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-[#ffb700]">{o.code}</td>
                    <td className="py-3 px-4 font-bold text-white">{o.customerName}</td>
                    <td className="py-3 px-4 text-neutral-300 font-bold">{o.address || 'Mostrador'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{o.paymentMethod || 'Efectivo'}</td>
                    <td className="py-3 px-4 font-mono font-black text-base text-white">${Number(o.total || 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => { setPrintingOrder(o); setTicketType('cliente'); }}
                        className="px-3 py-1.5 rounded-xl bg-[#242426] hover:bg-[#ffb700] hover:text-black text-white font-extrabold transition-all"
                      >
                        🖨️ Reimprimir Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
