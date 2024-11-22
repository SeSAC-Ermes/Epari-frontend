import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamAPI } from '../../../api/exam/examAPI';
import { formatDate, getAssignmentStatus } from "../../../utils/DateUtils.js";
import { AssignmentAPI } from "../../../api/assignment/AssignmentApi.js";
import { SubmissionApi } from "../../../api/assignment/SubmissionApi.js";
import { useAuth } from "../../assignment/hooks/useAssignment.js";

const ExamAssignmentSection = ({ courseId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('exam');
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [examResponse, setExamResponse] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();
  const { getIsInstructorFromToken } = useAuth();

  const fetchSubmissionStatus = async (assignmentId) => {
    if (isInstructor) return; // 강사는 제출 상태를 확인할 필요 없음

    try {
      const submission = await SubmissionApi.getSubmissionById(courseId, assignmentId);
      if (submission) {
        setSubmissions(prev => ({
          ...prev,
          [assignmentId]: submission
        }));
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  useEffect(() => {
    const instructorStatus = getIsInstructorFromToken();
    setIsInstructor(instructorStatus);
  }, [getIsInstructorFromToken]);

  useEffect(() => {
    const fetchExams = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const response = await ExamAPI.getExams(courseId);
          setExamResponse(response);

          const allExams = [
            ...(response.scheduledExams || []),
            ...(response.inProgressExams || []),
            ...(response.completedExams || [])
          ];

          const sortedExams = allExams
              .sort((a, b) => new Date(a.examDateTime) - new Date(b.examDateTime))
              .slice(0, 2)
              .map(exam => ({
                id: exam.id,
                title: exam.title,
                writer: exam.instructor?.name || '-',
                examDateTime: exam.examDateTime,
                duration: exam.duration
              }));

          setExams(sortedExams);
        } catch (error) {
          console.error('Error fetching exams:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchAssignments = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const response = await AssignmentAPI.getAssignments(courseId);
          const recentAssignments = response
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 2);
          setAssignments(recentAssignments);

          for (const assignment of recentAssignments) {
            await fetchSubmissionStatus(assignment.id);
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (activeTab === 'exam') {
      fetchExams();
    } else {
      fetchAssignments();
    }
  }, [courseId, activeTab]);

  const getExamStatusStyle = (status) => {
    switch (status) {
      case '진행중':
        return 'bg-blue-100 text-blue-700';
      case '완료':
        return 'bg-gray-100 text-gray-700';
      case '예정':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getExamStatus = (exam) => {
    if (!examResponse) return '-';

    if (examResponse.scheduledExams?.some(e => e.id === exam.id)) {
      return '예정';
    }
    if (examResponse.inProgressExams?.some(e => e.id === exam.id)) {
      return '진행중';
    }
    if (examResponse.completedExams?.some(e => e.id === exam.id)) {
      return '완료';
    }
    return '-';
  };

  const getSubmissionStatusStyle = (status) => {
    switch (status) {
      case '제출완료':
        return 'bg-blue-100 text-blue-700';
      case '채점완료':
        return 'bg-green-100 text-green-700';
      case '미제출':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubmissionStatusText = (status) => status || '미제출';

  const handleViewAll = () => {
    onNavigate(activeTab);
  };

  const handleAssignmentClick = (assignmentId) => {
    if (isInstructor) {
      navigate(`/courses/${courseId}/assignments/${assignmentId}/submissions`);
    } else {
      navigate(`/courses/${courseId}/assignments/${assignmentId}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
      );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">No.</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">작성자</th>
                {activeTab === 'exam' ? (
                    <>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">시험 응시 일자</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제한 시간</th>
                    </>
                ) : (
                    <>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">등록일</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">마감일</th>
                    </>
                )}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'exam' ? (
                  exams.map((exam, index) => (
                      <tr key={exam.id} className="hover:bg-gray-50 border-b border-gray-200 last:border-0">
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4">
                          <button
                              onClick={() => navigate(`/courses/${courseId}/exams/${exam.id}`)}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                          >
                            {exam.title}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{exam.writer}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(exam.examDateTime)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{exam.duration}분</td>
                        <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamStatusStyle(getExamStatus(exam))}`}>
                      {getExamStatus(exam)}
                    </span>
                        </td>
                      </tr>
                  ))
              ) : (
                  assignments.map((assignment, index) => (
                      <tr key={assignment.id} className="hover:bg-gray-50 border-b border-gray-200 last:border-0">
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4">
                          <button
                              onClick={() => handleAssignmentClick(assignment.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                          >
                            {assignment.title}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{assignment.instructor?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(assignment.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{formatDate(assignment.deadline)}</div>
                        </td>
                        <td className="px-6 py-4">
                          {isInstructor ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatus(assignment.deadline).class}`}>
                        {getAssignmentStatus(assignment.deadline).text}
                      </span>
                          ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubmissionStatusStyle(submissions[assignment.id]?.status)}`}>
                        {getSubmissionStatusText(submissions[assignment.id]?.status)}
                      </span>
                          )}
                        </td>
                      </tr>
                  ))
              )}
            </tbody>
          </table>

          {activeTab === 'exam' && exams.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 시험이 없습니다.
              </div>
          )}
          {activeTab === 'assignment' && assignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                등록된 과제가 없습니다.
              </div>
          )}
        </div>
    );
  };

  return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-6 mb-6 border-b">
          <button
              onClick={() => setActiveTab('exam')}
              className={`pb-2 font-medium ${
                  activeTab === 'exam'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            시험
          </button>
          <button
              onClick={() => setActiveTab('assignment')}
              className={`pb-2 font-medium ${
                  activeTab === 'assignment'
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-400'
              }`}
          >
            과제
          </button>
          <div className="flex-1"></div>
          <button
              onClick={handleViewAll}
              className="text-sm text-green-600 hover:underline"
          >
            전체보기
          </button>
        </div>

        {renderContent()}
      </div>
  );
};

export default ExamAssignmentSection;
