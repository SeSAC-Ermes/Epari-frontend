import React from "react";

/**
 * 시험의 전체 문제 목록을 그리드 형태로 보여주는 컴포넌트
 * 현재 문제와 답안 작성 여부에 따라 다른 스타일을 적용
 */

const ExamSubmissionQuestionList = ({
                        questions,
                        currentQuestion,
                        answers,
                        onQuestionSelect
                      }) => {
  return (
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">문제 목록</h3>
        <div className="grid grid-cols-8 gap-2">
          {questions.map((question, index) => (
              <button
                  key={index}
                  onClick={() => onQuestionSelect(index)}
                  className={`p-2 text-sm rounded-lg ${
                      currentQuestion === index
                          ? 'bg-green-500 text-white'
                          : answers[question.id]
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-600'
                  }`}
              >
                {index + 1}
              </button>
          ))}
        </div>
      </div>
  );
};

export default ExamSubmissionQuestionList;
