import React from 'react';
import ExamDetail from '../../components/exam/ExamDetail';

const ExamDetailPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <ExamDetail/>
        </main>
      </div>
  );
};

export default ExamDetailPage;
