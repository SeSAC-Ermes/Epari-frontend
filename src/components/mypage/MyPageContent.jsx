import React from 'react';
import UserProfile from "./UserProfile.jsx";
import CourseHistory from "./CourseHistory.jsx";

/**
 * 마이페이지
 */
const MyPageContent = () => {
  return (
      <div className="bg-white rounded-lg">
        <div className="bg-white min-h-screen">
          <UserProfile/>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <CourseHistory/>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MyPageContent;
