import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamAPI } from '../../api/exam/examAPI.js';
import { ChevronUp } from 'lucide-react';

const StudentExamResultContent = () => {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultData, examData] = await Promise.all([
          ExamAPI.getExamResult(courseId, examId),
          ExamAPI.getExam(courseId, examId)
        ]);
        setExamResult(resultData);
        setExam(examData);
      } catch (err) {
        console.error('Error:', err);
        setError('시험 결과를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, examId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <ChevronUp size={24}/>
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">시험 결과: {exam?.title}</h2>
            <button
                onClick={() => navigate(`/courses/${courseId}/exams`)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              목록으로
            </button>
          </div>

          {/* 점수 요약 */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">총점</div>
                <div className="text-3xl font-bold text-green-600">
                  {examResult?.totalScore}
                  <span className="text-lg text-gray-600 ml-1">/ {exam?.totalScore}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">제출 시간</div>
                <div className="text-lg text-gray-800">
                  {examResult?.endTime ? new Date(examResult.endTime).toLocaleString() : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* 문제별 결과 */}
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">문제별 채점 결과</h3>
            <div className="space-y-6">
              {examResult?.questionResults?.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-medium">문제 {index + 1}</div>
                      <div className="text-sm">
                    <span className={question.earnedScore === question.score ?
                        'text-green-600 font-medium' :
                        'text-red-600 font-medium'}>
                      {question.earnedScore}
                    </span>
                        <span className="text-gray-500">
                      / {question.score}점
                    </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">문제</div>
                      <div className="text-gray-900">{question.questionTitle}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">내 답안</div>
                        <div className={`p-3 rounded-lg ${
                            question.earnedScore === question.score ?
                                'bg-green-50 text-green-800' :
                                'bg-red-50 text-red-800'
                        }`}>
                          {question.type === 'MULTIPLE_CHOICE' ?
                              `${question.studentAnswer}번` :
                              question.studentAnswer || '답안 없음'}
                        </div>
                      </div>
                      {question.type === 'MULTIPLE_CHOICE' && (
                          <div>
                            <div className="text-sm text-gray-600 mb-2">정답</div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              {question.correctAnswer}번
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentExamResultContent;
