import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setFavorites([]);
        return;
      }
      try {
        const data = await apiFetch('/v1/saved', token);
        setFavorites(data.results || []);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      }
    };
    fetchFavorites();
  }, [token]);

  const toggleFavorite = async (listingId) => {
    if (!token) return;

    const isFav = isFavorite(listingId);
    
    // Optimistic update
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.listing_id !== listingId));
    } else {
      setFavorites(prev => [...prev, { listing_id: listingId }]);
    }

    try {
      if (isFav) {
        await apiFetch(`/v1/saved/${listingId}`, token, { method: 'DELETE' });
      } else {
        await apiFetch('/v1/saved', token, {
          method: 'POST',
          body: JSON.stringify({ listing_id: listingId })
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on failure
      const data = await apiFetch('/v1/saved', token);
      setFavorites(data.results || []);
    }
  };

  const isFavorite = (listingId) => {
    return favorites.some(f => f.listing_id === listingId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
