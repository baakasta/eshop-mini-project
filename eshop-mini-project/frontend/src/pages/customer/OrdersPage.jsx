import { useEffect, useState } from 'react';
import { orderService } from '../../services';
import { formatPrice, formatDateShort } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Mes Commandes</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20"><p className="text-slate-500 text-lg">Aucune commande pour le moment</p></div>
      ) : (
        <div className="space-y-4">{orders.map(o => {
          const status = ORDER_STATUS[o.statut] || { label: o.statut, color: 'bg-slate-100 text-slate-600' };
          return (
            <div key={o.id} className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-slate-900">{o.numeroCommande}</p>
                  <p className="text-sm text-slate-500">{formatDateShort(o.dateCommande)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>
                  <span className="text-lg font-bold text-primary-600">{formatPrice(o.totalTTC)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                {o.lignes?.map(l => (
                  <div key={l.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{l.productNom} × {l.quantity}</span>
                    <span className="font-medium">{formatPrice(l.prixUnitaire * l.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}</div>
      )}
    </div>
  );
}
