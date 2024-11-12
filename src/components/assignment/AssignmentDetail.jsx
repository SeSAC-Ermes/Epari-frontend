// AssignmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssignmentAPI } from "../../api/assignment/AssignmentApi.js";

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await AssignmentAPI.getAssignments(courseId);
      setAssignments(data);
    } catch (err) {
      setError('과제 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const handleCreateClick = () => {
    navigate(`/courses/${courseId}/assignments/create`);
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-lg">{error}</p>
            <button
                onClick={fetchAssignments}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              다시 시도
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">과제</h1>
            <button
                onClick={handleCreateClick}
                className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              + 과제 출제하기
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-16">No.</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">제목</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-32">작성자</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-48">제출기한</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length > 0 ? (
                      assignments.map((assignment, index) => (
                          <tr
                              key={assignment.id}
                              className="hover:bg-gray-50 border-b border-gray-200 last:border-0 cursor-pointer"
                              onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                          >
                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {assignment.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {assignment.writer}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(assignment.deadline)}
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          등록된 과제가 없습니다.
                        </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AssignmentDetail;
