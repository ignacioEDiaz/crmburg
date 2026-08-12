import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, UserCheck, Key, Eye, Plus, X, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function CrmUsersRolesView() {
  const context = useApp() || {};
  const showToast = typeof context.showToast === 'function' ? context.showToast : () => {};

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Tienda', role: 'admin', pin: '1234', email: 'admin@crashburger.com', active: true },
    { id: 2, name: 'Carlos (Encargado)', role: 'supervisor', pin: '9999', email: 'carlos@crashburger.com', active: true },
    { id: 3, name: 'Sofía R. (Moza)', role: 'mozo', pin: '4321', email: 'sofia@crashburger.com', active: true },
    { id: 4, name: 'Lucas M. (Cajero)', role: 'cajero', pin: '1111', email: 'lucas@crashburger.com', active: true },
    { id: 5, name: 'Cheff Mariano', role: 'cocina', pin: '5555', email: 'mariano@crashburger.com', active: true },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, userName: 'Carlos (Encargado)', action: 'anulacion_pedido', reason: 'Cliente canceló por tiempo de espera', details: 'Anulación de comanda #EXP-4819 por $8.500', createdAt: 'Hoy, 14:15 PM' },
    { id: 2, userName: 'Admin Tienda', action: 'ajuste_stock', reason: 'Pan brioche con fecha de vencimiento excedida', details: 'Merma de 12 unidades de Pan Brioche', createdAt: 'Hoy, 10:00 AM' },
    { id: 3, userName: 'Carlos (Encargado)', action: 'descuento_manual', reason: 'Descuento autorizado por cliente frecuente', details: 'Descuento 15% aplicado en ticket #EXP-4802', createdAt: 'Ayer, 20:30 PM' },
  ]);

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'audit'
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('mozo');
  const [pin, setPin] = useState('1234');
  const [email, setEmail] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !pin.trim()) {
      showToast('⚠️ Nombre y PIN de autorización obligatorios');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      role,
      pin: pin.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@crashburger.com`,
      active: true
    };

    setUsers(prev => [newUser, ...prev]);
    showToast(`👤 Usuario "${newUser.name}" registrado (${role.toUpperCase()})`);
    setName('');
    setPin('1234');
    setEmail('');
    setShowAddUserModal(false);
  };

  const getRoleBadge = (r) => {
    switch (r) {
      case 'admin': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'supervisor': return 'bg-amber-500/20 text-[#ffb700] border-amber-500/30';
      case 'cajero': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'mozo': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="flex flex-col w-full gap-lg font-sans">
      
      {/* MODAL: NUEVO USUARIO Y PIN */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddUser} className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Registrar Nuevo Usuario & PIN de Autorización</h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="w-8 h-8 rounded-full bg-[#242426] flex items-center justify-center text-white hover:bg-[#ffb700] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej. Lucas Méndez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Rol / Permiso en Sistema:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                >
                  <option value="admin">Administrador General</option>
                  <option value="supervisor">Supervisor / Encargado</option>
                  <option value="cajero">Cajero Mostrador</option>
                  <option value="mozo">Mozo / Salón</option>
                  <option value="cocina">Cocina / Comandas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">PIN de Seguridad (4 dígitos):</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-center font-mono text-base font-black text-[#ffb700] outline-none focus:border-[#ffb700]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Email:</label>
                  <input
                    type="email"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ffb700]"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#ffb700] text-black font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-lg">
              🛡️ CREAR USUARIO & ASIGNAR PERMISOS
            </button>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Usuarios, Roles & Log de Auditoría</h1>
          <p className="text-xs text-neutral-400 font-bold">Gestión de mozos, cajeros, administradores y auditoría de acciones sensibles con PIN de autorización</p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#ffb700] hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          + Registrar Usuario
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'users' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Usuarios Registrados ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'audit' ? 'bg-[#ffb700] text-black shadow-md' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Log de Auditoría ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {users.map(u => (
            <div key={u.id} className="bg-[#18181b] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-white text-base leading-tight">{u.name}</h3>
                  <span className="text-xs text-neutral-400 font-bold">{u.email}</span>
                </div>

                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
              </div>

              <div className="bg-[#242426] p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#ffb700]" />
                  PIN Autorización:
                </span>
                <span className="font-mono font-black text-[#ffb700] text-sm">•••• ({u.pin})</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-base">Historial de Auditoría de Acciones Sensibles</h3>
            <span className="text-xs text-[#ffb700] font-bold">Auditado por PIN de Autorización</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario Autorizador</th>
                  <th className="py-3 px-4">Acción Auditoría</th>
                  <th className="py-3 px-4">Motivo Obligatorio</th>
                  <th className="py-3 px-4">Detalles</th>
                  <th className="py-3 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map(a => (
                  <tr key={a.id} className="hover:bg-[#222226] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{a.userName}</td>
                    <td className="py-3 px-4">
                      <span className="bg-rose-500/20 text-rose-300 font-black text-[10px] uppercase px-2.5 py-1 rounded-full border border-rose-500/30">
                        {a.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#ffb700]">{a.reason}</td>
                    <td className="py-3 px-4 text-neutral-300">{a.details}</td>
                    <td className="py-3 px-4 text-neutral-400">{a.createdAt}</td>
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
