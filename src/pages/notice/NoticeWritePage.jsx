import React from 'react';
import TopBar from '../../components/layout/TopBar';
import NoticeWriteContent from "../../components/notice/NoticeWriteContent.jsx";
import { useAuth } from '../../auth/AuthContext';
import { withPageAuth } from "../../auth/WithAuth.jsx";

const NoticeWritePage = () => {

  return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <TopBar/>
          <NoticeWriteContent type="COURSE"/>
        </div>
      </div>
  );
};

export default withPageAuth(NoticeWritePage, 'CREATE_NOTICE_COURSE');
