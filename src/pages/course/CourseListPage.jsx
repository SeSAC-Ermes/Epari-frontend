import React from 'react';
import TopBar from "../../components/layout/TopBar.jsx";
import CourseListContent from '../../components/course/dashboard/CourseListContent.jsx';

const CourseListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <CourseListContent />
      </div>
  );
};

export default CourseListPage;
