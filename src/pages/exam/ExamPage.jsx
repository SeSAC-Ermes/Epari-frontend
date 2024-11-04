import React from 'react';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';

const ExamPage = () => {
  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent />
      </div>
  );
};

export default ExamPage;
