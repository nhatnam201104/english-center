import { useAuthStore } from '../../stores/auth.store';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentHeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

export const StudentHeader = ({ onMenuClick, isMenuOpen }: StudentHeaderProps) => {
  const { user, handleLogout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Xin chào, {user?.fullname || 'Học sinh'} 👋
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.fullname?.charAt(0) || 'S'}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{user?.fullname || 'Học sinh'}</span>
              <span className="text-sm text-gray-500">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};