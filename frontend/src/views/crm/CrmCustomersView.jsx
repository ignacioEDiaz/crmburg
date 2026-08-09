import React from 'react';

export default function CrmCustomersView() {
  const customers = [
    { id: 1, name: 'Santiago Rodríguez', email: 'santiago.r@gmail.com', orders: 18, spent: '$345.50', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyTa3j7ZzlUZzl_MbxmO-1u_wjZdcJYja9GJwTMlP1urD_tc76DDit7YUGVDrsbVOGju5Ocw9eOGdobDjP6JcKDqPI93iT14xDskCS1oUag3Y_0Z--rFtzr-uI6n2Btwt7QU-MGxrgwDgrs6syjC7pFBQ2wMSn_4lwc40JIdyuc6phSBJeAkawDE03kqXB35753UQogI4NX3NKfviLAJkP5Vxv1WjD0_eKdXsWNo10su9wZe7o9U5AqA' },
    { id: 2, name: 'Mateo Fernández', email: 'mateo.f@yahoo.com', orders: 12, spent: '$210.00', avatar: null },
    { id: 3, name: 'Elena Rostova', email: 'elena.rostova@tech.io', orders: 25, spent: '$540.90', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIlVEs06AJ6nxwNXnCxObIX9EL-sOEvVUR-qhUAo1QQN9IS_wKeIqpR4qDeCt8GJ8TxjXDlqFdSym_eNKa669OieK7sWNbabpqfsWMZkiq9YGykqFnkhzWXum4y8AvySlKF-w7VtbUUfJraGjuEvG7i44aihd27-cK6vhI6PfkVkcPoqpephuwU8floGwLR1e0OqUxkU6z8HgoyKU55xEHQWOxRuvk0VEaZhF0CKYKjB5phkAHKF1PnQ' },
  ];

  return (
    <div className="flex flex-col w-full gap-xl">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Directorio de Clientes</h1>
        <p className="text-body-lg text-on-surface-variant mt-xs">Gestiona usuarios registrados y estadísticas de compradores habituales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {customers.map((c) => (
          <div key={c.id} className="bg-surface-container-low/60 rounded-2xl p-lg border border-white/5 shadow-md flex items-center gap-md">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
              {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-primary text-2xl">person</span>}
            </div>
            <div>
              <h3 className="font-title-md text-on-surface">{c.name}</h3>
              <p className="text-xs text-on-surface-variant mb-2">{c.email}</p>
              <div className="flex items-center gap-md text-xs">
                <span className="text-primary font-bold">{c.orders} Pedidos</span>
                <span className="text-white font-bold">{c.spent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
