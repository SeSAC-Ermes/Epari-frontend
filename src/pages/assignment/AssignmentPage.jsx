import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import AssignmentDetail from '../../components/Assignment/AssignmentDetail.jsx';
import TopBar from "../../components/layout/TopBar.jsx";

/**
 * 과제 상세페이지
 */
const AssignmentPage = () => {
  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <AssignmentDetail />
        </div>
      </div>
  );
};

export default AssignmentPage;
