import React from 'react';
import TabButton from "./TabButton.jsx";

/**
 * 공지사항의 탭 네비게이션 컴포넌트
 * 일반 공지사항과 강의 공지사항 탭을 전환하는 UI 제공
 */

const NoticeTabs = ({ activeTab, setActiveTab }) => {
  return (
      <div className="flex gap-6 mb-6 border-b">
        <TabButton
            isActive={activeTab === 'notice'}
            onClick={() => setActiveTab('notice')}
        >
          공지사항
        </TabButton>
        <TabButton
            isActive={activeTab === 'courseNotice'}
            onClick={() => setActiveTab('courseNotice')}
        >
          강의 공지사항
        </TabButton>
      </div>
  );
};

export default NoticeTabs;
