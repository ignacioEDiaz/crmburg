import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, Send, Ticket, Check, AlertCircle } from 'lucide-react';
import * as api from '../services/api';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, placeOrder, appliedCoupon, setAppliedCoupon, showToast } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);

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

    let itemsText = cart.map(item => {
      let opts = '';
      if (item.options) {
        if (item.options.size) opts += ` (${item.options.size})`;
        if (item.options.addCheese) opts += ` [+Queso Extra]`;
        if (item.options.extraPatty) opts += ` [+Medallón Extra]`;
      }
      return `• ${item.quantity}x ${item.name}${opts} - $${((item.price) * item.quantity).toFixed(2)}`;
    }).join('\n');

    let couponText = appliedCoupon ? `\n\n🎟️ Cupón Aplicado: ${appliedCoupon.code} (-$${appliedCoupon.discountAmount.toFixed(2)})` : '';

    const message = `¡Hola Burger CRM! 🍔 Quiero realizar el siguiente pedido:\n\n${itemsText}${couponText}\n\n💰 *Total Final: $${finalTotal.toFixed(2)}*\n\n¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491122334455?text=${encodedMessage}`;
    
    // Register order in system
    placeOrder();
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#1c1c1e] text-white min-h-screen h-full flex flex-col justify-between shadow-2xl border-l border-white/10 p-6 overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Tu Carrito de Compras</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#2c2c2e] border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="my-6 space-y-4 max-h-[40vh] overflow-y-auto pr-1 hide-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-secondary flex flex-col items-center gap-3">
                <ShoppingBag className="w-12 h-12 opacity-30" />
                <p className="text-sm font-bold">Tu carrito está vacío</p>
                <p className="text-xs">Agrega deliciosas hamburguesas y combos para continuar.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-[#242426] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-black/20 rounded-xl p-1 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                      {item.options && (
                        <p className="text-[11px] text-primary font-semibold mt-0.5">
                          {item.options.size ? `${item.options.size} ` : ''}
                          {item.options.addCheese ? '• +Queso ' : ''}
                          {item.options.extraPatty ? '• +Medallón ' : ''}
                        </p>
                      )}
                      <p className="text-xs text-secondary font-bold mt-1">
                        {item.quantity}x <span className="text-white font-extrabold">${Number(item.price).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer & Checkout Section */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-4">
            
            {/* Backend Validated Coupon Input */}
            <div className="bg-[#242426] border border-white/10 rounded-2xl p-3 space-y-2">
              <label className="text-xs text-secondary font-bold flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-primary" />
                ¿Tienes un cupón de descuento?
              </label>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código (ej. BURGER20)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#1c1c1e] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase text-white placeholder-secondary outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-colors disabled:opacity-50 shadow-md"
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
                <span className="text-primary font-price-display text-2xl">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
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
