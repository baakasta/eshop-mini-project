import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../../services';
import { formatPrice } from '../../utils/formatters';
import { HiOutlineShoppingCart, HiOutlineStar, HiOutlineArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([productService.getAll(), categoryService.getAllFlat()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (id) => {
    if (!user) { toast.error('Connectez-vous d\'abord'); return; }
    try { await addToCart(id); toast.success('Ajouté au panier !'); } catch { toast.error('Erreur'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.3),transparent_70%)]" />
          <div className="absolute inset-0 gradient-hero opacity-90" />
          <div className="py-24 md:py-32 px-8 relative z-10">
            <div className="max-w-2xl animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6 backdrop-blur-sm">
                <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
                <span>Livraison gratuite dès 100 TND</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Découvrez le <span className="bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">meilleur</span> du shopping
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-lg">Des milliers de produits de qualité, livrés rapidement partout en Tunisie.</p>
              <div className="mt-8">
                <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all shadow-xl">
                  Explorer <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon: HiOutlineTruck, t: 'Livraison Rapide', d: '24-48h' }, { icon: HiOutlineShieldCheck, t: 'Paiement Sécurisé', d: 'Données protégées' }, { icon: HiOutlineSparkles, t: 'Qualité Garantie', d: 'Retour 30 jours' }].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg flex items-center gap-4 animate-fade-in">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0"><f.icon className="w-6 h-6 text-primary-600" /></div>
              <div><h3 className="font-semibold text-slate-900">{f.t}</h3><p className="text-sm text-slate-500">{f.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Produits Vedettes</h2>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-medium hover:underline">Voir tout <HiOutlineArrowRight className="w-4 h-4" /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"><div className="h-56 bg-slate-200" /><div className="p-5 space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-4 bg-slate-200 rounded w-1/2" /></div></div>)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0,4).map((p,i) => (
              <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in" style={{animationDelay:`${i*0.1}s`}}>
                <Link to={`/products/${p.id}`} className="block relative overflow-hidden">
                  <img src={p.images?.[0] || 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'} alt={p.nom} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.prixPromo && <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg">PROMO</span>}
                </Link>
                <div className="p-5">
                  <Link to={`/products/${p.id}`}><h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{p.nom}</h3></Link>
                  <div className="flex items-center gap-1 mt-1">{[...Array(5)].map((_,j) => <HiOutlineStar key={j} className={`w-3.5 h-3.5 ${j < Math.round(p.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />)}<span className="text-xs text-slate-400 ml-1">({p.reviewCount})</span></div>
                  <div className="flex items-center justify-between mt-3">
                    <div>{p.prixPromo ? <><span className="text-lg font-bold text-primary-600">{formatPrice(p.prixPromo)}</span><span className="text-sm text-slate-400 line-through ml-2">{formatPrice(p.prix)}</span></> : <span className="text-lg font-bold text-primary-600">{formatPrice(p.prix)}</span>}</div>
                    <button onClick={() => handleAdd(p.id)} className="p-2.5 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all cursor-pointer"><HiOutlineShoppingCart className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">Catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(c => (
                <Link to={`/products`} key={c.id} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-white font-bold text-lg">{c.nom.charAt(0)}</span></div>
                  <h3 className="font-semibold text-slate-900 text-sm">{c.nom}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
