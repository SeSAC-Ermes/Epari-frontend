import React from 'react';
import ExamEdit from '../../components/exam/ExamEdit';
import {withPageAuth} from '../../auth/WithAuth.jsx';

const ExamEditPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <ExamEdit/>
        </main>
      </div>
  );
}

export default withPageAuth(ExamEditPage, 'ROLES.INSTRUCTOR');
