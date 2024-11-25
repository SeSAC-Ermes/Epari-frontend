import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ExamAPI } from '../../api/exam/examAPI.js';
import debounce from 'lodash/debounce';

const ExamSubmission = () => {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // 디바운스된 답안 저장 함수
  const debouncedSaveAnswer = useCallback(
      debounce(async (questionId, answer) => {
        try {
          setSaving(true);
          await ExamAPI.submitAnswer(courseId, examId, questionId, { answer });
          setSavedAnswers(prev => ({ ...prev, [questionId]: answer }));
        } catch (err) {
          console.error('답안 저장 실패:', err);
        } finally {
          setSaving(false);
        }
      }, 500),
      [courseId, examId]
  );

  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        const examData = await ExamAPI.getExam(courseId, examId);
        setExam(examData);
        setIsStarted(false);

        try {
          const statusData = await ExamAPI.getSubmissionStatus(courseId, examId);
          if (statusData && statusData.startTime) {
            console.log('시험이 이미 시작됨:', statusData);
            setSubmissionStatus(statusData);
            setRemainingTime(statusData.remainingTimeInMinutes);
            setIsStarted(true);

            if (statusData.answers) {
              setLocalAnswers(statusData.answers);
              setSavedAnswers(statusData.answers);
            }
          } else {
            console.log('시험 시작 전 상태');
            setSubmissionStatus(null);
            setIsStarted(false);
          }
        } catch (statusErr) {
          if (statusErr.response?.status === 404) {
            console.log('시험 시작 전 상태 (404)');
            setSubmissionStatus(null);
            setIsStarted(false);
          } else {
            throw statusErr;
          }
        }

        setInitialized(true);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || '시험 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [courseId, examId]);

  useEffect(() => {
    if (!remainingTime || !initialized) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [remainingTime, initialized]);

  // 컴포넌트 언마운트 시 저장되지 않은 답안 처리
  useEffect(() => {
    return () => {
      debouncedSaveAnswer.flush();
    };
  }, [debouncedSaveAnswer]);

  const handleAnswerChange = async (questionId, answer) => {
    // 즉시 로컬 상태 업데이트
    setLocalAnswers(prev => ({ ...prev, [questionId]: answer }));

    // 디바운스된 저장 함수 호출
    debouncedSaveAnswer(questionId, answer);
  };

  const handleStartExam = async () => {
    try {
      const status = await ExamAPI.startExam(courseId, examId);
      setSubmissionStatus(status);
      setRemainingTime(status.remainingTimeInMinutes);
      setIsStarted(true);
    } catch (err) {
      setError('시험을 시작하는데 실패했습니다.');
    }
  };

  const handleFinishExam = async (isTimeOut = false) => {
    try {
      if (!isTimeOut) {
        // 모든 문제 답변 확인
        const unansweredQuestions = exam.questions.filter(
            q => !localAnswers[q.id]
        );

        if (unansweredQuestions.length > 0) {
          if (!window.confirm(
              `아직 ${unansweredQuestions.length}개의 문제에 답하지 않았습니다. 정말 제출하시겠습니까?`
          )) {
            return;
          }
        } else {
          if (!window.confirm('시험을 제출하시겠습니까?')) {
            return;
          }
        }
      }

      // 저장되지 않은 답안이 있다면 먼저 저장
      debouncedSaveAnswer.flush();

      // 시험 제출
      await ExamAPI.finishExam(courseId, examId);

      // 성공적으로 제출된 경우 결과 페이지로 이동
      navigate(`/courses/${courseId}/exams/${examId}/result`);

    } catch (err) {
      console.error('시험 제출 실패:', err);
      setError('시험 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleQuestionNavigation = (direction) => {
    if (direction === 'next' && currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const renderAnswerInput = (question) => {
    if (!question) return null;

    if (question.type === 'MULTIPLE_CHOICE') {
      return (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
                <label
                    key={choice.number}
                    className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={choice.number}
                      checked={localAnswers[question.id] === choice.number.toString()}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-700">{choice.choiceText}</span>
                </label>
            ))}
          </div>
      );
    }

    return (
        <div className="relative">
        <textarea
            value={localAnswers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            onBlur={(e) => {
              // blur 시 강제 저장 실행
              debouncedSaveAnswer.flush();
            }}
            className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="답안을 입력하세요"
        />
          {saving && (
              <div className="absolute top-2 right-2 text-sm text-gray-500">
                저장 중...
              </div>
          )}
        </div>
    );
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
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
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

  if (!isStarted) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">{exam?.title}</h1>
            <p className="text-gray-600 mb-6">{exam?.description}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h2 className="font-medium text-yellow-800 mb-2">시험 응시 전 주의사항</h2>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>시험 시작 후에는 중간에 나갈 수 없습니다.</li>
                <li>모든 문제에 답변해야 제출이 가능합니다.</li>
                <li>제한 시간이 종료되면 자동으로 제출됩니다.</li>
                <li>부정행위가 적발될 경우 0점 처리됩니다.</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <button
                  onClick={handleStartExam}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                시험 시작하기
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>남은 시간: {Math.floor(remainingTime / 60)}시간 {remainingTime % 60}분</span>
            </div>
          </div>
          <p className="text-gray-600">{exam.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              문제 {currentQuestion + 1} / {exam.questions.length}
            </h2>
            <div className="text-sm text-gray-500">
              배점: {exam.questions[currentQuestion]?.score}점
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-800 mb-6">{exam.questions[currentQuestion]?.questionText}</p>
            {renderAnswerInput(exam.questions[currentQuestion])}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
                onClick={() => handleQuestionNavigation('prev')}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              이전 문제
            </button>

            {currentQuestion === exam.questions.length - 1 ? (
                <button
                    onClick={() => handleFinishExam()}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  시험 종료
                </button>
            ) : (
                <button
                    onClick={() => handleQuestionNavigation('next')}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
                >
                  다음 문제
                  <ChevronRight size={20} />
                </button>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">문제 목록</h3>
          <div className="grid grid-cols-8 gap-2">
            {exam.questions.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`p-2 text-sm rounded-lg ${
                        currentQuestion === index
                            ? 'bg-green-500 text-white'
                            : localAnswers[exam.questions[index].id]
                                ? 'bg-green-50 text-green-600'
                                : 'bg-gray-50 text-gray-600'
                    }`}
                >
                  {index + 1}
                </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ExamSubmission;
