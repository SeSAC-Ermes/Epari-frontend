import React from "react";

/**
 * 시험 문제를 표시하고 답안을 입력받는 카드 컴포넌트
 * 객관식/주관식 문제 유형에 따라 다른 입력 UI를 제공
 */

const ExamSubmissionQuestionCard = ({ question, questionNumber, totalQuestions, answer, onAnswerChange }) => {
  const renderAnswerInput = () => {
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
                      checked={answer === choice.number.toString()}
                      onChange={(e) => onAnswerChange(question.id, e.target.value)}
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
            value={answer || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="답안을 입력하세요"
        />
        </div>
    );
  };

  return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
            문제 {questionNumber} / {totalQuestions}
          </h2>
          <div className="text-sm text-gray-500">
            배점: {question.score}점
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-800 mb-6">{question.questionText}</p>

          {/* 이미지가 있을 경우에만 이미지 표시 */}
          {question.imageUrl && (
              <div className="mb-6">
                <img
                    src={question.imageUrl}
                    alt="문제 이미지"
                    className="max-w-full h-auto max-h-96 rounded-lg mx-auto"
                />
              </div>
          )}

          {renderAnswerInput()}
        </div>
      </div>
  );
};

export default ExamSubmissionQuestionCard;
