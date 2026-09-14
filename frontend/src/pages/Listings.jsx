import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { apiFetch, formatINR } from '../services/api';
import { Link } from 'react-router-dom';
import { Heart, Search, Filter } from 'lucide-react';

export default function Listings() {
  const { token } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    locality: '',
    bhk: '',
    min_price: '',
    max_price: '',
    furnishing: '',
    sort_by: 'posted_at',
    order: 'desc'
  });

  const fetchListings = useCallback(async (reset = false) => {
    if (!token || loading || (!hasMore && !reset)) return;
    setLoading(true);
    
    try {
      const currentOffset = reset ? 0 : offset;
      let query = `?offset=${currentOffset}&limit=50`;
      
      if (filters.locality) query += `&locality=${filters.locality.toLowerCase()}`;
      if (filters.bhk) query += `&bhk=${filters.bhk}`;
      if (filters.min_price) query += `&min_price=${filters.min_price}`;
      if (filters.max_price) query += `&max_price=${filters.max_price}`;
      if (filters.furnishing) query += `&furnishing=${filters.furnishing}`;
      if (filters.sort_by) query += `&sort_by=${filters.sort_by}`;
      if (filters.order) query += `&order=${filters.order}`;

      const data = await apiFetch(`/v1/listings${query}`, token);
      
      // Filter out inactive listings as discovered during analysis
      const activeResults = (data.results || []).filter(l => l.is_live);
      
      if (reset) {
        setListings(activeResults);
      } else {
        setListings(prev => [...prev, ...activeResults]);
      }
      
      setOffset(currentOffset + 50);
      setHasMore((data.results || []).length > 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [filters, offset, token, loading, hasMore]);

  // Reset when filters change
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchListings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1>Properties for Sale</h1>
      </div>

      <div className="glass-card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-accent" />
          <h3>Filters</h3>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <label className="text-sm">Locality</label>
            <input name="locality" value={filters.locality} onChange={handleFilterChange} placeholder="e.g. adyar" />
          </div>
          <div>
            <label className="text-sm">BHK</label>
            <select name="bhk" value={filters.bhk} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Min Price</label>
            <input name="min_price" type="number" value={filters.min_price} onChange={handleFilterChange} placeholder="Any" />
          </div>
          <div>
            <label className="text-sm">Max Price</label>
            <input name="max_price" type="number" value={filters.max_price} onChange={handleFilterChange} placeholder="Any" />
          </div>
          <div>
            <label className="text-sm">Furnishing</label>
            <select name="furnishing" value={filters.furnishing} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="fully-furnished">Fully-Furnished</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Sort By</label>
            <select name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
              <option value="posted_at">Date Posted</option>
              <option value="price">Price</option>
              <option value="carpet_area">Area</option>
              <option value="bedroom">Bedrooms</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Order</label>
            <select name="order" value={filters.order} onChange={handleFilterChange}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid">
        {listings.map((listing, index) => {
          const fav = isFavorite(listing.listing_id);
          return (
          <Link to={`/listings/${listing.listing_id}`} key={`${listing.listing_id}-${index}`} className="glass-card flex-col justify-between" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            <div className="text-sm flex justify-between items-center border-t border-glass pt-4 mt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <span>By {listing.posted_by_name}</span>
            </div>
          </Link>
        )})}
      </div>
      
      {listings.length === 0 && !loading && (
        <div className="text-center mt-8">No listings found matching your criteria.</div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8 mb-8">
          <button onClick={() => fetchListings()} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
