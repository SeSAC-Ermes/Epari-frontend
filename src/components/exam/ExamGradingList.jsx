import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamAPI } from '../../api/exam/examAPI.js';
import { ROLES } from '../../constants/auth';
import { RoleBasedComponent } from '../../auth/RoleBasedComponent';

export const ExamGradingList = () => {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [statistics, setStatistics] = useState({
    totalStudentCount: 0,
    submittedStudentCount: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await ExamAPI.getGradingList(courseId, examId);
        console.log('Submissions data:', data);

        const submissionsWithId = data.map(submission => {
          const resultId = submission.id;
          if (!resultId) {
            console.warn('Missing id for submission:', submission);
          }
          return {
            ...submission,
            examResultId: resultId
          };
        });

        setSubmissions(submissionsWithId || []);

        const submittedCount = submissionsWithId.filter(
            s => s.status === 'SUBMITTED' || s.status === 'GRADED'
        ).length;

        const totalScore = submissionsWithId.reduce(
            (sum, s) => sum + (s.totalScore || 0),
            0
        );

        const avgScore = submittedCount > 0 ? totalScore / submittedCount : 0;

        setStatistics({
          totalStudentCount: submissionsWithId.length,
          submittedStudentCount: submittedCount,
          averageScore: avgScore
        });

      } catch (err) {
        console.error('Error details:', err.response?.data);
        setError('제출 목록을 불러오는데 실패했습니다.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && examId) {
      fetchSubmissions();
    }
  }, [courseId, examId]);

  const fetchSubmissionDetails = async (submissionId) => {
    try {
      if (!submissionId) {
        console.error('No submission ID provided');
        return;
      }
      console.log('Fetching details for submission:', {
        courseId,
        examId,
        submissionId,
      });
      // 학생의 시험 결과 상세 정보 조회
      const details = await ExamAPI.getStudentSubmission(courseId, examId, submissionId);
      console.log('Received submission details:', details);
      if (details) {
        setSubmissionDetails(details);
      } else {
        console.error('No details returned for submission');
      }
    } catch (err) {
      console.error('Error fetching submission details:', err);
      if (err.response) {
        console.log('Error response:', err.response.data);
      }
      alert('답안 상세 정보를 불러오는데 실패했습니다.');
      setExpandedSubmission(null);
      setSubmissionDetails(null);
    }
  };

  const handleStudentClick = async (submission) => {
    try {
      console.log('Clicked submission:', submission);  // 클릭된 submission 데이터 확인
      if (expandedSubmission === submission.examResultId) {
        setExpandedSubmission(null);
        setSubmissionDetails(null);
      } else {
        setExpandedSubmission(submission.examResultId);
        await fetchSubmissionDetails(submission.examResultId);
      }
    } catch (err) {
      console.error('Error in handleStudentClick:', err);
    }
  };

  const handleGrading = async (submission) => {
    if (!submission.examResultId) {
      alert('채점할 수 없습니다. 시험 결과 ID가 없습니다.');
      return;
    }

    try {
      await ExamAPI.submitGrading(courseId, examId, submission.examResultId);
      alert('채점이 완료되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Grading failed:', error);
      alert('채점에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
          <div className="bg-white rounded-lg shadow-sm">
            {/* 헤더 섹션 */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">시험 제출 현황</h2>
            </div>

            {/* 통계 섹션 */}
            <div className="p-6 grid grid-cols-3 gap-4 bg-gray-50">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">전체 학생</div>
                <div className="text-2xl font-semibold">{statistics.totalStudentCount}명</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">제출 완료</div>
                <div className="text-2xl font-semibold">{statistics.submittedStudentCount}명</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">평균 점수</div>
                <div className="text-2xl font-semibold">{statistics.averageScore.toFixed(1)}점</div>
              </div>
            </div>

            {/* 테이블 섹션 */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    학생 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제출 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    채점
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length > 0 ? (
                    submissions.map((submission, index) => (
                        <React.Fragment key={submission.examResultId || index}>
                          {/* 학생 정보 행 */}
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <button
                                  onClick={() => handleStudentClick(submission)}
                                  className="text-left hover:text-blue-600 focus:outline-none flex items-center"
                              >
                                {submission.studentName}
                                <span className="ml-2">
                            {expandedSubmission === submission.examResultId ? '▼' : '▶'}
                          </span>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {submission.studentEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${submission.status === 'GRADED' ? 'bg-green-100 text-green-800'
                            : submission.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'}`}
                        >
                          {submission.status === 'GRADED' ? '채점 완료'
                              : submission.status === 'SUBMITTED' ? '채점 대기'
                                  : submission.status === 'IN_PROGRESS' ? '진행 중'
                                      : '미제출'}
                        </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.totalScore !== null ? `${submission.totalScore}점` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                  onClick={() => handleGrading(submission)}
                                  className={`font-medium ${
                                      submission.status === 'GRADED' || submission.status === 'IN_PROGRESS'
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-blue-600 hover:text-blue-900'
                                  }`}
                                  disabled={submission.status === 'GRADED' || submission.status === 'IN_PROGRESS'}
                              >
                                {submission.status === 'GRADED' ? '채점 완료' : '채점하기'}
                              </button>
                            </td>
                          </tr>

                          {/* 답안 상세 정보 행 */}
                          {expandedSubmission === submission.examResultId && submissionDetails && (
                              <tr>
                                <td colSpan="6" className="px-6 py-4">
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-4">제출한 답안</h4>
                                    {submissionDetails.questionResults?.map((question, idx) => (
                                        <div key={idx} className="mb-6 border-b pb-4 last:border-b-0">
                                          {/* 문제 헤더 */}
                                          <div className="flex justify-between mb-2">
                                            <span className="font-medium">문제 {idx + 1}</span>
                                            <span className="text-gray-600">배점: {question.score}점</span>
                                          </div>

                                          {/* 문제 내용 */}
                                          <div className="mb-4">
                                            <p className="text-gray-700 mb-2">{question.questionText}</p>
                                          </div>

                                          {/* 답안 비교 */}
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded border">
                                              <p className="text-sm font-medium text-gray-600 mb-2">정답</p>
                                              <p className="text-gray-900">
                                                {question.type === 'MULTIPLE_CHOICE'
                                                    ? `${question.correctAnswer}번`
                                                    : question.correctAnswer
                                                }
                                              </p>
                                            </div>
                                            <div className="bg-white p-3 rounded border">
                                              <p className="text-sm font-medium text-gray-600 mb-2">학생 답안</p>
                                              <p className={`text-gray-900 ${
                                                  question.correctAnswer === question.studentAnswer
                                                      ? 'text-green-600'
                                                      : 'text-red-600'
                                              }`}>
                                                {question.type === 'MULTIPLE_CHOICE'
                                                    ? `${question.studentAnswer}번`
                                                    : question.studentAnswer
                                                }
                                              </p>
                                            </div>
                                          </div>

                                          {/* 점수 표시 */}
                                          <div className="mt-2 text-right">
                            <span className="text-sm text-gray-600">
                                획득 점수: {question.earnedScore} / {question.score}점
                            </span>
                                          </div>
                                        </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                          )}
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        {error || '제출된 시험이 없습니다.'}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </RoleBasedComponent>
      </div>
  );
};

export default ExamGradingList;
