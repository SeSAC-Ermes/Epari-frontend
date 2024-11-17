import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import LectureNoticeContent from '../components/LectureNoticeContent.jsx';

const LectureNoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <LectureNoticeContent />
        </div>
      </div>
  );
};

export default LectureNoticeListPage;