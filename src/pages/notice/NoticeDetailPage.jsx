import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import NoticeDetailContent from '../../components/notice/NoticeDetailContent';

const NoticeDetailPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar/>
        <div className="flex-1">
          <TopBar/>
          <NoticeDetailContent/>
        </div>
      </div>
  );
};

export default NoticeDetailPage;
