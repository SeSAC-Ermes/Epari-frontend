import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import NoticeContent from '../components/NoticeContent.jsx';

const NoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <NoticeContent />
        </div>
      </div>
  );
};

export default NoticeListPage;
