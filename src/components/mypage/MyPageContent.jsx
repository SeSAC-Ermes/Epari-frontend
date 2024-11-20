import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import UserProfile from "./UserProfile.jsx";
import CourseHistory from "./CourseHistory.jsx";

/**
 * 마이페이지
 */
const MyPageContent = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profileImage: null
  });

  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();

      setUserInfo({
        name: userAttributes.name || currentUser.username,
        email: userAttributes.email,
        profileImage: userAttributes['custom:profile_image']
      });
      setLoading(false);

      if (onProfileUpdate) {
        await onProfileUpdate();
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg">
        <div className="bg-white min-h-screen">
          <UserProfile
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onProfileUpdate={async () => {
                await fetchUserInfo();
                window.location.reload();
              }}
          />

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* 강의 이력 섹션 */}
            <div className="mb-8">
              <CourseHistory/>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MyPageContent;
