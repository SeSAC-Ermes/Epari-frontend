import React from 'react';
import TopBar from '../../components/layout/TopBar';
import NoticeListContent from "../../components/notice/NoticeListContent";

const NoticeListPage = ({ type }) => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <TopBar/>
          <NoticeListContent type={type}/>
        </div>
      </div>
  );
};

export default NoticeListPage;
