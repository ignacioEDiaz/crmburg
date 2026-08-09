import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Clock, Send, ShoppingBag, Truck } from 'lucide-react';

export default function CrmDailyOrdersView() {
  const { orders, handleAcceptOrder, handleRejectOrder, handleUpdateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState('Pendientes'); // 'Pendientes', 'Aceptados', 'Rechazados', 'Enviados'

  // Filter orders by active tab status
  const pendingOrders = orders.filter(o => o.status === 'Pendiente');
  const acceptedOrders = orders.filter(o => o.status === 'Aceptado' || o.status === 'En Proceso');
  const rejectedOrders = orders.filter(o => o.status === 'Rechazado');
  const sentOrders = orders.filter(o => o.status === 'Enviado');

  const displayedOrders = 
    activeTab === 'Pendientes' ? pendingOrders :
    activeTab === 'Aceptados' ? acceptedOrders :
    activeTab === 'Rechazados' ? rejectedOrders : sentOrders;

  return (
    <div className="flex flex-col w-full gap-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Pedidos del Día</h1>
            <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              En vivo
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-xs">
            Gestiona los pedidos entrantes del día. Al **Aceptar** un pedido, sus ingredientes se descontarán automáticamente del inventario.
          </p>
        </div>
      </div>

      {/* 4 Tabs: Pendientes, Aceptados, Rechazados, Enviados */}
      <div className="flex gap-md border-b border-white/10 pb-1 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('Pendientes')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-bold text-body-lg transition-all border shrink-0 ${
            activeTab === 'Pendientes'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md'
              : 'bg-surface-container-low text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          <Clock className="w-5 h-5 text-amber-400" />
          Pendientes
          <span className="ml-2 bg-amber-500/30 text-amber-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
            {pendingOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Aceptados')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-bold text-body-lg transition-all border shrink-0 ${
            activeTab === 'Aceptados'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
              : 'bg-surface-container-low text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          <Check className="w-5 h-5 text-emerald-400" />
          Aceptados
          <span className="ml-2 bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
            {acceptedOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Rechazados')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-bold text-body-lg transition-all border shrink-0 ${
            activeTab === 'Rechazados'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
              : 'bg-surface-container-low text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          <X className="w-5 h-5 text-rose-400" />
          Rechazados
          <span className="ml-2 bg-rose-500/30 text-rose-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
            {rejectedOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Enviados')}
          className={`flex items-center gap-2 px-lg py-md rounded-xl font-bold text-body-lg transition-all border shrink-0 ${
            activeTab === 'Enviados'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-md'
              : 'bg-surface-container-low text-on-surface-variant border-transparent hover:text-on-surface'
          }`}
        >
          <Truck className="w-5 h-5 text-blue-400" />
          Enviados
          <span className="ml-2 bg-blue-500/30 text-blue-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
            {sentOrders.length}
          </span>
        </button>
      </div>

      {/* Daily Orders Cards Feed */}
      {displayedOrders.length === 0 ? (
        <div className="bg-surface-container-low/60 border border-white/10 rounded-3xl p-12 text-center text-on-surface-variant flex flex-col items-center justify-center gap-3">
          <ShoppingBag className="w-12 h-12 text-on-surface-variant/40" />
          <h3 className="text-xl font-bold text-on-surface">No hay pedidos en la pestaña "{activeTab}"</h3>
          <p className="text-sm">Los nuevos pedidos realizados desde la app de clientes aparecerán aquí automáticamente en tiempo real.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-surface-container-low/80 border rounded-3xl p-lg flex flex-col justify-between shadow-xl transition-all ${
                order.status === 'Pendiente' ? 'border-amber-500/40 bg-amber-500/5' :
                order.status === 'Aceptado' || order.status === 'En Proceso' ? 'border-emerald-500/30' :
                order.status === 'Enviado' ? 'border-blue-500/30' : 'border-rose-500/30 opacity-75'
              }`}
            >
              <div>
                {/* Header of Order Card */}
                <div className="flex justify-between items-start pb-md border-b border-white/10">
                  <div>
                    <span className="font-mono text-primary text-xl font-extrabold">{order.code}</span>
                    <p className="text-xs text-on-surface-variant font-bold mt-0.5">Cliente: {order.customerName}</p>
                    <p className="text-[11px] text-on-surface-variant/70">{order.date}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    order.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                    order.status === 'Aceptado' || order.status === 'En Proceso' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    order.status === 'Enviado' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    ● {order.status}
                  </span>
                </div>

                {/* Items Detail */}
                <div className="my-md space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-on-surface-variant">Detalle del Pedido:</h4>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="bg-surface-container-high/60 rounded-xl p-md border border-white/5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-on-surface text-body-lg">
                            {item.qty || item.quantity || 1}x {item.name}
                          </p>
                          {item.options && (
                            <p className="text-xs text-primary font-semibold mt-0.5">
                              + {item.options.size ? `${item.options.size}` : ''} 
                              {item.options.addCheese ? ' • Queso Extra (+1 feta)' : ''}
                              {item.options.extraPatty ? ' • Medallón Extra (+1 carne)' : ''}
                              {item.options.addBacon ? ' • Bacon Extra' : ''}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-on-surface text-body-lg">$ {((item.price || 5.99) * (item.qty || 1)).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="font-bold text-on-surface">{order.itemsSummary}</p>
                  )}
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-md border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-md">
                <div>
                  <span className="text-xs text-on-surface-variant block">Monto Total</span>
                  <span className="text-headline-lg font-bold text-primary">$ {Number(order.total).toFixed(2)}</span>
                </div>

                {/* Actions when Pending */}
                {order.status === 'Pendiente' && (
                  <div className="flex items-center gap-sm w-full sm:w-auto">
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="flex-1 sm:flex-none px-lg py-md rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 border border-rose-500/30"
                    >
                      <X className="w-4 h-4" />
                      Rechazar
                    </button>

                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 sm:flex-none px-xl py-md rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Aceptar y Descontar Stock
                    </button>
                  </div>
                )}

                {/* Big ENVIAR 🛵 button when order is Accepted */}
                {(order.status === 'Aceptado' || order.status === 'En Proceso') && (
                  <div className="flex items-center gap-md w-full sm:w-auto">
                    <span className="text-xs text-emerald-400 font-bold hidden md:inline">✓ Stock descontado</span>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Enviado')}
                      className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 tracking-wide"
                    >
                      <span className="text-lg">🛵</span>
                      ENVIAR
                    </button>
                  </div>
                )}

                {order.status === 'Enviado' && (
                  <div className="text-xs text-blue-400 font-bold bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 flex items-center gap-2">
                    <span className="text-base">🛵</span>
                    Pedido en camino al cliente
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
