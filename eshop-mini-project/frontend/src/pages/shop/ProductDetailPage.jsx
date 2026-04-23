import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService, reviewService } from '../../services';
import { formatPrice, formatDateShort } from '../../utils/formatters';
import { HiOutlineShoppingCart, HiOutlineStar, HiOutlineCheck } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' });
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([productService.getById(id), reviewService.getByProduct(id)])
      .then(([p, r]) => { setProduct(p.data); setReviews(r.data); })
      .catch(() => toast.error('Produit introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error('Connectez-vous d\'abord'); return; }
    try { for (let i = 0; i < qty; i++) await addToCart(product.id); toast.success('Ajouté au panier !'); } catch { toast.error('Erreur'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create({ productId: id, ...reviewForm });
      toast.success('Avis envoyé, en attente d\'approbation');
      setReviewForm({ note: 5, commentaire: '' });
    } catch { toast.error('Erreur'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-20"><p className="text-slate-500 text-lg">Produit introuvable</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        <div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img src={product.images?.[0] || 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'} alt={product.nom} className="w-full h-96 object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.map((img, i) => <img key={i} src={img} alt="" className="w-full h-20 object-cover rounded-xl border-2 border-transparent hover:border-primary-500 cursor-pointer transition-all" />)}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.categories?.map(c => <span key={c.id} className="text-xs font-medium bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{c.nom}</span>)}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{product.nom}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">{[...Array(5)].map((_,i) => <HiOutlineStar key={i} className={`w-5 h-5 ${i < Math.round(product.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />)}</div>
            <span className="text-sm text-slate-500">({product.reviewCount} avis)</span>
          </div>
          <div className="mt-6">
            {product.prixPromo ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(product.prixPromo)}</span>
                <span className="text-xl text-slate-400 line-through">{formatPrice(product.prix)}</span>
                <span className="bg-rose-100 text-rose-700 text-sm font-bold px-2 py-1 rounded-lg">-{Math.round((1 - product.prixPromo / product.prix) * 100)}%</span>
              </div>
            ) : <span className="text-3xl font-bold text-primary-600">{formatPrice(product.prix)}</span>}
          </div>
          <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>
          <div className="mt-6 flex items-center gap-2">
            {product.stock > 0 ? <><HiOutlineCheck className="w-5 h-5 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">En stock ({product.stock})</span></> : <span className="text-sm text-rose-600 font-medium">Rupture de stock</span>}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty-1))} className="px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-l-xl cursor-pointer">-</button>
              <span className="px-4 py-3 font-medium">{qty}</span>
              <button onClick={() => setQty(qty+1)} className="px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-r-xl cursor-pointer">+</button>
            </div>
            <button onClick={handleAdd} disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all disabled:opacity-50 cursor-pointer">
              <HiOutlineShoppingCart className="w-5 h-5" /> Ajouter au panier
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">Vendu par <span className="font-medium text-slate-700">{product.sellerName}</span></p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Avis clients ({reviews.length})</h2>
        {user && user.role === 'CUSTOMER' && (
          <form onSubmit={handleReview} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="font-semibold mb-4">Laisser un avis</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-600">Note:</span>
              {[1,2,3,4,5].map(n => <button type="button" key={n} onClick={() => setReviewForm({...reviewForm, note: n})}
                className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${n <= reviewForm.note ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>{n}</button>)}
            </div>
            <textarea value={reviewForm.commentaire} onChange={e => setReviewForm({...reviewForm, commentaire: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary-500 outline-none" rows={3} placeholder="Votre commentaire..." />
            <button type="submit" className="mt-3 px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer">Envoyer</button>
          </form>
        )}
        {reviews.length === 0 ? <p className="text-slate-500">Aucun avis pour ce produit</p> : (
          <div className="space-y-4">{reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"><span className="text-primary-600 font-bold text-sm">{r.customerName?.charAt(0)}</span></div><div><p className="font-medium text-slate-900">{r.customerName}</p><p className="text-xs text-slate-400">{formatDateShort(r.dateCreation)}</p></div></div>
                <div className="flex">{[...Array(5)].map((_,i) => <HiOutlineStar key={i} className={`w-4 h-4 ${i < r.note ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />)}</div>
              </div>
              {r.commentaire && <p className="mt-3 text-sm text-slate-600">{r.commentaire}</p>}
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
