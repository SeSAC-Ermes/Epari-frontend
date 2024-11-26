import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 시험 응시 페이지의 문제 이동 네비게이션 컴포넌트
 * 이전/다음 문제로 이동할 수 있는 버튼을 제공
 */

const ExamSubmissionNavigation = ({
                                    currentQuestion,
                                    totalQuestions,
                                    onPrev,
                                    onNext
                                  }) => {
  return (
      <div className="flex justify-between items-center pt-4 border-t">
        <button
            onClick={onPrev}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          이전 문제
        </button>

        <button
            onClick={onNext}
            disabled={currentQuestion === totalQuestions - 1}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          다음 문제
          <ChevronRight size={20} />
        </button>
      </div>
  );
};

export default ExamSubmissionNavigation;
