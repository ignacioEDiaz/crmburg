import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Phone, MapPin, Search, Plus, Upload, CreditCard, Award, ShoppingBag, X, Check } from 'lucide-react';

export default function CrmCustomersView() {
  const context = useApp() || {};
  const orders = Array.isArray(context.orders) ? context.orders : [];
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Martín Rodríguez', phone: '+54 9 11 4455-6677', email: 'martin@email.com', address: 'Av. Corrientes 1240, 4B', currentCredit: 0.0, points: 340 },
    { id: 2, name: 'Sofía Rossi', phone: '+54 9 11 5566-7788', email: 'sofia@email.com', address: 'Calle Florida 890', currentCredit: 2500.0, points: 120 },
    { id: 3, name: 'Lucas Méndez', phone: '+54 9 11 2233-4455', email: 'lucas@email.com', address: 'Av. Santa Fe 3420', currentCredit: 0.0, points: 580 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // CSV Import State
  const [csvText, setCsvText] = useState('');

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('⚠️ Ingresa nombre y teléfono obligatorios');
      return;
    }

    const newCust = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'Sin email',
      address: address.trim() || 'Sin dirección',
      currentCredit: 0.0,
      points: 0
    };

    setCustomers(prev => [newCust, ...prev]);
    showToast(`👤 Cliente "${newCust.name}" registrado con éxito`);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setShowAddCustomerModal(false);
  };

  const handleImportCsv = (e) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const lines = csvText.split('\n').filter(l => l.trim());
    let importedCount = 0;

    const newCusts = [];
    lines.forEach((line, index) => {
      if (index === 0 && line.toLowerCase().includes('nombre')) return; // Skip header
      const parts = line.split(',');
      if (parts.length >= 2) {
        newCusts.push({
          id: Date.now() + index,
          name: parts[0].trim(),
          phone: parts[1].trim(),
          email: parts[2] ? parts[2].trim() : 'Sin email',
          address: parts[3] ? parts[3].trim() : 'Sin dirección',
          currentCredit: 0.0,
          points: 50
        });
        importedCount++;
      }
    });

    setCustomers(prev => [...newCusts, ...prev]);
    showToast(`📥 ${importedCount} clientes importados desde CSV`);
    setCsvText('');
    setShowImportCsvModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* MODAL 1: NUEVO CLIENTE */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomer} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Registrar Nuevo Cliente</h3>
              <button type="button" onClick={() => setShowAddCustomerModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej. Martín Rodríguez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Teléfono (WhatsApp Delivery):</label>
                <input
                  type="text"
                  placeholder="+54 9 11 4455-6677"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Dirección de Entrega:</label>
                <input
                  type="text"
                  placeholder="Ej. Av. Corrientes 1240, 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Email (Opcional):</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              👤 GUARDAR FICHA DE CLIENTE
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: IMPORTAR CSV */}
      {showImportCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleImportCsv} className="w-full max-w-lg bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Importación Masiva de Clientes (CSV)</h3>
              <button type="button" onClick={() => setShowImportCsvModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-bold">Pega tus líneas en formato: <code className="text-[#ffb700]">Nombre, Telefono, Email, Direccion</code></p>

            <textarea
              rows="6"
              placeholder={`Nombre, Telefono, Email, Direccion\nCarlos Gomez, 1144990011, carlos@mail.com, Av Santa Fe 1200\nAna Perez, 1155883322, ana@mail.com, Calle Florida 400`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-2xl p-3 text-xs font-mono text-emerald-400 outline-none focus:border-[#ffb700]"
            />

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              📥 IMPORTAR CLIENTES AL SISTEMA
            </button>
          </form>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Fichas de Clientes & CRM Delivery</h1>
          <p className="text-xs text-neutral-400 font-bold">Historial de pedidos por cliente, cuenta corriente (fiado) y puntos de fidelidad</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportCsvModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#242428] hover:bg-[#ffb700] hover:text-black text-white border border-white/10 text-xs font-extrabold flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-4 h-4" />
            Importar CSV
          </button>

          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            + Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative bg-[#18181b] p-3 rounded-2xl border border-white/10">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar cliente por nombre, teléfono o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#242426] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ffb700]"
        />
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {filteredCustomers.map(c => {
          const customerOrdersCount = orders.filter(o => o.customerName === c.name).length;

          return (
            <div key={c.id} className="bg-[#18181b] border border-white/10 hover:border-[#ffb700]/50 rounded-3xl p-5 shadow-xl transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ffb700]/20 text-[#ffb700] font-black flex items-center justify-center text-base border border-[#ffb700]/30">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base leading-tight">{c.name}</h3>
                    <span className="text-xs text-neutral-400 font-bold">📞 {c.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-[#ffb700] text-xs font-mono font-black">
                  <Award className="w-3.5 h-3.5" />
                  {c.points} pts
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-300 bg-[#242426] p-3 rounded-2xl border border-white/5">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ffb700]" />
                  <span>{c.address}</span>
                </p>
                <p className="flex items-center gap-1.5 text-neutral-400">
                  <span>✉️ {c.email}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold">Cuenta Corriente / Fiado:</span>
                <span className={`font-mono font-black ${c.currentCredit > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${c.currentCredit.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
