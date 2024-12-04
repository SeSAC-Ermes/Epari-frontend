import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserAttributes, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '../../auth/AuthContext';
import Logo from '../../assets/epariLogo.jpg';

/**
 * 페이지 상단의 네비게이션 바 컴포넌트
 * 로고, 서비스명 표시 및 마이페이지 링크 제공
 */
const TopBar = () => {
  const navigate = useNavigate();
  const { isGoogleUser, profileImage: contextProfileImage } = useAuth();  // AuthContext의 profileImage 추가
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (isGoogleUser) {
          const session = await fetchAuthSession();
          const idToken = session.tokens.idToken.payload;
          setUserName(idToken.name || '');
          setProfileImage(idToken['custom:profile_image'] || null);
        } else {
          const userAttributes = await fetchUserAttributes();
          setUserName(userAttributes.name);
          setProfileImage(userAttributes['custom:profile_image'] || null);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    getUserInfo();
  }, [isGoogleUser, contextProfileImage]);  // contextProfileImage 의존성 추가

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 프로필 이미지 컴포넌트
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

          <div className="relative">
            <button
                className="w-10 h-10 rounded-full overflow-hidden"
                onMouseEnter={() => setIsDropdownOpen(true)}
            >
              <ProfileImage src={profileImage} name={userName}/>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    className="absolute right-0 mt-1 w-32 bg-white rounded shadow-md py-0.5 text-sm"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                      className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => navigate('/mypage')}
                  >
                    마이페이지
                  </button>
                  <button
                      className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
            )}
          </div>
        </div>
      </header>
  );
};

export default TopBar;
