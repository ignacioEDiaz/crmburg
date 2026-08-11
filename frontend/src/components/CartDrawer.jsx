import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Send, Ticket, Check, AlertCircle, Truck, Utensils, User, Phone, MapPin } from 'lucide-react';
import * as api from '../services/api';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, placeOrder, appliedCoupon, setAppliedCoupon, showToast } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

  // Delivery & Customer Fulfillment State
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'takeaway' | 'dinein'
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mainStreet, setMainStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [crossStreet1, setCrossStreet1] = useState('');
  const [crossStreet2, setCrossStreet2] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Validate coupon directly against Express backend
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    const result = await api.validateCoupon(couponCodeInput.trim(), cart, rawSubtotal);
    setCouponLoading(false);

    if (result.valid) {
      setAppliedCoupon(result);
      setCouponError(null);
      showToast(result.message || `🎉 Cupón ${result.code} aplicado`);
    } else {
      setCouponError(result.message || 'Cupón inválido');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    // Reset error
    setFormError('');

    // Form Validation Rules
    if (!fullName.trim()) {
      setFormError('Por favor ingresa tu Nombre y Apellido');
      return;
    }

    if (!phoneNumber.trim()) {
      setFormError('Por favor ingresa tu número de teléfono');
      return;
    }

    if (fulfillmentType === 'delivery') {
      if (!mainStreet.trim() || !streetNumber.trim()) {
        setFormError('Por favor completa la calle principal y altura de entrega');
        return;
      }
      if (!crossStreet1.trim() || !crossStreet2.trim()) {
        setFormError('Por favor ingresa las 2 entrecalles de tu domicilio');
        return;
      }
    }

    if (fulfillmentType === 'dinein' && !tableNumber.trim()) {
      setFormError('Por favor especifica el número de mesa o ubicación');
      return;
    }

    // Format Items List
    let itemsText = cart.map(item => {
      let opts = '';
      if (item.options) {
        if (item.options.size) opts += ` (${item.options.size})`;
        if (item.options.addCheese) opts += ` [+Queso Extra]`;
        if (item.options.extraPatty) opts += ` [+Medallón Extra]`;
      }
      return `• ${item.quantity}x ${item.name}${opts} - $${((item.price) * item.quantity).toFixed(2)}`;
    }).join('\n');

    let couponText = appliedCoupon ? `\n🎟️ Cupón Aplicado: ${appliedCoupon.code} (-$${appliedCoupon.discountAmount.toFixed(2)})` : '';

    // Fulfillment Details formatting
    let fulfillmentTitle = '';
    let addressDetails = '';

    if (fulfillmentType === 'delivery') {
      fulfillmentTitle = '🛵 *TIPO DE ENTREGA:* Delivery a domicilio';
      addressDetails = `📍 *DIRECCIÓN DE ENTREGA:*\n• Calle Principal: ${mainStreet.trim()}\n• Altura / Nro: ${streetNumber.trim()}\n• Entre Calles: ${crossStreet1.trim()} y ${crossStreet2.trim()}`;
    } else if (fulfillmentType === 'takeaway') {
      fulfillmentTitle = '🛍️ *TIPO DE ENTREGA:* Retiro en local';
    } else if (fulfillmentType === 'dinein') {
      fulfillmentTitle = `🍽️ *TIPO DE ENTREGA:* Estoy en el local (Mesa / Ubicación: ${tableNumber.trim()})`;
    }

    const formattedPhone = `+54 9 ${phoneNumber.trim()}`;

    const message = `¡Hola CRASH BURGERS! 🍔 Quiero realizar el siguiente pedido:

${fulfillmentTitle}
👤 *Cliente:* ${fullName.trim()}
📞 *Teléfono:* ${formattedPhone}
${addressDetails ? '\n' + addressDetails + '\n' : ''}
📋 *DETALLE DEL PEDIDO:*
${itemsText}
${couponText}

💰 *TOTAL FINAL: $${finalTotal.toFixed(2)}*

¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491122334455?text=${encodedMessage}`;
    
    // Register order in system
    placeOrder({
      customerName: fullName.trim(),
      customerPhone: formattedPhone,
      fulfillmentType,
      address: fulfillmentType === 'delivery' ? `${mainStreet} ${streetNumber} (e/ ${crossStreet1} y ${crossStreet2})` : (fulfillmentType === 'dinein' ? tableNumber : 'Retiro en local')
    });
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-[#18181b] text-white min-h-screen h-full flex flex-col justify-between shadow-2xl border-l border-white/10 p-5 sm:p-6 overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#ffb700]" />
              <h2 className="text-xl font-black text-white">Tu Carrito CRASH</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#242426] border border-white/10 flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="my-5 space-y-3 max-h-[30vh] overflow-y-auto pr-1 hide-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-secondary flex flex-col items-center gap-3">
                <ShoppingBag className="w-12 h-12 opacity-30" />
                <p className="text-sm font-bold">Tu carrito está vacío</p>
                <p className="text-xs">Agrega hamburguesas y combos CRASH para continuar.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-[#242426] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-black/20 rounded-xl p-1 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</h4>
                      {item.options && (
                        <p className="text-[10px] sm:text-[11px] text-[#ffb700] font-semibold mt-0.5">
                          {item.options.size ? `${item.options.size} ` : ''}
                          {item.options.addCheese ? '• +Queso ' : ''}
                          {item.options.extraPatty ? '• +Medallón ' : ''}
                        </p>
                      )}
                      <p className="text-xs text-secondary font-bold mt-1">
                        {item.quantity}x <span className="text-[#ffb700] font-black">${Number(item.price).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer & Order Form Section */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-4">
            
            {/* 1. Fulfillment Type Selector (Delivery / Retiro en Local / Estoy en el Local) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#ffb700] tracking-wider block">
                1. Tipo de Pedido
              </label>

              <div className="grid grid-cols-3 gap-2 bg-[#242426] p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    fulfillmentType === 'delivery'
                      ? 'bg-[#ffb700] text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('takeaway')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    fulfillmentType === 'takeaway'
                      ? 'bg-[#ffb700] text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Retiro Local</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('dinein')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 ${
                    fulfillmentType === 'dinein'
                      ? 'bg-[#ffb700] text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>En el Local</span>
                </button>
              </div>
            </div>

            {/* 2. Required Customer Contact Fields (Nombre y Apellido + Teléfono con +54 9) */}
            <div className="bg-[#242426] border border-white/10 rounded-2xl p-3.5 space-y-3">
              <label className="text-xs font-black uppercase text-[#ffb700] tracking-wider block">
                2. Datos del Cliente (Obligatorio)
              </label>

              {/* Nombre y Apellido */}
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400 font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#ffb700]" />
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                />
              </div>

              {/* Número de Teléfono con prefijo +54 9 */}
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#ffb700]" />
                  Número de Teléfono (+54 9)
                </label>
                <div className="flex items-center bg-[#18181b] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#ffb700]">
                  <span className="bg-[#2e2e34] text-[#ffb700] font-black text-xs px-2.5 py-2 border-r border-white/10 shrink-0 select-none">
                    +54 9
                  </span>
                  <input
                    type="tel"
                    placeholder="11 2345 6789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-xs font-mono font-medium text-white placeholder-neutral-500 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Address Fields (Calle principal, Altura, 2 entrecalles) */}
              {fulfillmentType === 'delivery' && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-[11px] text-[#ffb700] font-black flex items-center gap-1 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    Dirección de Entrega
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-neutral-400 font-bold">Calle Principal</label>
                      <input
                        type="text"
                        placeholder="Ej. Av. Corrientes"
                        value={mainStreet}
                        onChange={(e) => setMainStreet(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-bold">Altura</label>
                      <input
                        type="text"
                        placeholder="Ej. 1234"
                        value={streetNumber}
                        onChange={(e) => setStreetNumber(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-bold">Entre Calle 1</label>
                      <input
                        type="text"
                        placeholder="Ej. Maipú"
                        value={crossStreet1}
                        onChange={(e) => setCrossStreet1(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-bold">Entre Calle 2</label>
                      <input
                        type="text"
                        placeholder="Ej. Florida"
                        value={crossStreet2}
                        onChange={(e) => setCrossStreet2(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dine-in Table Field */}
              {fulfillmentType === 'dinein' && (
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <label className="text-[10px] text-neutral-400 font-bold">Número de Mesa o Ubicación</label>
                  <input
                    type="text"
                    placeholder="Ej. Mesa 4 / Barra 2"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
                  />
                </div>
              )}
            </div>

            {/* Validation Error Banner */}
            {formError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Backend Validated Coupon Input */}
            <div className="bg-[#242426] border border-white/10 rounded-2xl p-3 space-y-2">
              <label className="text-xs text-secondary font-bold flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-[#ffb700]" />
                ¿Tienes un cupón de descuento?
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código (ej. BURGER20)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#18181b] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase text-white placeholder-secondary outline-none focus:border-[#ffb700]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-[#ffb700] text-black font-black text-xs hover:bg-yellow-300 transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Aplicar'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {appliedCoupon.code} (-${appliedCoupon.discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-400 hover:text-white font-bold underline ml-2"
                  >
                    Quitar
                  </button>
                </div>
              )}

              {/* Backend Validation Error Message */}
              {couponError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Total Breakdown */}
            <div className="space-y-1 bg-[#242426]/50 p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center text-xs text-secondary font-bold">
                <span>Subtotal:</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                  <span>Descuento Cupón ({appliedCoupon.code}):</span>
                  <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg font-black text-white pt-1 border-t border-white/10">
                <span>Total Final:</span>
                <span className="text-[#ffb700] font-price-display text-2xl font-black">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider active:scale-95"
              >
                <Send className="w-4 h-4" />
                Pedir y Pagar por WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 rounded-full text-xs text-secondary hover:text-white font-bold transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
