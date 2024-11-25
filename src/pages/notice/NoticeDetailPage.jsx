import React from 'react';
import TopBar from '../../components/layout/TopBar';
import NoticeDetailContent from '../../components/notice/NoticeDetailContent';

const NoticeDetailPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <NoticeDetailContent/>
        </div>
      </div>
  );
};

export default NoticeDetailPage;
