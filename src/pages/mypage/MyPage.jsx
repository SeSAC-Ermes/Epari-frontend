import React from 'react';
import MyPageContent from "../../components/mypage/MyPageContent.jsx";

const MyPage = () => {
  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-10">마이페이지</h1>
        <MyPageContent/>
      </div>
  );
};

export default MyPage;
