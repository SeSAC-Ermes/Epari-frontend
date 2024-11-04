import React from 'react';
import Logo from '../../assets/epariLogo.jpg'
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
          >
            <img
                src={Logo}
                alt="Epari Logo"
                className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-semibold">SeSAC</span>
            <span className="text-sm text-gray-500">epari</span>
          </div>

          <button
              className="w-10 h-10 rounded-full overflow-hidden"
              onClick={() => navigate('/mypage')}
          >
            <img
                src="/api/placeholder/40/40"
                alt="프로필"
                className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>
  );
};

export default TopBar;
