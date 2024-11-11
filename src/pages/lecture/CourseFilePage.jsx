import React from 'react';
import TopBar from '../../components/layout/TopBar.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import CourseFileContent from '../../components/lecture/CourseFileContent.jsx';

const CourseFilePage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <CourseFileContent />
        </div>
      </div>
  );
};

export default CourseFilePage;
