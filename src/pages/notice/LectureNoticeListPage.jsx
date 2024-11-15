import React from 'react';
import TopBar from '../../components/layout/TopBar.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';
import LectureNoticeListContent from '../../components/notice/LectureNoticeListContent.jsx';

const LectureNoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <LectureNoticeListContent />
        </div>
      </div>
  );
};

export default LectureNoticeListPage;
