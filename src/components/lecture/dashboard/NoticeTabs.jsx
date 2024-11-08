import React from 'react';
import TabButton from "./TabButton.jsx";

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
