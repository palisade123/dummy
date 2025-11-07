import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import Logo from '../assets/headerlogo.png';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <img src={Logo} alt="Virtual Lab logo" className="h-12 w-auto" />
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/nilai" className="text-gray-700 hover:text-primary transition-colors transition-colors relative group">
              Daftar Nilai
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/praktikum" className="text-gray-700 hover:text-primary transition-colors transition-colors relative group">
              Praktikum
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/galeri" className="text-gray-700 hover:text-primary transition-colors transition-colors relative group">
              Galeri
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/login" className="bg-primary-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
