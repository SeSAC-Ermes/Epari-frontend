import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../constants/auth';
import ExamResult from '../components/exam/ExamResult';
import { ExamGradingList } from '../components/exam/ExamGradingList';

const ExamResultPage = () => {
  const { user } = useAuth();
  const isInstructor = user?.roles?.includes(ROLES.INSTRUCTOR);

  return (
      <div className="min-h-screen bg-gray-50">
        {isInstructor ? <ExamGradingList /> : <ExamResult />}
      </div>
  );
};


export default ExamResultPage;
