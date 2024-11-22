import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {BookOpen, Calendar, ChevronUp, Clock, GraduationCap, User, Users} from 'lucide-react';
import {ExamAPI} from '../../api/exam/examAPI.js';
import {PAGE_PERMISSIONS} from '../../constants/auth';
import {RoleBasedComponent} from '../../auth/RoleBasedComponent';
import {ROLES} from '../../constants/auth';

const ExamDetail = () => {
  const {courseId, examId} = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        const data = await ExamAPI.getExam(courseId, examId);
        setExam(data);
      } catch (err) {
        setError('시험 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching exam details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetail();
  }, [courseId, examId]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"/>
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

  if (!exam) {
    return (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">
          시험 정보를 찾을 수 없습니다.
        </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // 스크롤업 함수 추가
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <ChevronUp size={24}/>
        </button>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <div className="flex gap-2">
              {/* 학생 전용: 시험 응시 버튼 */}
              <RoleBasedComponent requiredRoles={[ROLES.STUDENT]}>
                <button
                    onClick={() => navigate(`/courses/${courseId}/exams/${examId}/take`)}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  시험 응시하기
                </button>
              </RoleBasedComponent>

              {/* 강사 전용: 정답 보기, 수정 버튼 */}
              <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {showAnswers ? '정답 숨기기' : '정답 보기'}
                </button>
              </RoleBasedComponent>

              <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                <button
                    onClick={() => navigate(`/courses/${courseId}/exams/${examId}/edit`)}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  수정하기
                </button>
              </RoleBasedComponent>

              {/* 공통 버튼 */}
              <button
                  onClick={() => navigate(`/courses/${courseId}/exams`)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                목록으로
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5"/>
                <span>시험 일시: {formatDate(exam.examDateTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5"/>
                <span>출제자: {exam.instructor?.name || exam.instructorName || '정보 없음'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                  <Users className="w-5 h-5"/>
                  <span>응시 인원: {exam.statistics?.submittedStudentCount || 0}/{exam.statistics?.totalStudentCount || 0}명</span>
                </RoleBasedComponent>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5"/>
                <span>제한 시간: {exam.duration}분</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5"/>
                <span>총점: {exam.totalScore}점</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
                  <GraduationCap className="w-5 h-5"/>
                  <span>평균 점수: {exam.statistics?.averageScore ? exam.statistics.averageScore.toFixed(1) : '-'}점</span>
                </RoleBasedComponent>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">시험 설명</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{exam.description}</p>
          </div>

          {exam.questions && exam.questions.length > 0 && (
              <div className="border-t mt-6 pt-6">
                <h2 className="text-lg font-semibold mb-4">문제 목록</h2>
                <div className="space-y-4">
                  {exam.questions.map((question, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">문제 {index + 1}</span>
                          <span className="text-sm text-gray-600">배점: {question.score}점</span>
                        </div>
                        <p className="mb-2">{question.questionText}</p>
                        {question.type === 'MULTIPLE_CHOICE' && (
                            <div className="space-y-2">
                              {question.choices?.map((choice, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`text-sm p-2 rounded ${
                                            showAnswers && parseInt(question.correctAnswer) === choice.number
                                                ? 'bg-green-100 text-green-800'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                      {choice.number}. {choice.choiceText}
                                      {showAnswers && parseInt(question.correctAnswer) === choice.number && (
                                          <span className="ml-2 font-medium">(정답)</span>
                                      )}
                                    </div>
                                );
                              })}
                            </div>
                        )}
                        {question.type === 'SUBJECTIVE' && showAnswers && (
                            <div className="mt-3">
                              <div className="text-sm font-medium text-gray-700">정답</div>
                              <div className="mt-1 p-2 bg-green-100 text-green-800 rounded">
                                {question.correctAnswer}
                              </div>
                            </div>
                        )}
                        {showAnswers && question.explanation && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-sm font-medium text-gray-700">해설</div>
                              <div className="mt-1 text-sm text-gray-600">
                                {question.explanation}
                              </div>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ExamDetail;
