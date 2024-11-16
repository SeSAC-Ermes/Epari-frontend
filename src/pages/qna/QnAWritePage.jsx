import React from 'react';
import TopBar from '../../components/layout/TopBar.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import QnAWriteContent from '../../components/qna/QnAWriteContent.jsx';

const QnAWritePage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <QnAWriteContent />
        </div>
      </div>
  );
};

export default QnAWritePage;
