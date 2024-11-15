import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import NoticeListContent from '../../components/notice/NoticeListContent';

const NoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <NoticeListContent />
        </div>
      </div>
  );
};

export default NoticeListPage;
