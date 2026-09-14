import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, formatINR } from '../services/api';
import { Key } from 'lucide-react';

export default function Rentals() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRentals = useCallback(async () => {
    if (!token || loading || !hasMore) return;
    setLoading(true);
    
    try {
      const data = await apiFetch(`/v1/rentals?offset=${offset}&limit=50`, token);
      
      setRentals(prev => [...prev, ...(data.results || [])]);
      setOffset(prev => prev + 50);
      setHasMore((data.results || []).length > 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [offset, token, loading, hasMore]);

  useEffect(() => {
    fetchRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1>Properties for Rent</h1>
      </div>

      <div className="grid">
        {rentals.map((rental, index) => (
          <div key={`${rental.listing_id}-${index}`} className="glass-card flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-accent text-sm font-semibold uppercase">{rental.property_type}</span>
                <Key size={18} className="text-accent" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{rental.bedroom} BHK in {rental.apartment_name || rental.locality}</h3>
              <p className="text-sm mb-4 capitalize">{rental.locality} • {rental.furnishing}</p>
              <div className="flex gap-4 mb-4">
                <div>
                  <div className="text-sm">Monthly Rent</div>
                  <div className="font-semibold">{formatINR(rental.rent)}</div>
                </div>
                <div>
                  <div className="text-sm">Area</div>
                  <div className="font-semibold">{rental.carpet_area} sqft</div>
                </div>
              </div>
            </div>
            <div className="text-sm flex justify-between items-center border-t border-glass pt-4 mt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <span>Available from {new Date(rental.available_from).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8 mb-8">
          <button onClick={() => fetchRentals()} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
