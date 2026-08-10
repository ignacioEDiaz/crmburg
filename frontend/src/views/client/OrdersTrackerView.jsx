import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ReceiptText } from 'lucide-react';

export default function OrdersTrackerView() {
  const { orders, setClientTab } = useApp();

  return (
    <div className="relative w-full max-w-7xl mx-auto min-h-screen bg-[#121212] font-body-lg text-white pb-12 pt-20 px-4 md:px-8 shadow-2xl">
      <div className="flex flex-col gap-lg">
        
        {/* Back to Home Header Button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-md">
          <button
            onClick={() => setClientTab('home')}
            className="flex items-center gap-2 text-xs font-bold text-[#ffb700] bg-[#ffb700]/10 hover:bg-[#ffb700]/20 border border-[#ffb700]/30 px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </button>
          <span className="text-xs text-secondary font-bold">Estado de Pedidos</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-xl text-headline-xl text-white font-black">Tus Pedidos en Curso</h2>
            <ReceiptText className="w-6 h-6 text-[#ffb700]" />
          </div>
          <p className="text-body-sm text-secondary mt-xs">Rastrea el estado en tiempo real de tu comida enviada desde la cocina.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#242426] rounded-3xl p-xl text-center text-secondary border border-white/10">
            No has realizado pedidos aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#242426] rounded-3xl p-lg flex flex-col justify-between relative border border-white/10 shadow-lg hover:border-[#ffb700]/40 transition-all">
                <div>
                  <div className="flex justify-between items-start border-b border-white/10 pb-sm mb-md">
                    <div>
                      <span className="font-mono text-[#ffb700] font-black text-lg">{order.code}</span>
                      <p className="text-xs text-secondary">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      order.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      order.status === 'En Proceso' || order.status === 'Aceptado' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      order.status === 'Enviado' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      ● {order.status}
                    </span>
                  </div>

                  <p className="text-body-lg font-bold text-white mb-md">{order.itemsSummary}</p>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-md mt-sm">
                  <span className="text-xs text-secondary font-bold">Monto Total</span>
                  <span className="font-price-display text-[#ffb700] font-black text-2xl">$ {Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
