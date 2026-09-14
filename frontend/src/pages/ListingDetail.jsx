import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch, formatINR } from '../services/api';
import { ArrowLeft, CheckCircle, ExternalLink, MapPin } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Using the undocumented plural endpoint we discovered!
        const data = await apiFetch(`/v1/listings/${id}`, token);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing details.');
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id, token]);

  if (loading) return <div className="container text-center">Loading...</div>;
  if (error) return <div className="container text-center text-accent">{error}</div>;
  if (!listing) return <div className="container text-center">Not found</div>;

  return (
    <div className="container">
      <Link to="/listings" className="flex items-center gap-2 mb-8 text-sm">
        <ArrowLeft size={16} /> Back to listings
      </Link>

      <div className="glass-card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent text-sm font-semibold uppercase">{listing.property_type}</span>
              {listing.is_verified && <CheckCircle size={16} className="text-accent" />}
            </div>
            <h1>{listing.bedroom} BHK in {listing.apartment_name || listing.locality}</h1>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} />
              <span className="capitalize">{listing.locality}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatINR(listing.price)}</div>
            <div className="text-sm">₹{Math.round(listing.price / listing.carpet_area)} / sqft</div>
          </div>
        </div>

        <div className="grid mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div>
            <div className="text-sm">Carpet Area</div>
            <div className="font-semibold">{listing.carpet_area} sqft</div>
          </div>
          <div>
            <div className="text-sm">Bedrooms</div>
            <div className="font-semibold">{listing.bedroom}</div>
          </div>
          <div>
            <div className="text-sm">Bathrooms</div>
            <div className="font-semibold">{listing.bathroom}</div>
          </div>
          <div>
            <div className="text-sm">Furnishing</div>
            <div className="font-semibold capitalize">{listing.furnishing}</div>
          </div>
          <div>
            <div className="text-sm">Floor</div>
            <div className="font-semibold">{listing.floor} out of {listing.total_floors}</div>
          </div>
          <div>
            <div className="text-sm">Facing</div>
            <div className="font-semibold capitalize">{listing.facing_direction}</div>
          </div>
        </div>

        <div className="mb-8">
          <h3>Description</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{listing.description}</p>
        </div>

        <div className="flex justify-between items-center border-t border-glass pt-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div>
            <div className="text-sm">Posted By</div>
            <div className="font-semibold">{listing.posted_by_name} ({listing.posted_by})</div>
            <div className="text-accent">{listing.posted_by_contact}</div>
          </div>
          <a href={listing.listing_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            View on {listing.website} <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
