import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import CourseNoticeContent from '../components/CourseNoticeContent.jsx';

const CourseNoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <CourseNoticeContent />
        </div>
      </div>
  );
};

export default CourseNoticeListPage;
