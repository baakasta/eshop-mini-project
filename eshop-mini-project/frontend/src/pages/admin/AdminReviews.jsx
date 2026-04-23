import { useEffect, useState } from 'react';
import { reviewService } from '../../services';
import { formatDateShort } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiOutlineCheck, HiOutlineTrash, HiOutlineStar } from 'react-icons/hi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => reviewService.getAll().then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const approve = async (id) => { try { await reviewService.approve(id); load(); toast.success('Approuvé'); } catch { toast.error('Erreur'); } };
  const del = async (id) => { try { await reviewService.delete(id); load(); toast.success('Supprimé'); } catch { toast.error('Erreur'); } };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Modération des Avis</h1>
      {reviews.length === 0 ? <p className="text-slate-500 text-center py-20">Aucun avis</p> : (
        <div className="space-y-3">{reviews.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{r.customerName} — <span className="text-primary-600">{r.productNom}</span></p>
                <div className="flex gap-1 my-1">{[...Array(5)].map((_,i) => <HiOutlineStar key={i} className={`w-4 h-4 ${i < r.note ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />)}</div>
                {r.commentaire && <p className="text-sm text-slate-600">{r.commentaire}</p>}
                <p className="text-xs text-slate-400 mt-1">{formatDateShort(r.dateCreation)} · {r.approuve ? '✅ Approuvé' : '⏳ En attente'}</p>
              </div>
              <div className="flex gap-2">
                {!r.approuve && <button onClick={() => approve(r.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 cursor-pointer"><HiOutlineCheck className="w-5 h-5" /></button>}
                <button onClick={() => del(r.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"><HiOutlineTrash className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
