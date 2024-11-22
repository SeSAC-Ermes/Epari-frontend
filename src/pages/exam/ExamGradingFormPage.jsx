import React from 'react';
import { ExamGradingForm } from '../../components/exam/ExamGradingForm';

const ExamGradingFormPage = () => {
  return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <ExamGradingForm/>
          </main>
        </div>
      </div>
  );
};

export default ExamGradingFormPage;
