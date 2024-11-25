import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { PAGE_PERMISSIONS, ROLES } from '../../constants/auth'; // PAGE_PERMISSIONS import 추가
import { ExamGradingList } from '../../components/exam/grading/ExamGradingList.jsx';
import { Navigate, useParams } from 'react-router-dom';
import { withPageAuth } from '../../auth/WithAuth.jsx';

const ExamGradingListPage = () => {
  const { user } = useAuth();
  const { courseId, examId } = useParams();
  const isInstructor = user?.roles?.includes(ROLES.INSTRUCTOR);

  if (!isInstructor) {
    return <Navigate to={`/courses/${courseId}/exams/${examId}/result`} replace />;
  }

  return <ExamGradingList />;
};

// 문자열이 아닌 실제 권한 상수 사용
export default withPageAuth(ExamGradingListPage, PAGE_PERMISSIONS.EXAM_GRADING);
