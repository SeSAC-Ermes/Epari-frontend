import React from 'react';

/**
 * 학습 활동 페이지
 * 강의의 각종 학습 활동을 확인하고 참여할 수 있는 페이지
 */
const LearningActivitiesPage = () => {
  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">학습 활동</h1>

          <div className="border-b pb-4 mb-6">
            <div className="flex gap-4">
              <button className="px-4 py-2 text-green-500 border-b-2 border-green-500">
                전체 활동
              </button>
              <button className="px-4 py-2 text-gray-500">
                진행중인 활동
              </button>
              <button className="px-4 py-2 text-gray-500">
                완료된 활동
              </button>
            </div>
          </div>

          <div className="min-h-[400px] flex items-center justify-center text-gray-500">
            학습 활동 목록이 이곳에 표시됩니다.
          </div>
        </div>
      </main>
  );
};

export default LearningActivitiesPage;
