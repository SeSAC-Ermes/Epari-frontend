import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamListItem = ({ exam, courseId }) => {
  const navigate = useNavigate();

  const handleExamClick = () => {
    navigate(`/courses/${courseId}/exams/${exam.id}`);
  };

  const handleScoreClick = (e) => {
    e.stopPropagation();
    navigate(`/courses/${courseId}/exams/${exam.id}/results`);
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
            점수 확인
          </button>
        </td>
      </tr>
  );
};

export default ExamListItem;
