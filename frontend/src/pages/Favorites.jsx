import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { apiFetch, formatINR } from '../services/api';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { token } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setLoading(true);
      if (favorites.length === 0) {
        setFavoriteListings([]);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch all favorites sequentially or in parallel using the plural listings/{id} endpoint
        const promises = favorites.map(f => apiFetch(`/v1/listings/${f.listing_id}`, token).catch(() => null));
        const results = await Promise.all(promises);
        setFavoriteListings(results.filter(r => r !== null));
      } catch (err) {
        console.error('Failed to fetch favorite details', err);
      }
      setLoading(false);
    };
    
    fetchFavoriteDetails();
  }, [favorites, token]);

  if (loading) return <div className="container text-center">Loading your favorites...</div>;

  return (
    <div className="container">
      <h1 className="mb-8">Your Favorites</h1>
      
      {favoriteListings.length === 0 ? (
        <div className="text-center glass-card p-8">
          <p>You haven't saved any favorites yet.</p>
          <Link to="/listings" className="text-accent mt-4 inline-block">Browse properties</Link>
        </div>
      ) : (
        <div className="grid">
          {favoriteListings.map(listing => {
            const fav = isFavorite(listing.listing_id);
            return (
            <Link to={`/listings/${listing.listing_id}`} key={listing.listing_id} className="glass-card flex-col justify-between" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-accent text-sm font-semibold uppercase">{listing.property_type}</span>
                  <button className="outline" style={{ padding: '0.25rem', border: 'none', color: fav ? '#ef4444' : 'inherit' }} onClick={(e) => { e.preventDefault(); toggleFavorite(listing.listing_id); }}>
                    <Heart size={20} fill={fav ? '#ef4444' : 'none'} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{listing.bedroom} BHK in {listing.apartment_name || listing.locality}</h3>
                <p className="text-sm mb-4 capitalize">{listing.locality} • {listing.furnishing}</p>
                <div className="flex gap-4 mb-4">
                  <div>
                    <div className="text-sm">Price</div>
                    <div className="font-semibold">{formatINR(listing.price)}</div>
                  </div>
                  <div>
                    <div className="text-sm">Area</div>
                    <div className="font-semibold">{listing.carpet_area} sqft</div>
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
