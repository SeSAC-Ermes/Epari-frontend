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

import NoticeListContent from "../../components/notice/NoticeListContent";

const NoticeListPage = ({ type }) => {
  return <NoticeListContent type={type} />;
};

export default NoticeListPage;
