import React, { useState } from 'react';
import { Camera, Trash2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';

const UserProfile = ({ userInfo, setUserInfo, onProfileUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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

      await onProfileUpdate();

    } catch (error) {
      console.error('Profile image upload failed:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      await axios.delete('/api/user/mypage/profile/image');

      setUserInfo(prev => ({
        ...prev,
        profileImage: null
      }));

      await onProfileUpdate();

    } catch (error) {
      console.error('Profile image deletion failed:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    }
  };

  return (
      <div className="w-full bg-white">
        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        </div>

        {/* Profile Section */}
        <div className="max-w-7xl mx-auto px-8 pb-8 border-b">
          <div className="flex items-start gap-8">
            {/* Profile Image Section */}
            <div className="space-y-4">
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
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                  />
                  <div
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 cursor-pointer gap-2">
                    <Camera className="h-4 w-4"/>
                    <span>이미지 변경</span>
                  </div>
                </label>

                {userInfo.profileImage && (
                    <button
                        onClick={handleImageDelete}
                        className="px-3 py-2 border border-gray-300 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </button>
                )}
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-4 pt-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{userInfo.name}</h2>
                <p className="text-gray-500 mt-1">{userInfo.email}</p>
              </div>

              {/* Security Section */}
              <div className="pt-2">
                <button
                    onClick={() => navigate('/mypage/change-password')}
                    className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <Lock className="mr-2 h-4 w-4"/>
                  비밀번호 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
