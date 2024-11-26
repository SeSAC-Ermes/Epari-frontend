import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext.jsx';
import { ROLES } from '../../../constants/auth.js';

const ExamListItem = ({ exam, courseId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExamClick = () => {
    navigate(`/courses/${courseId}/exams/${exam.id}`);
  };

  const handleScoreClick = (e) => {
    e.stopPropagation();

    console.log("Current user roles:", user?.roles); // 디버깅용 로그

    // 강사/학생 구분해서 다른 경로로 이동
    if (user && user.roles?.includes(ROLES.INSTRUCTOR)) {
      console.log("Navigating to instructor results");
      navigate(`/courses/${courseId}/exams/${exam.id}/results`);
    } else {
      console.log("Navigating to student result");
      navigate(`/courses/${courseId}/exams/${exam.id}/result`);
    }
  };

  return (
      <tr className="hover:bg-gray-50">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{exam.id}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.createdAt}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
          <button
              type="button"
              onClick={handleExamClick}
              className="font-medium hover:text-blue-600 hover:underline cursor-pointer transition-colors focus:outline-none focus:text-blue-700"
          >
            {exam.title}
          </button>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.instructor}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.examDateTime}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {exam.submissionCount}/{exam.totalStudents}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.averageScore || '-'}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <button
              type="button"
              onClick={handleScoreClick}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:text-blue-900"
          >
            {/* 버튼 텍스트도 역할에 따라 다르게 표시 */}
            {user && user.roles?.includes(ROLES.INSTRUCTOR) ? '전체 결과' : '내 점수'}
          </button>
        </td>
      </tr>
  );
};

export default ExamListItem;
