import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services';
import { formatPrice } from '../../utils/formatters';
import { HiOutlineShoppingCart, HiOutlineStar, HiOutlineSearch } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    productService.getAll().then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = search.trim() ? await productService.search(search) : await productService.getAll();
      setProducts(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (id) => {
    if (!user) { toast.error('Connectez-vous d\'abord'); return; }
    try { await addToCart(id); toast.success('Ajouté au panier !'); } catch { toast.error('Erreur'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div><h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tous les Produits</h1><p className="text-slate-500 mt-1">{products.length} produit{products.length !== 1 && 's'}</p></div>
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(8)].map((_,i) => <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"><div className="h-56 bg-slate-200" /><div className="p-5 space-y-3"><div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-4 bg-slate-200 rounded w-1/2" /></div></div>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20"><p className="text-slate-500 text-lg">Aucun produit trouvé</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p,i) => (
            <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in" style={{animationDelay:`${i*0.05}s`}}>
              <Link to={`/products/${p.id}`} className="block relative overflow-hidden">
                <img src={p.images?.[0] || 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'} alt={p.nom} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.prixPromo && <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg">PROMO</span>}
              </Link>
              <div className="p-5">
                <Link to={`/products/${p.id}`}><h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{p.nom}</h3></Link>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-1 mt-2">{[...Array(5)].map((_,j) => <HiOutlineStar key={j} className={`w-3.5 h-3.5 ${j < Math.round(p.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />)}<span className="text-xs text-slate-400 ml-1">({p.reviewCount})</span></div>
                <div className="flex items-center justify-between mt-3">
                  <div>{p.prixPromo ? <><span className="text-lg font-bold text-primary-600">{formatPrice(p.prixPromo)}</span><span className="text-sm text-slate-400 line-through ml-2">{formatPrice(p.prix)}</span></> : <span className="text-lg font-bold text-primary-600">{formatPrice(p.prix)}</span>}</div>
                  <button onClick={() => handleAdd(p.id)} className="p-2.5 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all cursor-pointer"><HiOutlineShoppingCart className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
