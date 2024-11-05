import React from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import MainContent from '../../components/MainContent';
import TopBar from "../../components/layout/TopBar.jsx";

const ExamPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <MainContent />
        </div>
      </div>
  );
};

export default ExamPage;
