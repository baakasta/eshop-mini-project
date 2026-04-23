import { useEffect, useState } from 'react';
import { couponService } from '../../services';
import { formatDateShort } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', type: 'PERCENT', valeur: 10, dateExpiration: '', usageMax: 100 });

  const load = () => couponService.getAll().then(r => setCoupons(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await couponService.create({ ...form, dateExpiration: new Date(form.dateExpiration).toISOString() });
      setForm({ code: '', type: 'PERCENT', valeur: 10, dateExpiration: '', usageMax: 100 });
      load(); toast.success('Coupon créé');
    } catch { toast.error('Erreur'); }
  };

  const handleDelete = async (id) => { try { await couponService.delete(id); load(); toast.success('Supprimé'); } catch { toast.error('Erreur'); } };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Gestion des Coupons</h1>
      <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Code</label><input type="text" required value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"><option value="PERCENT">Pourcentage</option><option value="FIXED">Fixe (TND)</option></select></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Valeur</label><input type="number" required value={form.valeur} onChange={e => setForm({...form, valeur: +e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Expiration</label><input type="date" required value={form.dateExpiration} onChange={e => setForm({...form, dateExpiration: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Usage max</label><input type="number" value={form.usageMax} onChange={e => setForm({...form, usageMax: +e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
        <button type="submit" className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer">Créer</button>
      </form>
      <div className="space-y-2">{coupons.map(c => (
        <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4"><span className="font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{c.code}</span><span className="text-sm text-slate-600">{c.type === 'PERCENT' ? `${c.valeur}%` : `${c.valeur} TND`}</span><span className="text-xs text-slate-400">{c.usageActuels}/{c.usageMax} utilisations</span></div>
          <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"><HiOutlineTrash className="w-5 h-5" /></button>
        </div>
      ))}</div>
    </div>
  );
}
