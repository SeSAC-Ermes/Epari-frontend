import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import QnAContent from '../components/QnAContent.jsx';

const QnAListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <QnAContent />
        </div>
      </div>
  );
};

export default QnAListPage;
