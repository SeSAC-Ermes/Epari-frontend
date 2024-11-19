// import React from 'react';
// import NoticeContent from "../../components/notice/NoticeContent.jsx";
//
//
// const NoticeListPage = () => {
//   return (
//       <NoticeContent/>
//   );
// };
//
// export default NoticeListPage;

// import NoticeListContent from "../../components/notice/NoticeListContent";
//
// const NoticeListPage = ({ type }) => {
//   return <NoticeListContent type={type} />;
// };
//
// export default NoticeListPage;

import React from 'react';
import TopBar from '../../components/layout/TopBar';
import NoticeListContent from "../../components/notice/NoticeListContent";

const NoticeListPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1">
          <TopBar />
          <NoticeListContent type="GLOBAL" />
        </div>
      </div>
  );
};

export default NoticeListPage;
