import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

// Pages
import Login from '../pages/Login';
import Listings from '../pages/Listings';
import ListingDetail from '../pages/ListingDetail';
import Favorites from '../pages/Favorites';
import Projects from '../pages/Projects';
import Rentals from '../pages/Rentals';
import Insights from '../pages/Insights';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/listings" />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="projects" element={<Projects />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="insights" element={<Insights />} />
      </Route>
    </Routes>
  );
}
