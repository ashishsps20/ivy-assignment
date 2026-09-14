import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, formatINR, normalizePrice } from '../services/api';
import { Building2 } from 'lucide-react';

export default function Projects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!token || loading || !hasMore) return;
    setLoading(true);
    
    try {
      const data = await apiFetch(`/v1/projects?offset=${offset}&limit=50`, token);
      
      setProjects(prev => [...prev, ...(data.results || [])]);
      setOffset(prev => prev + 50);
      setHasMore((data.results || []).length > 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [offset, token, loading, hasMore]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1>New Projects</h1>
      </div>

      <div className="grid">
        {projects.map((project, index) => (
          <div key={`${project.project_id}-${index}`} className="glass-card flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={20} className="text-accent" />
                <span className="text-accent text-sm font-semibold uppercase">{project.builder_name}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.project_name}</h3>
              <p className="text-sm mb-4 capitalize">{project.locality}</p>
              <div className="mb-4">
                <div className="text-sm">Price Range</div>
                <div className="font-semibold text-accent" style={{ fontSize: '1.1rem' }}>
                  {formatINR(normalizePrice(project.price_min))} - {formatINR(normalizePrice(project.price_max))}
                </div>
              </div>
            </div>
            <div className="text-sm flex justify-between items-center border-t border-glass pt-4 mt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <span>{project.total_listings} Listings available</span>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8 mb-8">
          <button onClick={() => fetchProjects()} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
