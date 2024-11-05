import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import CurriculumContent from '../components/CurriculumContent.jsx';

const CurriculumPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <CurriculumContent />
        </div>
      </div>
  );
};

export default CurriculumPage;
