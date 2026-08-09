import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, TrendingUp, Calendar, Filter, Flame, Package, Utensils, CheckCircle } from 'lucide-react';

export default function CrmReportsView() {
  const { products, orders, inventory } = useApp();
  const [timeframe, setTimeframe] = useState('mensual'); // 'semanal' | 'mensual'
  const [reportType, setReportType] = useState('productos'); // 'productos' | 'ingredientes'

  // Calculate Most Sold Products from orders
  const productSalesMap = {};
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const key = item.name;
        if (!productSalesMap[key]) {
          productSalesMap[key] = {
            name: item.name,
            qty: 0,
            revenue: 0,
            option: item.options?.size ? `Opción: ${item.options.size}` : (item.options?.extraPatty ? 'Opción: Doble Carne' : 'Opción: Estándar'),
            image: null
          };
        }
        productSalesMap[key].qty += (item.qty || item.quantity || 1);
        productSalesMap[key].revenue += ((item.price || 5.99) * (item.qty || item.quantity || 1));
      });
    }
  });

  // Attach images from products array
  const mostSoldProducts = Object.values(productSalesMap).map(item => {
    const matched = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
    return {
      ...item,
      image: matched?.image || 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
    };
  }).sort((a, b) => b.qty - a.qty); // Sort highest to lowest for carousel display

  // Calculate Ingredient Consumption from orders
  const ingredientConsumptionMap = {
    'Medallones de Carne': 0,
    'Panes Brioche': 0,
    'Queso Cheddar Fetear': 0,
    'Panceta Ahumada': 0,
  };

  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const qty = item.qty || item.quantity || 1;
        // Basic recipe estimation per item
        ingredientConsumptionMap['Medallones de Carne'] += (qty * (item.options?.extraPatty ? 2 : 1));
        ingredientConsumptionMap['Panes Brioche'] += qty;
        ingredientConsumptionMap['Queso Cheddar Fetear'] += (qty * (item.options?.addCheese ? 3 : 2));
        if (item.options?.addBacon) ingredientConsumptionMap['Panceta Ahumada'] += (qty * 2);
      });
    }
  });

  const ingredientReportList = Object.keys(ingredientConsumptionMap).map(ingName => {
    const matchedIng = inventory.find(i => i.name.toLowerCase() === ingName.toLowerCase());
    return {
      name: ingName,
      qtyConsumed: ingredientConsumptionMap[ingName],
      unit: matchedIng?.unit || 'unidades',
      category: matchedIng?.category || 'Insumo',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
    };
  });

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalItemsSold = mostSoldProducts.reduce((sum, p) => sum + p.qty, 0);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-xl print:p-0 print:bg-white print:text-black">
      
      {/* Non-printable top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-xl font-headline-xl text-on-surface">Reportes y Estadísticas</h1>
            <span className="bg-primary/20 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Métricas
            </span>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-xs">
            Consulta los productos más vendidos del mes e imprime reportes detallados semanales o mensuales por productos e ingredientes.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="bg-primary hover:bg-primary-container text-on-primary font-extrabold px-xl py-md rounded-full shadow-lg transition-all flex items-center gap-2 border border-primary/40"
        >
          <Printer className="w-5 h-5" />
          Imprimir Reporte {timeframe === 'semanal' ? 'Semanal' : 'Mensual'}
        </button>
      </div>

      {/* TOP SECTION: Carousel of Most Sold Products */}
      <div className="flex flex-col gap-md print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary fill-primary" />
            Productos Más Vendidos del Mes
          </h2>
          <span className="text-xs text-on-surface-variant">Desliza para ver más →</span>
        </div>

        {/* Horizontal Carousel */}
        <div className="w-[calc(100%+32px)] -ml-4 pl-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
          <div className="flex gap-md pr-8 w-max">
            {mostSoldProducts.length === 0 ? (
              <div className="bg-surface-container-low p-6 rounded-2xl text-secondary text-sm">
                No hay ventas registradas este mes aún.
              </div>
            ) : (
              mostSoldProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="snap-start w-64 bg-surface-container-low/80 border border-white/10 rounded-3xl p-md flex flex-col justify-between shadow-lg relative group hover:border-primary/40 transition-all shrink-0"
                >
                  {/* Rank Badge */}
                  <span className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                    #{idx + 1}
                  </span>

                  {/* Image */}
                  <div className="w-full h-32 relative flex items-center justify-center my-2">
                    <img src={p.image} alt={p.name} className="h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-xs pt-2 border-t border-white/10">
                    <h4 className="font-bold text-on-surface text-body-lg line-clamp-1">{p.name}</h4>
                    <span className="text-xs text-primary font-bold">{p.option}</span>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-on-surface-variant font-bold">Pedido:</span>
                      <span className="bg-primary/20 text-primary font-extrabold text-xs px-3 py-1 rounded-full border border-primary/30">
                        {p.qty} unidades
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Report Generation & Filtering */}
      <div className="bg-surface-container-low/90 border border-white/10 rounded-3xl p-lg flex flex-col gap-lg shadow-xl print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Printable Header Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-white/10 pb-md print:border-black/20">
          <div>
            <span className="text-xs text-primary uppercase tracking-widest font-extrabold block">BURGER CRM - REPORTE OFICIAL</span>
            <h2 className="text-headline-lg font-bold text-on-surface capitalize print:text-black">
              Reporte {timeframe} de {reportType === 'productos' ? 'Ventas por Producto' : 'Consumo de Ingredientes'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5 print:text-gray-600">Generado el {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Controls Filter Bar (Hidden when printing) */}
          <div className="flex flex-wrap items-center gap-sm print:hidden">
            {/* Timeframe Selector: Semanal / Mensual */}
            <div className="flex items-center bg-surface-container-high border border-white/10 p-1 rounded-full">
              <button
                onClick={() => setTimeframe('semanal')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  timeframe === 'semanal' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setTimeframe('mensual')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  timeframe === 'mensual' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Mensual
              </button>
            </div>

            {/* Filter Type: Productos / Combos vs Ingredientes */}
            <div className="flex items-center bg-surface-container-high border border-white/10 p-1 rounded-full">
              <button
                onClick={() => setReportType('productos')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reportType === 'productos' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Productos / Combos
              </button>
              <button
                onClick={() => setReportType('ingredientes')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  reportType === 'ingredientes' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Ingredientes Consumidos
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Overview Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="bg-surface-container/60 border border-white/10 p-md rounded-2xl flex flex-col gap-xs print:border-black/20 print:bg-gray-50">
            <span className="text-xs text-on-surface-variant font-bold print:text-gray-600">Ingresos Totales ({timeframe})</span>
            <span className="text-headline-lg font-black text-primary">$ {totalRevenue.toFixed(2)}</span>
          </div>

          <div className="bg-surface-container/60 border border-white/10 p-md rounded-2xl flex flex-col gap-xs print:border-black/20 print:bg-gray-50">
            <span className="text-xs text-on-surface-variant font-bold print:text-gray-600">Total de Pedidos Atendidos</span>
            <span className="text-headline-lg font-black text-on-surface print:text-black">{orders.length} pedidos</span>
          </div>

          <div className="bg-surface-container/60 border border-white/10 p-md rounded-2xl flex flex-col gap-xs print:border-black/20 print:bg-gray-50">
            <span className="text-xs text-on-surface-variant font-bold print:text-gray-600">Unidades Vendidas</span>
            <span className="text-headline-lg font-black text-emerald-400 print:text-emerald-700">{totalItemsSold} unidades</span>
          </div>
        </div>

        {/* Report Content Breakdown Table */}
        <div className="overflow-x-auto">
          {reportType === 'productos' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-extrabold uppercase text-on-surface-variant print:border-black/20 print:text-black">
                  <th className="py-md px-sm">Producto / Combo</th>
                  <th className="py-md px-sm">Opción Predefinida</th>
                  <th className="py-md px-sm text-center">Unidades Vendidas</th>
                  <th className="py-md px-sm text-right">Recaudación Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {mostSoldProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-sm text-on-surface-variant">No hay datos suficientes para el reporte.</td>
                  </tr>
                ) : (
                  mostSoldProducts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors print:hover:bg-transparent">
                      <td className="py-md px-sm flex items-center gap-md">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-black/20 p-1 print:bg-transparent" />
                        <span className="font-bold text-on-surface text-body-lg print:text-black">{item.name}</span>
                      </td>
                      <td className="py-md px-sm text-xs font-bold text-primary">{item.option}</td>
                      <td className="py-md px-sm text-center font-extrabold text-on-surface print:text-black">{item.qty} un.</td>
                      <td className="py-md px-sm text-right font-price-display font-bold text-primary">$ {item.revenue.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-extrabold uppercase text-on-surface-variant print:border-black/20 print:text-black">
                  <th className="py-md px-sm">Ingrediente / Insumo</th>
                  <th className="py-md px-sm">Categoría</th>
                  <th className="py-md px-sm text-center">Cantidad Consumida</th>
                  <th className="py-md px-sm text-right">Estado de Consumo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {ingredientReportList.map((ing, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors print:hover:bg-transparent">
                    <td className="py-md px-sm flex items-center gap-md">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-primary font-bold print:border-black/20">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-on-surface text-body-lg print:text-black">{ing.name}</span>
                    </td>
                    <td className="py-md px-sm text-xs text-on-surface-variant print:text-black font-bold">{ing.category}</td>
                    <td className="py-md px-sm text-center font-extrabold text-primary text-body-lg">
                      {ing.qtyConsumed} {ing.unit}
                    </td>
                    <td className="py-md px-sm text-right">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 print:border-emerald-700 print:text-emerald-800">
                        Consumo Normal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
