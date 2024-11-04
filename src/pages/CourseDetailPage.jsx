import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import CourseDetailContent from '../components/CourseDetailContent.jsx';

const CourseDetailPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <CourseDetailContent />
        </div>
      </div>
  );
};

export default CourseDetailPage;
