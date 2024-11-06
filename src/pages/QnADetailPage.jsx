import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import QnADetailContent from '../components/QnADetailContent.jsx';

const QnADetailPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <QnADetailContent />
        </div>
      </div>
  );
};

export default QnADetailPage;
