import React from 'react';

/**
 * 나의 학습현황 페이지
 * 학생이 자신의 학습 진도, 출석, 성적 등을 확인할 수 있는 페이지
 */
const MyProgressPage = () => {
  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">나의 학습현황</h1>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-medium mb-2">출석률</h2>
              <p className="text-3xl font-bold text-green-500">0%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-medium mb-2">과제 제출률</h2>
              <p className="text-3xl font-bold text-blue-500">0%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-medium mb-2">평균 점수</h2>
              <p className="text-3xl font-bold text-purple-500">0점</p>
            </div>
          </div>

          <div className="min-h-[300px] flex items-center justify-center text-gray-500">
            상세 학습 현황이 이곳에 표시됩니다.
          </div>
        </div>
      </main>
  );
};

export default MyProgressPage;
