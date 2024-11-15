import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExamListItem = ({ exam, courseId }) => {
  const navigate = useNavigate();

  return (
      <tr className="hover:bg-gray-50">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{exam.id}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.createdAt}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{exam.title}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.instructor}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.examDateTime}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.submissionCount}/{exam.totalStudents}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{exam.averageScore || '-'}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${courseId}/exams/${exam.id}/scores`);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
          >
            점수 확인
          </button>
        </td>
      </tr>
  );
};

export default ExamListItem;
