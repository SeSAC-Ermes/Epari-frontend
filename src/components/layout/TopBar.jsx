import React from 'react';
import Logo from '../../assets/epariLogo.jpg'
import { useNavigate } from 'react-router-dom';

/**
 * 페이지 상단의 네비게이션 바 컴포넌트
 * 로고, 서비스명 표시 및 마이페이지 링크 제공
 */
const TopBar = () => {
  const navigate = useNavigate();

  return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-full px-10 py-4 flex justify-between items-center">
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
            <sup className="text-sm text-gray-500">epari</sup>
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
