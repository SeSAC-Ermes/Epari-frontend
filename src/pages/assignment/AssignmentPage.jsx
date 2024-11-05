import React from 'react';
import Sidebar from '../../components/Sidebar';
import AssignmentDetail from '../../components/Assignment/AssignmentDetail.jsx';

/*
  SideBar + AssignmentDetail로 구성된 과제 상세페이지
 */

const AssignmentPage = () => {
  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar/>
        <AssignmentDetail/>
      </div>
  );
};

export default AssignmentPage;
