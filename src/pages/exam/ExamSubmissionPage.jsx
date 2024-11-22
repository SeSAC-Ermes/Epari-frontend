import React from 'react';
import ExamSubmission from '../../components/exam/ExamSubmission';
import { withPageAuth } from '../../auth/WithAuth.jsx';

const ExamSubmissionPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow">
              <ExamSubmission/>
            </div>
          </div>
        </main>
      </div>
  );
};

export default withPageAuth(ExamSubmissionPage, 'EXAM_TAKE')
