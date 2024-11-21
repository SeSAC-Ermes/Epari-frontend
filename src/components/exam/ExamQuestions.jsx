import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamAPI } from '../../api/exam/examAPI.js';
import { ChevronUp, X, } from 'lucide-react';

/**
 * 문제 추가 컴포넌트
 */

export default function ExamQuestions() {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('multiple');
  const topRef = useRef(null);


  const calculateTotalScore = () => {
    return questions.reduce((sum, question) => sum + (parseInt(question.score) || 0), 0);
  };
  const validateQuestion = (question) => {
    // 배점 검사
    if (question.score <= 0) {
      alert(`${question.id}번 문제의 배점은 양수여야 합니다.`);
      return false;
    }

    // 문제 내용 검사
    if (!question.content.trim()) {
      alert(`${question.id}번 문제의 내용을 입력해주세요.`);
      return false;
    }

    // 객관식 문제 검사
    if (question.type === 'multiple') {
      // 보기 내용 검사
      if (question.choices.some(choice => !choice.trim())) {
        alert(`${question.id}번 문제의 모든 보기를 입력해주세요.`);
        return false;
      }

      // 답안 유효성 검사
      const answer = parseInt(question.answer);
      if (isNaN(answer) || answer < 1 || answer > 5) {
        alert(`${question.id}번 문제의 답은 1부터 5 사이의 숫자여야 합니다.`);
        return false;
      }
    } else {
      // 주관식 답안 검사
      if (!question.answer.trim()) {
        alert(`${question.id}번 문제의 답을 입력해주세요.`);
        return false;
      }
    }

    return true;
  };

  // 스크롤업 버튼
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전체 문제 유효성 검사
    for (const question of questions) {
      if (!validateQuestion(question)) {
        return;
      }
    }

    setLoading(true);

    try {
      for (const question of questions) {
        const questionData = {
          questionText: question.content,
          score: question.score,
          type: question.type === 'multiple' ? 'MULTIPLE_CHOICE' : 'SUBJECTIVE',
          correctAnswer: question.answer,
          choices: question.type === 'multiple' ?
              question.choices.map((choice, index) => ({
                number: index + 1,
                choiceText: choice
              })) : undefined
        };

        await ExamAPI.createQuestion(courseId, examId, questionData);
      }

      navigate(`/courses/${courseId}/exams`);
    } catch (error) {
      alert(error.response?.data?.message || '문제 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1, // 현재 문제 개수 + 1을 새 문제 번호로 사용
      type: questionType,
      content: '',
      score: 1,
      choices: questionType === 'multiple' ? ['', '', '', '', ''] : [],
      answer: ''
    };

    // 새 문제를 배열 끝에 추가
    setQuestions([...questions, newQuestion]);
  };


  const removeQuestion = (index) => {
    if (window.confirm('문제를 삭제하시겠습니까?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index)
          .map((q, i) => ({
            ...q,
            id: i + 1 // 1부터 시작하는 연속된 번호 재할당
          }));
      setQuestions(updatedQuestions);
    }
  };



  return (
      <div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">문제 출제</h1>
            <div className="flex gap-2">
              <button
                  type="submit"
                  disabled={loading || questions.length === 0 || calculateTotalScore() > 100}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      처리중...
                    </>
                ) : '완료'}
              </button>
            </div>
          </div>

          {/* 스크롤 버튼과 총점 표시를 같이 묶어서 고정 위치에 배치 */}
          <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2">
            {/* 총점 표시 */}
            <div className={`px-4 py-2 bg-white rounded-lg shadow-lg border ${
                calculateTotalScore() > 100 ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'
            }`}>
              <span className="font-medium">총점: {calculateTotalScore()}/100</span>
            </div>

            {/* 스크롤 버튼 */}
            <button
                type="button"
                onClick={scrollToTop}
                className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
            >
              <ChevronUp size={24}/>
            </button>
          </div>

          {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-lg font-medium text-gray-700">{question.id}번</span>
                    <input
                        type="radio"
                        id={`multiple-${index}`}
                        name={`questionType-${index}`}
                        className="text-green-500 focus:ring-green-500"
                        checked={question.type === 'multiple'}
                        onChange={() => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index] = {
                            ...question,
                            type: 'multiple',
                            choices: ['', '', '', '', '']
                          };
                          setQuestions(updatedQuestions);
                        }}
                    />
                    <label htmlFor={`multiple-${index}`}>객관식</label>
                    <input
                        type="radio"
                        id={`subjective-${index}`}
                        name={`questionType-${index}`}
                        className="text-green-500 focus:ring-green-500"
                        checked={question.type === 'subjective'}
                        onChange={() => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index] = {
                            ...question,
                            type: 'subjective',
                            choices: []
                          };
                          setQuestions(updatedQuestions);
                        }}
                    />
                    <label htmlFor={`subjective-${index}`}>주관식</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">배점</label>
                      <input
                          type="number"
                          className={`w-16 px-2 py-1 border rounded-lg text-center ${
                              calculateTotalScore() > 100 ? 'border-red-500' : ''
                          }`}
                          value={question.score}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value <= 0) {
                              alert('배점은 양수여야 합니다.');
                              return;
                            }
                            const updatedQuestions = [...questions];
                            updatedQuestions[index] = {
                              ...question,
                              score: value
                            };
                            setQuestions(updatedQuestions);
                          }}
                          min="1"
                          required
                      />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="문제 삭제"
                    >
                      <X size={20}/>
                    </button>
                  </div>
                </div>

                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="문제를 입력하세요"
                    value={question.content}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index] = {
                        ...question,
                        content: e.target.value
                      };
                      setQuestions(updatedQuestions);
                    }}
                    required
                />

                {question.type === 'multiple' && (
                    <div className="space-y-2">
                      {question.choices.map((choice, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-sm w-6">{i + 1}</span>
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="보기를 입력하세요"
                                value={choice}
                                onChange={(e) => {
                                  const updatedQuestions = [...questions];
                                  const updatedChoices = [...question.choices];
                                  updatedChoices[i] = e.target.value;
                                  updatedQuestions[index] = {
                                    ...question,
                                    choices: updatedChoices
                                  };
                                  setQuestions(updatedQuestions);
                                }}
                                required
                            />
                          </div>
                      ))}
                    </div>
                )}

                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">답:</div>
                  <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={question.type === 'multiple' ? "정답 번호를 입력하세요 (1~5)" : "정답을 입력하세요"}
                      value={question.answer}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index] = {
                          ...question,
                          answer: e.target.value
                        };
                        setQuestions(updatedQuestions);
                      }}
                      required
                  />
                </div>
              </div>
          ))}

          <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-500"
          >
            + 문제 추가하기
          </button>

          {questions.length === 0 && (
              <div className="text-center text-gray-500 text-sm">
                최소 1개 이상의 문제를 추가해주세요.
              </div>
          )}

          {calculateTotalScore() > 100 && (
              <div className="text-center text-red-500 text-sm">
                총점이 100점을 초과할 수 없습니다.
              </div>
          )}
        </form>
      </div>
  );
}
