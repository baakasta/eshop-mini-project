import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressService, orderService } from '../../services';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({ rue: '', ville: '', codePostal: '', pays: 'Algérie', principal: false });
  const [showForm, setShowForm] = useState(false);
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    addressService.getAll().then(r => {
      setAddresses(r.data);
      const primary = r.data.find(a => a.principal);
      if (primary) setSelectedAddr(primary.id);
      else if (r.data.length > 0) setSelectedAddr(r.data[0].id);
    }).catch(() => {});
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressService.create(newAddr);
      setAddresses([...addresses, res.data]);
      setSelectedAddr(res.data.id);
      setShowForm(false);
      toast.success('Adresse ajoutée');
    } catch { toast.error('Erreur'); }
  };

  const handleOrder = async () => {
    if (!selectedAddr) { toast.error('Sélectionnez une adresse'); return; }
    setLoading(true);
    try {
      await orderService.placeOrder({ addressId: selectedAddr, couponCode: couponCode || null });
      toast.success('Commande passée avec succès !');
      await fetchCart();
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Finaliser la commande</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Adresse de livraison</h3>
            {addresses.length > 0 ? (
              <div className="space-y-3">{addresses.map(a => (
                <label key={a.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAddr === a.id ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="address" checked={selectedAddr === a.id} onChange={() => setSelectedAddr(a.id)} className="mt-1 accent-primary-600" />
                  <div><p className="font-medium text-slate-900">{a.rue}</p><p className="text-sm text-slate-500">{a.ville}, {a.codePostal} - {a.pays}</p></div>
                </label>
              ))}</div>
            ) : <p className="text-slate-500 text-sm">Aucune adresse enregistrée</p>}
            <button onClick={() => setShowForm(!showForm)} className="mt-4 text-sm text-primary-600 font-medium hover:underline cursor-pointer">{showForm ? 'Annuler' : '+ Ajouter une adresse'}</button>
            {showForm && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-3 border-t pt-4">
                <input type="text" required placeholder="Rue" value={newAddr.rue} onChange={e => setNewAddr({...newAddr, rue: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" required placeholder="Ville" value={newAddr.ville} onChange={e => setNewAddr({...newAddr, ville: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                  <input type="text" required placeholder="Code Postal" value={newAddr.codePostal} onChange={e => setNewAddr({...newAddr, codePostal: e.target.value})} className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <button type="submit" className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl cursor-pointer">Sauvegarder</button>
              </form>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Code promo</h3>
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Entrez votre code" className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              <button className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Appliquer</button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-4">Récapitulatif</h3>
            <div className="space-y-3 mb-4">{cart.items?.map(item => (
              <div key={item.id} className="flex justify-between text-sm"><span className="text-slate-600 truncate mr-2">{item.productNom} ×{item.quantite}</span><span className="font-medium shrink-0">{formatPrice(item.prix * item.quantite)}</span></div>
            ))}</div>
            <hr className="border-slate-100 mb-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Sous-total</span><span>{formatPrice(cart.total)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Livraison</span><span>{cart.total > 5000 ? 'Gratuite' : formatPrice(500)}</span></div>
              <hr className="border-slate-100" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary-600">{formatPrice(cart.total + (cart.total > 5000 ? 0 : 500))}</span></div>
            </div>
            <button onClick={handleOrder} disabled={loading || !selectedAddr}
              className="mt-6 w-full py-3 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all disabled:opacity-50 cursor-pointer">
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
