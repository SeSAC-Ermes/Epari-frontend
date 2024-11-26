import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserAttributes, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';  // 이 줄 추가
import { useAuth } from '../../auth/AuthContext';  // 이 줄 추가
import axios from '../../api/axios.js';

const UserProfile = () => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { isGoogleUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profileImage: null
  });

  const fetchUserInfo = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.payload;

      if (isGoogleUser) {
        setUserInfo({
          name: idToken.name || '',
          email: idToken.email || '',
          profileImage: null
        });
      } else {
        const userAttributes = await fetchUserAttributes();
        setUserInfo({
          name: userAttributes.name || currentUser.username,
          email: userAttributes.email,
          profileImage: userAttributes['custom:profile_image']
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user info:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [isGoogleUser]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/user/mypage/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserInfo(prev => ({
        ...prev,
        profileImage: response.data
      }));

      await fetchUserInfo();

    } catch (error) {
      console.error('Profile image upload failed:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!userInfo.profileImage) return;

    try {
      await axios.delete('/api/user/mypage/profile/image');

      setUserInfo(prev => ({
        ...prev,
        profileImage: null
      }));

      await fetchUserInfo();

    } catch (error) {
      console.error('Profile image deletion failed:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-32">
          <div className="text-gray-500">Loading...</div>
        </div>
    );
  }

  return (
      <div className="w-full bg-white rounded-lg px-12">
        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-6">
        </div>

        {/* Profile Section */}
        <div className="max-w-7xl mx-auto px-8 pb-12 border-b">
          <div className="flex items-start gap-12">
            {/* Profile Image Section */}
            <div className="space-y-6">
              <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden ring-2 ring-offset-2 ring-gray-200">
                {userInfo.profileImage ? (
                    <img
                        src={userInfo.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-4xl font-semibold">{userInfo.name[0]}</span>
                    </div>
                )}
              </div>

              {/* Image Buttons */}
              {!isGoogleUser && (
                  <div className="flex gap-4">
                    <label>
                      <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                      />
                      <span className="text-sm text-gray-600 hover:underline cursor-pointer">
                    이미지 변경
                  </span>
                    </label>

                    <button
                        onClick={handleImageDelete}
                        disabled={!userInfo.profileImage}
                        className={`text-sm ${userInfo.profileImage ? 'text-rose-500 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      삭제
                    </button>
                  </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-6 pt-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userInfo.name}</h2>
                <p className="text-lg text-gray-500 mt-2">{userInfo.email}</p>
              </div>

              {/* Security Section - Google 사용자가 아닌 경우에만 표시 */}
              {!isGoogleUser && (
                  <div className="pt-2">
                    <button
                        onClick={() => navigate('/mypage/change-password')}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      비밀번호 변경
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
