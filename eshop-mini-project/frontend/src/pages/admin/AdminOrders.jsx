import { useEffect, useState } from 'react';
import { orderService } from '../../services';
import { formatPrice, formatDateShort } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { orderService.getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    try { const res = await orderService.updateStatus(id, status); setOrders(orders.map(o => o.id === id ? res.data : o)); toast.success('Statut mis à jour'); } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Gestion des Commandes</h1>
      <div className="space-y-4">{orders.length === 0 ? <p className="text-slate-500 text-center py-20">Aucune commande</p> : orders.map(o => {
        const s = ORDER_STATUS[o.statut] || { label: o.statut, color: 'bg-slate-100 text-slate-600' };
        return (
          <div key={o.id} className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div><p className="font-bold text-slate-900">{o.numeroCommande}</p><p className="text-sm text-slate-500">{o.customerName} — {o.customerEmail}</p><p className="text-xs text-slate-400">{formatDateShort(o.dateCommande)}</p></div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                <span className="text-lg font-bold text-primary-600">{formatPrice(o.totalTTC)}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {['EN_ATTENTE','CONFIRMEE','ANNULEE'].map(st => (
                <button key={st} onClick={() => updateStatus(o.id, st)} disabled={o.statut === st}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all disabled:opacity-30 ${ORDER_STATUS[st]?.color || 'bg-slate-100'}`}>{ORDER_STATUS[st]?.label || st}</button>
              ))}
            </div>
          </div>
        );
      })}</div>
    </div>
  );
}
