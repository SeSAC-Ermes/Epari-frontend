import React from 'react';
import Sidebar from '../../components/Sidebar';
import AssignmentContent from '../../components/AssignmentContent.jsx';

const AssignmentPage = () => {
  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <AssignmentContent />
      </div>
  );
};

export default AssignmentPage;
