import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, formatINR } from '../services/api';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function Insights() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!token) return;
        
        // The analytics endpoint is a lie (404), so we fetch the totals from the individual endpoints!
        const [listingsData, rentalsData, projectsData] = await Promise.all([
          apiFetch('/v1/listings?limit=1', token),
          apiFetch('/v1/rentals?limit=1', token),
          apiFetch('/v1/projects?limit=1', token)
        ]);
        
        setSummary({
          total_listings: listingsData.total,
          total_rentals: rentalsData.total,
          total_projects: projectsData.total,
          cities_covered: 1
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchSummary();
  }, [token]);

  if (loading) return <div className="container text-center">Loading insights...</div>;
  if (!summary) return <div className="container text-center">Failed to load insights.</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1>Market Insights</h1>
      </div>

      <div className="grid mb-8">
        <div className="glass-card flex-col items-center justify-center text-center p-8">
          <h3 className="text-accent mb-2">Total Listings</h3>
          <div className="text-4xl font-bold">{summary.total_listings}</div>
        </div>
        <div className="glass-card flex-col items-center justify-center text-center p-8">
          <h3 className="text-accent mb-2">Total Rentals</h3>
          <div className="text-4xl font-bold">{summary.total_rentals}</div>
        </div>
        <div className="glass-card flex-col items-center justify-center text-center p-8">
          <h3 className="text-accent mb-2">Total Projects</h3>
          <div className="text-4xl font-bold">{summary.total_projects}</div>
        </div>
        <div className="glass-card flex-col items-center justify-center text-center p-8">
          <h3 className="text-accent mb-2">Cities Covered</h3>
          <div className="text-4xl font-bold">{summary.cities_covered}</div>
        </div>
      </div>

      <div className="glass-card mb-8">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="text-accent" />
          <h2 style={{ marginBottom: 0 }}>Our Discoveries</h2>
        </div>
        <p className="mb-4">During our analysis of this dataset, we found several interesting anomalies and "lies" in the documentation:</p>
        
        <ul className="flex-col gap-4" style={{ listStylePosition: 'inside' }}>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Pagination doesn't use `page`:</strong> The API uses `offset` and `limit`, ignoring `page` entirely!
          </li>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Missing / listing endpoint:</strong> `GET /v1/listing/:id` throws a 404, but `GET /v1/listings/:id` works!
          </li>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Corrupt data:</strong> 27 listings contain mathematically impossible data, such as negative prices or current floor &gt; total floors.
          </li>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Fake Listings:</strong> 18 listings are clearly fake with unreasonably low prices (e.g. ₹10,000 for a 4BHK) to generate leads.
          </li>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Unit scaling:</strong> Project prices are provided in Crores (e.g. 1.2) and Lacs (e.g. 60.5), not in raw INR as documented.
          </li>
          <li className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <strong>Missing analytics endpoint:</strong> `GET /v1/analytics/summary` throws a 404. We have to compute these totals by querying the listings, rentals, and projects endpoints with `limit=1` and reading the `total` property!
          </li>
        </ul>
      </div>
    </div>
  );
}
