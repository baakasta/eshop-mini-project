import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();

  const handleQty = async (itemId, qty) => {
    try { await updateItem(itemId, qty); } catch { toast.error('Erreur'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId); toast.success('Article retiré'); } catch { toast.error('Erreur'); }
  };

  if (!cart.items?.length) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <HiOutlineShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
      <p className="text-slate-500 mb-6">Découvrez nos produits et commencez vos achats</p>
      <Link to="/products" className="inline-flex px-6 py-3 gradient-primary text-white font-medium rounded-xl">Explorer les produits</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Mon Panier ({cart.itemCount} article{cart.itemCount > 1 && 's'})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 animate-fade-in">
              <img src={item.productImage || 'https://placehold.co/100x100/e2e8f0/64748b?text=N/A'} alt={item.productNom} className="w-24 h-24 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors">{item.productNom}</Link>
                {item.variantLabel && <p className="text-xs text-slate-500 mt-1">{item.variantLabel}</p>}
                <p className="text-primary-600 font-bold mt-2">{formatPrice(item.prix)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => handleRemove(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"><HiOutlineTrash className="w-5 h-5" /></button>
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button onClick={() => handleQty(item.id, item.quantite - 1)} className="px-3 py-1 text-sm hover:bg-slate-50 cursor-pointer">-</button>
                  <span className="px-3 py-1 text-sm font-medium">{item.quantite}</span>
                  <button onClick={() => handleQty(item.id, item.quantite + 1)} className="px-3 py-1 text-sm hover:bg-slate-50 cursor-pointer">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-24">
          <h3 className="font-semibold text-slate-900 mb-4">Résumé</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span className="font-medium">{formatPrice(cart.total)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Livraison</span><span className="font-medium">{cart.total > 5000 ? 'Gratuite' : formatPrice(500)}</span></div>
            <hr className="border-slate-100" />
            <div className="flex justify-between text-lg"><span className="font-bold text-slate-900">Total</span><span className="font-bold text-primary-600">{formatPrice(cart.total + (cart.total > 5000 ? 0 : 500))}</span></div>
          </div>
          <Link to="/checkout" className="mt-6 w-full flex items-center justify-center py-3 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all">Passer la commande</Link>
        </div>
      </div>
    </div>
  );
}
