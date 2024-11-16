import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export const ExamCreateForm = ({ setError }) => {
  const [examInfo, setExamInfo] = useState({
    title: '',
    examDateTime: {
      year: '2024',
      month: '11',
      day: '1'
    },
    duration: {
      hours: '',
      minutes: ''
    },
    totalScore: 100,
  });

  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('multiple');

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: questionType,
      content: '',
      score: 0,
      choices: questionType === 'multiple' ? ['', '', '', '', ''] : [],
      answer: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
      <form className="max-w-4xl mx-auto space-y-6">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">시험 출제</h1>
          <div className="flex gap-2">
            <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
            >
              임시 저장
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              시험 출제하기
            </button>
          </div>
        </div>

        {/* 시험 기본 정보 */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">출제일자: 2024.10.30</span>
            <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="시험명을 입력하세요"
                value={examInfo.title}
                onChange={(e) => setExamInfo(prev => ({...prev, title: e.target.value}))}
            />
          </div>

          {/* 시험 관리 섹션 */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-gray-600"/>
                  <span className="font-medium">시험 관리</span>
                </div>
                <div className="flex gap-4 ml-4">
                  <span>시험 응시 일자</span>
                  <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="w-16 px-3 py-1.5 border rounded-lg"
                        placeholder="2024"
                        value={examInfo.examDateTime.year}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, year: e.target.value}
                        }))}
                    />년
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="11"
                        value={examInfo.examDateTime.month}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, month: e.target.value}
                        }))}
                    />월
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="1"
                        value={examInfo.examDateTime.day}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, day: e.target.value}
                        }))}
                    />일
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span>제한 시간</span>
                <div className="flex items-center gap-2">
                  <input
                      type="text"
                      className="w-12 px-3 py-1.5 border rounded-lg"
                      placeholder="시간"
                      value={examInfo.duration.hours}
                      onChange={(e) => setExamInfo(prev => ({
                        ...prev,
                        duration: {...prev.duration, hours: e.target.value}
                      }))}
                  />:
                  <input
                      type="text"
                      className="w-12 px-3 py-1.5 border rounded-lg"
                      placeholder="분"
                      value={examInfo.duration.minutes}
                      onChange={(e) => setExamInfo(prev => ({
                        ...prev,
                        duration: {...prev.duration, minutes: e.target.value}
                      }))}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm justify-end">
                <span>후시험결과</span>
                <div className="flex items-center gap-2">
                  <input
                      type="number"
                      className="w-20 px-3 py-1.5 border rounded-lg"
                      value={examInfo.totalScore}
                      onChange={(e) => setExamInfo(prev => ({...prev, totalScore: e.target.value}))}
                  />
                  <span>/ 현재 입력된 총점</span>
                  <span className="text-gray-400">25점</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 문제 영역 */}
        {questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                  <label htmlFor={`subjective-${index}`}>주관식 (단답형)</label>
                </div>
                <div className="flex items-center gap-2">
                  <label>배점</label>
                  <input
                      type="number"
                      className="w-20 px-3 py-1.5 border rounded-lg"
                      value={question.score}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index] = {
                          ...question,
                          score: Number(e.target.value)
                        };
                        setQuestions(updatedQuestions);
                      }}
                  />
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
              />

              {question.type === 'multiple' && (
                  <div className="space-y-2">
                    {question.choices.map((choice, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm w-6">{i + 1}</span>
                          <input
                              type="text"
                              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="답안을 입력하세요"
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
                    placeholder={question.type === 'multiple' ? "정답 번호를 입력하세요" : "정답을 입력하세요"}
                    value={question.answer}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[index] = {
                        ...question,
                        answer: e.target.value
                      };
                      setQuestions(updatedQuestions);
                    }}
                />
              </div>
            </div>
        ))}

        {/* 문제 추가 버튼 */}
        <button
            type="button"
            onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-500"
        >
          + 문제 추가하기
        </button>
      </form>
  );
};
