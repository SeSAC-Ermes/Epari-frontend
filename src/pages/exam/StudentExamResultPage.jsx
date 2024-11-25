import React from 'react';
import StudentExamResultContent from '../../components/exam/StudentExamResultContent.jsx';

const StudentExamResultPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <StudentExamResultContent />
        </main>
      </div>
  );
};

export default StudentExamResultPage;
