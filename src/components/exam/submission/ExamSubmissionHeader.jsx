import React from "react";
import { Clock } from 'lucide-react';

/**
 * 시험 응시 페이지 상단에 위치한 헤더 컴포넌트
 * 시험 제목, 설명, 남은 시간을 표시하고 임시저장/종료 기능을 제공
 */

const ExamSubmissionHeader = ({
                                title,
                                description,
                                remainingTime,
                                onSave,
                                onFinish,
                                isSaving = false
                              }) => {
  return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <span>남은 시간: {Math.floor(remainingTime / 60)}시간 {remainingTime % 60}분</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '임시저장'}
              </button>
              <button
                  onClick={onFinish}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                시험 종료
              </button>
            </div>
          </div>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
  );
};

export default ExamSubmissionHeader;
