import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Plus, Minus, Trash2, Printer, CheckCircle2, Zap, DollarSign, CreditCard, QrCode, ArrowRight, User, Phone, MapPin, Calculator, ChefHat, Bike, History } from 'lucide-react';
import TicketPrintModal from '../../components/TicketPrintModal';

export default function CrmExpressPosView() {
  const { products, categories, placeOrder, orders, showToast, handleAcceptOrder } = useApp();

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

  // Filter products by selected category / search
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery);
    if (selectedCategory === 'Favoritos') {
      return matchesSearch && (p.isPopular || p.price > 0);
    }
    if (selectedCategory === 'Todas') {
      return matchesSearch;
    }
    return matchesSearch && p.category === selectedCategory;
  });

  // Cart operations
  const addToPosCart = (product) => {
    setExpressCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1, options: { size: 'Doble' } }];
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
  };

  const clearPosCart = () => {
    setExpressCart([]);
    setCashAmount('');
  };

  // Calculations
  const subtotal = expressCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

    const newOrder = {
      id: Date.now(),
      code: orderCode,
      customerName: customerName.trim() || 'Cliente Mostrador',
      customerPhone: customerPhone.trim() ? `+54 9 ${customerPhone.trim()}` : '+54 9 --',
      fulfillmentType,
      address: fulfillmentType === 'delivery' ? (deliveryAddress || 'Delivery Express') : (fulfillmentType === 'dinein' ? `Mesa ${tableNumber || '1'}` : 'Retiro en Mostrador Express'),
      paymentMethod,
      itemsSummary: expressCart.map(i => `${i.quantity}x ${i.name}`).join(', '),
      itemsJson: JSON.stringify(expressCart),
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
  };

  // Express History Filter (orders today)
  const expressOrdersToday = orders.filter(o => o.code && o.code.startsWith('#EXP'));

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* Thermal Ticket Modal */}
      {printingOrder && ticketType && (
        <TicketPrintModal
          order={printingOrder}
          ticketType={ticketType}
          onClose={() => { setPrintingOrder(null); setTicketType(null); }}
        />
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
              <p className="text-xs text-neutral-400 font-bold">Terminal de Cobro Rápido en Caja y Atención al Público</p>
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
                {['Favoritos', 'Todas', ...categories.map(c => c.name)].map((catName) => {
                  const isActive = selectedCategory === catName;
                  return (
                    <button
                      key={catName}
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
                          ${Number(product.price).toFixed(2)}
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                  expressCart.map((item, idx) => (
                    <div key={idx} className="bg-[#242426] border border-white/10 p-2.5 rounded-2xl flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-[#ffb700] font-mono font-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-[#18181b] p-1 rounded-xl border border-white/10">
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
                  ))
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
                      <span className="font-mono text-xl font-black text-emerald-400">${Number(order.total).toFixed(2)}</span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setPrintingOrder(order); setTicketType('cliente'); }}
                          className="px-3 py-1.5 rounded-xl bg-[#ffb700] text-black font-black text-xs hover:bg-yellow-300 transition-colors flex items-center gap-1"
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
