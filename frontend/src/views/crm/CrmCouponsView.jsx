import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Plus, Check, Clock, Trash2, Calendar, ShieldCheck, Tag, Zap } from 'lucide-react';

export default function CrmCouponsView() {
  const { coupons, products, handleCreateCoupon, handleUpdateCoupon, handleDeleteCoupon } = useApp();

  const [showModal, setShowModal] = useState(false);
  
  // Coupon Form States
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState(20);
  const [scope, setScope] = useState('all'); // 'all' | 'product'
  const [productName, setProductName] = useState(products[0]?.name || 'Hamburguesa de Pollo Picante');
  const [durationDays, setDurationDays] = useState('forever'); // '1', '2', '7', '30', 'forever'
  const [maxUses, setMaxUses] = useState('');

  const handleOpenCreate = () => {
    setCode(`BURGER${Math.floor(10 + Math.random() * 90)}`);
    setDiscountType('percentage');
    setDiscountValue(20);
    setScope('all');
    setProductName(products[0]?.name || 'Hamburguesa de Pollo Picante');
    setDurationDays('forever');
    setMaxUses('');
    setShowModal(true);
  };

  const onSubmitCoupon = (e) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    handleCreateCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      scope,
      productName: scope === 'product' ? productName : null,
      durationDays,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
    });

    setShowModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-xl">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-xl font-headline-xl text-on-surface">Gestión de Cupones de Descuento</h1>
            <span className="bg-primary/20 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              Promociones
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-xs">
            Crea cupones personalizados por porcentaje o monto fijo, asigna caducidad (1 día, 2 días... o hasta siempre), límite de usos y restricción por producto.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary-container text-on-primary font-bold px-lg py-sm rounded-full shadow-md transition-all flex items-center gap-xs"
        >
          <Plus className="w-4 h-4" />
          Generar Nuevo Cupón
        </button>
      </div>

      {/* Coupons List / Grid */}
      {coupons.length === 0 ? (
        <div className="bg-surface-container-low/60 border border-white/10 rounded-3xl p-12 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
          <Ticket className="w-12 h-12 text-on-surface-variant/40" />
          <h3 className="text-xl font-bold text-on-surface">No hay cupones generados aún</h3>
          <p className="text-sm">Genera tu primer cupón de descuento para que tus clientes lo utilicen en el carrito.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {coupons.map((coup) => {
            const isExpired = coup.expiresAt && new Date() > new Date(coup.expiresAt);
            const isMaxedOut = coup.maxUses !== null && coup.usageCount >= coup.maxUses;

            return (
              <div
                key={coup.id}
                className={`bg-surface-container-low/80 border rounded-3xl p-lg flex flex-col justify-between shadow-xl relative transition-all ${
                  !coup.isActive || isExpired || isMaxedOut
                    ? 'border-rose-500/30 opacity-75'
                    : 'border-emerald-500/30'
                }`}
              >
                {/* Status Badges */}
                <div className="flex justify-between items-start mb-md">
                  <span className="font-mono text-primary text-2xl font-black bg-primary/10 border border-primary/30 px-3 py-1 rounded-2xl tracking-wider">
                    {coup.code}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isExpired ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    isMaxedOut ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    coup.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    ● {isExpired ? 'Expirado' : isMaxedOut ? 'Agotado' : coup.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 my-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-body-lg font-black text-on-surface">
                      Descuento: {coup.discountType === 'percentage' ? `${coup.discountValue}%` : `$ ${coup.discountValue}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
                    <Tag className="w-3.5 h-3.5 text-secondary" />
                    <span>Alcance: {coup.scope === 'product' ? `Solo para "${coup.productName}"` : 'Todo el menú / Carrito'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span>
                      Vencimiento: {coup.expiresAt ? new Date(coup.expiresAt).toLocaleDateString('es-ES') : 'Hasta siempre (Sin vence)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                    <span>
                      Usos: <strong className="text-white">{coup.usageCount}</strong> / {coup.maxUses !== null ? `${coup.maxUses} máx.` : 'Ilimitado'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-4">
                  <button
                    onClick={() => handleUpdateCoupon(coup.id, { isActive: !coup.isActive })}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs border transition-colors ${
                      coup.isActive 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-white' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    {coup.isActive ? 'Pausar' : 'Activar'}
                  </button>

                  <button
                    onClick={() => handleDeleteCoupon(coup.id)}
                    className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Generar Nuevo Cupón */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl p-lg w-full max-w-lg flex flex-col gap-md shadow-2xl my-8">
            <h3 className="text-headline-lg font-bold text-on-surface">Generar Cupón Personalizado</h3>
            
            <form onSubmit={onSubmitCoupon} className="flex flex-col gap-md">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">Código del Cupón</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej. BURGER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface font-mono font-bold tracking-wider uppercase border border-white/10 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setCode(`BURGER${Math.floor(10 + Math.random() * 90)}`)}
                    className="px-3 py-1 rounded-xl bg-surface-container-high text-xs text-secondary hover:text-white font-bold shrink-0 border border-white/10"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Tipo de Descuento</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Valor del Descuento</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder={discountType === 'percentage' ? '20' : '5.00'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary font-bold text-primary"
                  />
                </div>
              </div>

              {/* Alcance del Cupón */}
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-bold">¿A qué productos aplica?</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                >
                  <option value="all">Cualquier producto / Todo el carrito</option>
                  <option value="product">Producto específico seleccionado</option>
                </select>
              </div>

              {scope === 'product' && (
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Seleccionar Producto Específico</label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  >
                    {products.map(p => (
                      <option key={p.id || p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Duración y Vencimiento */}
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Duración / Vencimiento</label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary"
                  >
                    <option value="1">1 día</option>
                    <option value="2">2 días</option>
                    <option value="7">7 días</option>
                    <option value="30">30 días</option>
                    <option value="forever">Hasta siempre (Sin vencimiento)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1 font-bold">Límite de Reutilizaciones</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 50 (o vacío = Ilimitado)"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10 focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-sm mt-md">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-md py-sm rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  Crear Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
