import React from 'react';

export default function CrmSettingsView() {
  return (
    <div className="flex flex-col w-full gap-xl max-w-2xl">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Configuración del CRM</h1>
        <p className="text-body-lg text-on-surface-variant mt-xs">Perfil de la hamburguesería y ajustes operativos.</p>
      </div>

      <div className="bg-surface-container-low/60 rounded-2xl p-lg border border-white/5 shadow-md flex flex-col gap-md">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Nombre del Establecimiento</label>
          <input
            type="text"
            defaultValue="BURGER STORE - Central"
            className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10"
          />
        </div>

        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Horario de Atención</label>
          <input
            type="text"
            defaultValue="11:00 AM - 11:30 PM (Todos los días)"
            className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10"
          />
        </div>

        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Número de WhatsApp de Recepción</label>
          <input
            type="text"
            defaultValue="+54 9 11 2345-6789"
            className="w-full bg-surface-container-highest rounded-xl p-sm text-on-surface border border-white/10"
          />
        </div>

        <button className="mt-md bg-primary text-on-primary font-bold px-lg py-sm rounded-full self-start shadow-md">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
