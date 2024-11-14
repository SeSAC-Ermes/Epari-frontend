import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import { ExamCreateContainer } from '../../components/exam/ExamCreateContainer';

const ExamCreatePage = () => {
  return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <ExamCreateContainer />
          </main>
        </div>
      </div>
  );
};

export default ExamCreatePage;
