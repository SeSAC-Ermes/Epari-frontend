import React from "react";
import { X } from 'lucide-react';
import ImageUploader from './ImageUploade.jsx';

/**
 * 개별 문제 카드 컴포넌트
 */
const QuestionCard = ({
                        question,
                        index,
                        previewImage,
                        onQuestionChange,
                        onRemove,
                        onImageChange,
                        onImageRemove
                      }) => {
  // 문제 유형 선택기 렌더링
  const renderQuestionTypeSelector = () => {
    return (
        <div className="flex items-center gap-4">
          <input
              type="radio"
              id={`multiple-${index}`}
              name={`questionType-${index}`}
              className="text-green-500 focus:ring-green-500"
              checked={question.type === 'multiple'}
              onChange={() => {
                onQuestionChange(index, {
                  ...question,
                  type: 'multiple',
                  choices: ['', '', '', '', ''],
                  answer: ''
                });
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
                onQuestionChange(index, {
                  ...question,
                  type: 'subjective',
                  choices: [],
                  answer: ''
                });
              }}
          />
          <label htmlFor={`subjective-${index}`}>주관식</label>
        </div>
    );
  };

  // 객관식 보기 입력 폼 렌더링
  const renderMultipleChoiceInputs = () => {
    if (question.type !== 'multiple') return null;

    return (
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
                      const updatedChoices = [...question.choices];
                      updatedChoices[i] = e.target.value;
                      onQuestionChange(index, { ...question, choices: updatedChoices });
                    }}
                    required
                />
              </div>
          ))}
        </div>
    );
  };

  // 배점 입력 섹션 렌더링
  const renderScoreSection = () => {
    return (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">배점</label>
          <input
              type="number"
              className="w-16 px-2 py-1 border rounded-lg text-center"
              value={question.score}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  onQuestionChange(index, { ...question, score: value });
                }
              }}
              min="1"
              required
          />
        </div>
    );
  };

  return (
      <div className="bg-white rounded-lg p-6 space-y-4">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-lg font-medium text-gray-700">{question.id}번</span>
            {renderQuestionTypeSelector()}
          </div>
          <div className="flex items-center gap-4">
            {renderScoreSection()}
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="문제 삭제"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 문제 입력 필드 */}
        <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="문제를 입력하세요"
            value={question.content}
            onChange={(e) => onQuestionChange(index, { ...question, content: e.target.value })}
            required
        />

        {/* 이미지 업로더 */}
        <ImageUploader
            index={index}
            previewImage={previewImage}
            onImageChange={onImageChange}
            onImageRemove={onImageRemove}
        />

        {/* 객관식 보기 입력 */}
        {renderMultipleChoiceInputs()}

        {/* 정답 입력 섹션 */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">답:</div>
          <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={question.type === 'multiple' ? "정답 번호를 입력하세요 (1~5)" : "정답을 입력하세요"}
              value={question.answer}
              onChange={(e) => onQuestionChange(index, { ...question, answer: e.target.value })}
              required
          />
        </div>
      </div>
  );
};

export default QuestionCard;
