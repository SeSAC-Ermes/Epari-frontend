import React from 'react';
import { ExamContainer } from '../../components/exam/ExamContainer';

const ExamPage = () => {
  return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <ExamContainer/>
          </main>
        </div>
      </div>
  );
};

export default ExamPage;
