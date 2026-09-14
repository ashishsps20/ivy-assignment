import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Building2, Heart, PieChart } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  
  return (
    <>
      <nav className="glass nav">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Building2 className="text-accent" />
          Ivy Homes
        </div>
        <div className="nav-links">
          <NavLink to="/listings" className={({isActive}) => isActive ? 'active' : ''}>
            <div className="flex items-center gap-2"><Home size={18}/> Listings</div>
          </NavLink>
          <NavLink to="/rentals" className={({isActive}) => isActive ? 'active' : ''}>
            <div className="flex items-center gap-2"><Home size={18}/> Rentals</div>
          </NavLink>
          <NavLink to="/projects" className={({isActive}) => isActive ? 'active' : ''}>
            <div className="flex items-center gap-2"><Building2 size={18}/> Projects</div>
          </NavLink>
          <NavLink to="/favorites" className={({isActive}) => isActive ? 'active' : ''}>
            <div className="flex items-center gap-2"><Heart size={18}/> Favorites</div>
          </NavLink>
          <NavLink to="/insights" className={({isActive}) => isActive ? 'active' : ''}>
            <div className="flex items-center gap-2"><PieChart size={18}/> Insights</div>
          </NavLink>
          <button onClick={logout} className="outline ml-4 flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
