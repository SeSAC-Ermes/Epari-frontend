// pages/exam/ExamPage.jsx
import React from 'react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import { ExamContainer } from '../../components/exam/ExamContainer';  // 시험 목록용 컨테이너

const ExamPage = () => {
  return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <ExamContainer />
          </main>
        </div>
      </div>
  );
};

export default ExamPage;
