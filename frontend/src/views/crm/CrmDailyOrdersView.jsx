import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, XCircle, Send, Bike, RefreshCw, Layers } from 'lucide-react';

export default function CrmDailyOrdersView() {
  const { orders, handleAcceptOrder, handleRejectOrder, handleUpdateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState('Pendiente'); // 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Enviado'

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const pendingCount = orders.filter(o => o.status === 'Pendiente').length;
  const acceptedCount = orders.filter(o => o.status === 'Aceptado').length;
  const rejectedCount = orders.filter(o => o.status === 'Rechazado').length;
  const sentCount = orders.filter(o => o.status === 'Enviado').length;

  return (
    <div className="flex flex-col w-full gap-xl">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-xl font-headline-xl text-on-surface font-black">Pedidos del Día</h1>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              ● En vivo
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-xs">
            Gestiona los pedidos entrantes del día. Al **Aceptar** un pedido, sus ingredientes se descontarán automáticamente del inventario.
          </p>
        </div>
      </div>

      {/* 4 Status Tabs: Pendientes, Aceptados, Rechazados, Enviados */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <button
          onClick={() => setActiveTab('Pendiente')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Pendiente'
              ? 'bg-[#ffb700] text-black border-[#ffb700] shadow-md'
              : 'bg-[#242426] border-white/10 text-secondary hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pendientes
          <span className="w-5 h-5 rounded-full bg-black/20 text-xs font-black flex items-center justify-center">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Aceptado')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Aceptado'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
              : 'bg-[#242426] border-white/10 text-secondary hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aceptados
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {acceptedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Rechazado')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Rechazado'
              ? 'bg-rose-500 text-white border-rose-500 shadow-md'
              : 'bg-[#242426] border-white/10 text-secondary hover:text-white'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Rechazados
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Enviado')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black transition-all shrink-0 ${
            activeTab === 'Enviado'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-[#242426] border-white/10 text-secondary hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          Enviados
          <span className="w-5 h-5 rounded-full bg-white/20 text-xs font-black flex items-center justify-center">
            {sentCount}
          </span>
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#242426] border border-white/10 rounded-3xl p-12 text-center text-secondary flex flex-col items-center justify-center gap-3">
          <Layers className="w-12 h-12 opacity-30" />
          <h3 className="text-xl font-bold text-white">No hay pedidos en la pestaña "{activeTab}"</h3>
          <p className="text-sm">Los pedidos aparecerán en tiempo real cuando tus clientes compren desde la app.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredOrders.map((order) => {
            let parsedItems = [];
            try {
              parsedItems = JSON.parse(order.itemsJson || '[]');
            } catch (e) {
              parsedItems = [];
            }

            return (
              <div
                key={order.id}
                className="bg-[#242426] border border-white/10 rounded-3xl p-lg flex flex-col justify-between shadow-xl relative hover:border-[#ffb700]/40 transition-all"
              >
                {/* Order Header */}
                <div>
                  <div className="flex justify-between items-start border-b border-white/10 pb-md mb-md">
                    <div>
                      <span className="font-mono text-[#ffb700] font-black text-xl">{order.code}</span>
                      <p className="text-xs text-secondary font-bold">Cliente: {order.customerName}</p>
                      <p className="text-[11px] text-secondary">{order.date}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      order.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      order.status === 'Aceptado' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      order.status === 'Enviado' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      ● {order.status}
                    </span>
                  </div>

                  {/* Order Items Breakdown */}
                  <div className="space-y-2 mb-md">
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider">Detalle del Pedido:</p>
                    {parsedItems.length > 0 ? (
                      parsedItems.map((item, idx) => (
                        <div key={idx} className="bg-[#18181b] p-3 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center text-sm font-bold text-white">
                            <span>{item.qty || 1}x {item.name}</span>
                            <span>${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                          </div>
                          {item.options && (
                            <p className="text-[11px] text-[#ffb700] font-semibold mt-1">
                              {item.options.size ? `• ${item.options.size} ` : ''}
                              {item.options.addCheese ? '• Queso Extra ' : ''}
                              {item.options.extraPatty ? '• Medallón Extra ' : ''}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-bold text-white">{order.itemsSummary}</p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-white/10 pt-md mt-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary font-bold">Monto Total</span>
                    <span className="font-price-display text-[#ffb700] font-black text-2xl">$ {Number(order.total).toFixed(2)}</span>
                  </div>

                  {/* Action Buttons based on Status */}
                  {order.status === 'Pendiente' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="py-2.5 px-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>

                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-lg transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aceptar y Descontar Stock
                      </button>
                    </div>
                  )}

                  {order.status === 'Aceptado' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'Enviado')}
                      className="w-full py-3 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform uppercase tracking-wider"
                    >
                      <Bike className="w-5 h-5" />
                      ENVIAR 🛵
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
