import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';

/**
 * 과제 상세페이지 컴포넌트 Sidebar 컴포넌트와 구성해 AssignmentPage에 구현
 */

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const {courseId} = useParams();

  const assignments = [
    {
      id: 1,
      title: '[AWS] 리액트 - 스토리북 - MySQL 새싹 북스 과제',
      status: '윤지수',
      date: '2024.11.30'
    },
    {
      id: 2,
      title: '[Docker] 리액트와 및 지하철 알림 등 5개 지난 과제들 수정',
      status: '윤지수',
      date: '2024.11.23'
    },
    {
      id: 3,
      title: '[Quiz] AWS 시험',
      status: '윤지수',
      date: '2024.10.15'
    }
  ];

  const handleCreateClick = () => {
    navigate(`/courses/${courseId}/assignments/create`);
  };

  return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">시험 및 과제</h1>
            <button
                onClick={handleCreateClick}
                className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              + 새로 올리기
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-20">No.</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">제목</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">작성자</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-32">날짜</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map((assignment) => (
                    <tr
                        key={assignment.id}
                        className="hover:bg-gray-50 border-b border-gray-200 last:border-0 cursor-pointer"
                        onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{assignment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{assignment.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{assignment.status}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{assignment.date}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AssignmentDetail;
