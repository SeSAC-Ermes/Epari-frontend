import React from 'react';
import TopBar from '../../components/layout/TopBar.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import CourseFileContent from '../../components/lecture/file/CourseFileContent.jsx';
import { useSearchParams } from 'react-router-dom';

const CourseFilePage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <CourseFileContent courseId={courseId} />
        </div>
      </div>
  );
};

export default CourseFilePage;
