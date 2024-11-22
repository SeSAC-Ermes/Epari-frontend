import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AlertCircle, Clock} from 'lucide-react';
import {ExamAPI} from '../../api/exam/examAPI.js';

const ExamSubmission = () => {
  const {courseId, examId} = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 시험 정보 및 상태 로드
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        const examData = await ExamAPI.getExam(courseId, examId);
        setExam(examData);

        // 시험 상태도 함께 확인
        try {
          const statusData = await ExamAPI.getSubmissionStatus(courseId, examId);
          setSubmissionStatus(statusData);
          setRemainingTime(statusData.remainingTimeInMinutes);
        } catch (statusError) {
          // 상태 조회 실패는 무시 (아직 시험을 시작하지 않은 경우)
          console.log('No existing submission found');
        }
      } catch (err) {
        setError(err.message || '시험 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [courseId, examId]);


  // 남은 시간 카운트다운
  useEffect(() => {
    if (!remainingTime) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, [remainingTime]);

  // 시험 시작
  const handleStartExam = async () => {
    try {
      setLoading(true);
      const status = await ExamAPI.startExam(courseId, examId);
      setSubmissionStatus(status);
      setRemainingTime(status.remainingTimeInMinutes);
    } catch (err) {
      setError('시험을 시작하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 답안 저장
  const handleSaveAnswer = async (questionId, answer, isTemporary = true) => {
    try {
      const answerData = {
        answer: answer
      };

      if (isTemporary) {
        await ExamAPI.saveAnswerTemporarily(courseId, examId, questionId, answerData);
      } else {
        await ExamAPI.submitAnswer(courseId, examId, questionId, answerData);
      }

      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    } catch (err) {
      setError('답안 저장에 실패했습니다.');
    }
  };

  // 시험 종료
  const handleFinishExam = async (force = false) => {
    if (!force && !window.confirm('시험을 종료하시겠습니까?')) {
      return;
    }

    try {
      await ExamAPI.finishExam(courseId, examId, force);
      navigate(`/courses/${courseId}/exams/${examId}/result`);
    } catch (err) {
      setError('시험 종료에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"/>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20}/>
          <span>{error}</span>
        </div>
    );
  }

  if (!submissionStatus) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h1 className="text-2xl font-bold mb-4">{exam?.title}</h1>
            <div className="space-y-4 mb-8">
              <p className="text-gray-600">{exam?.description}</p>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">제한 시간:</span>
                    <span className="ml-2">{exam?.duration}분</span>
                  </div>
                  <div>
                    <span className="text-gray-500">총점:</span>
                    <span className="ml-2">{exam?.totalScore}점</span>
                  </div>
                  <div>
                    <span className="text-gray-500">문제 수:</span>
                    <span className="ml-2">{exam?.questions?.length}문제</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                <h3 className="font-medium mb-2">시험 응시 주의사항</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>시험 시작 후에는 제한 시간 내에 모든 문제를 풀어야 합니다.</li>
                  <li>답안은 자동으로 저장되지만, 시험 종료 전에 반드시 제출해야 합니다.</li>
                  <li>시험 중 페이지를 벗어나면 자동으로 제출될 수 있습니다.</li>
                </ul>
              </div>
              <button
                  onClick={handleStartExam}
                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                시험 시작하기
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <>
        {/* 시험 헤더 */}
        <div className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{exam?.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20}/>
              <span>남은 시간: {Math.floor(remainingTime / 60)}시간 {remainingTime % 60}분</span>
            </div>
          </div>
          <p className="text-gray-600">{exam?.description}</p>
        </div>

        {/* 문제 영역 */}
        {exam?.questions && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">
                  문제 {currentQuestion + 1} / {exam.questions.length}
                </h2>
                <div className="text-sm text-gray-500">
                  배점: {exam.questions[currentQuestion]?.score}점
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-4">{exam.questions[currentQuestion]?.questionText}</p>

                {exam.questions[currentQuestion]?.type === 'MULTIPLE_CHOICE' ? (
                    <div className="space-y-2">
                      {exam.questions[currentQuestion]?.choices?.map((choice) => (
                          <label
                              key={choice.number}
                              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <input
                                type="radio"
                                name={`question-${exam.questions[currentQuestion].id}`}
                                value={choice.number}
                                checked={answers[exam.questions[currentQuestion].id] === choice.number.toString()}
                                onChange={(e) => handleSaveAnswer(exam.questions[currentQuestion].id, e.target.value)}
                                className="text-green-500 focus:ring-green-500"
                            />
                            <span>{choice.choiceText}</span>
                          </label>
                      ))}
                    </div>
                ) : (
                    <textarea
                        value={answers[exam.questions[currentQuestion].id] || ''}
                        onChange={(e) => handleSaveAnswer(exam.questions[currentQuestion].id, e.target.value)}
                        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="답안을 입력하세요"
                    />
                )}
              </div>

              {/* 네비게이션 버튼 */}
              <div className="flex justify-between">
                <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 text-gray-600 disabled:text-gray-400"
                >
                  이전 문제
                </button>
                {currentQuestion === exam.questions.length - 1 ? (
                    <button
                        onClick={() => handleFinishExam()}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      시험 종료
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}
                        className="px-4 py-2 text-green-600 hover:text-green-700"
                    >
                      다음 문제
                    </button>
                )}
              </div>
            </div>
        )}
      </>
  );
};

export default ExamSubmission;
