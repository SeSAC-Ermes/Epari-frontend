import React from 'react';
import TopBar from '../../components/layout/TopBar.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import CourseFileCreateContent from '../../components/lecture/file/CourseFileCreateContent.jsx';

const CourseFileCreatePage = () => {
  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <CourseFileCreateContent />
        </div>
      </div>
  );
};

export default CourseFileCreatePage;
