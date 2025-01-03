import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAuthSession, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import { useAuth } from '../../auth/AuthContext';
import { LogOut, MessageSquare, User } from 'lucide-react';
import Logo from '../../assets/epariLogo.jpg';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGoogleUser, profileImage: contextProfileImage } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session?.tokens) {
          return;
        }

        if (isGoogleUser) {
          const idToken = session.tokens.idToken.payload;
          setUserName(idToken.name || '');
          setProfileImage(idToken['custom:profile_image'] || null);
        } else {
          const userAttributes = await fetchUserAttributes();
          setUserName(userAttributes.name);
          setProfileImage(userAttributes['custom:profile_image'] || null);
        }
      } catch (err) {
        if (err.name !== 'UserUnAuthenticatedException') {
          console.error('Error fetching user info:', err);
        }
        // 인증되지 않은 사용자의 경우 조용히 처리
        setUserName('');
        setProfileImage(null);
      }
    };

    getUserInfo();
  }, [isGoogleUser, contextProfileImage]);

  // 나머지 코드는 동일하게 유지...

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ProfileImage 컴포넌트 동일하게 유지...
  const ProfileImage = ({ src, name }) => {
    const [imageError, setImageError] = useState(false);

    if (!src || imageError) {
      return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-lg font-semibold">
            {name ? name[0].toUpperCase() : ''}
          </span>
          </div>
      );
    }

    return (
        <img
            src={src}
            alt="프로필"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
        />
    );
  };

  return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-full px-10 py-4 flex justify-between items-center">
          {/* 로고 영역 */}
          <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
          >
            <span className="text-xl font-semibold">SeSAC</span>
            <img
                src={Logo}
                alt="Epari Logo"
                className="w-10 h-10 object-contain"
            />
          </div>

          {/* 오른쪽 메뉴 영역 */}
          <div className="flex items-center space-x-4">
            {/* 커뮤니티 버튼 */}
            <button
                onClick={() => navigate('/board')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/board')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <MessageSquare size={18} />
              <span className="text-sm font-medium">커뮤니티</span>
            </button>

            {/* 프로필 영역 */}
            <div className="relative">
              <button
                  className="w-10 h-10 rounded-full overflow-hidden"
                  onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <ProfileImage src={profileImage} name={userName} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                  <div
                      className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg py-1"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={() => navigate('/mypage')}
                    >
                      <User size={16} />
                      <span>마이페이지</span>
                    </button>
                    <button
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>로그아웃</span>
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default TopBar;
