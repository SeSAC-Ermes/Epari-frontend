import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import CourseFileArchiveContent from '../../components/lecture/archive/CourseFileArchiveContent';

const CourseFileArchivePage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="flex-1">
          <TopBar/>
          <CourseFileArchiveContent/>
        </div>
      </div>
  );
};

export default CourseFileArchivePage;
