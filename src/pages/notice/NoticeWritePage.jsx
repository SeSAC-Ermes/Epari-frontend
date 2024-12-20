import React from 'react';
import NoticeWriteContent from "../../components/notice/NoticeWriteContent.jsx";
import { withPageAuth } from "../../auth/WithAuth.jsx";

const NoticeWritePage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <NoticeWriteContent/>
        </div>
      </div>
  );
};

export default withPageAuth(NoticeWritePage, 'CREATE_NOTICE_COURSE');
