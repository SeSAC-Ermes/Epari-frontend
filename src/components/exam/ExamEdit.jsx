import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronUp, X } from 'lucide-react';
import { ExamAPI } from '../../api/exam/examAPI.js';

export const ExamEdit = () => {
  const {courseId, examId} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('multiple');

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const examData = await ExamAPI.getExam(courseId, examId);

        const formattedQuestions = examData.questions.map((q, index) => ({
          id: q.id,
          type: q.type === 'MULTIPLE_CHOICE' ? 'multiple' : 'subjective',
          content: q.questionText,
          score: q.score,
          choices: q.type === 'MULTIPLE_CHOICE'
              ? q.choices.map(c => c.choiceText)
              : [],
          answer: q.correctAnswer
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        setError('시험 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching exam:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [courseId, examId]);

  const calculateTotalScore = () => {
    return questions.reduce((sum, question) => sum + (parseInt(question.score) || 0), 0);
  };

  const validateQuestion = (question) => {
    if (question.score <= 0) {
      alert(`${question.id}번 문제의 배점은 양수여야 합니다.`);
      return false;
    }

    if (!question.content.trim()) {
      alert(`${question.id}번 문제의 내용을 입력해주세요.`);
      return false;
    }

    if (question.type === 'multiple') {
      if (question.choices.some(choice => !choice.trim())) {
        alert(`${question.id}번 문제의 모든 보기를 입력해주세요.`);
        return false;
      }

      const answer = parseInt(question.answer);
      if (isNaN(answer) || answer < 1 || answer > 5) {
        alert(`${question.id}번 문제의 답은 1부터 5 사이의 숫자여야 합니다.`);
        return false;
      }
    } else {
      if (!question.answer.trim()) {
        alert(`${question.id}번 문제의 답을 입력해주세요.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const question of questions) {
      if (!validateQuestion(question)) {
        return;
      }
    }

    setLoading(true);

    try {
      const examData = await ExamAPI.getExam(courseId, examId);
      for (const oldQuestion of examData.questions) {
        await ExamAPI.deleteQuestion(courseId, examId, oldQuestion.id);
      }

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

      navigate(`/courses/${courseId}/exams/${examId}`);
    } catch (error) {
      alert(error.response?.data?.message || '문제 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: questionType,
      content: '',
      score: 1,
      choices: questionType === 'multiple' ? ['', '', '', '', ''] : [],
      answer: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    if (window.confirm('문제를 삭제하시겠습니까?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index)
          .map((q, i) => ({
            ...q,
            id: i + 1
          }));
      setQuestions(updatedQuestions);
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
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
            type="button"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <ChevronUp size={24}/>
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">시험 문제 수정</h1>
          <div className="flex gap-4">
            <button
                type="button"
                onClick={() => navigate(`/courses/${courseId}/exams/${examId}`)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
                type="submit"
                form="exam-edit-form"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={loading || questions.length === 0 || calculateTotalScore() > 100}
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        <form id="exam-edit-form" onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-medium">문제 {index + 1}</div>
                    <div className="flex items-center gap-2">
                      <input
                          type="radio"
                          id={`multiple-${index}`}
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
};

export default ExamEdit;
