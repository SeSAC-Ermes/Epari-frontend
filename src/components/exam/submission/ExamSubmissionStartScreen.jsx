import React from "react";

const ExamSubmissionStartScreen = ({ exam, onStart }) => {
  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">{exam?.title}</h1>
          <p className="text-gray-600 mb-6">{exam?.description}</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-yellow-800 mb-2">시험 응시 전 주의사항</h2>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>시험 시작 후에는 중간에 나갈 수 없습니다.</li>
              <li>모든 문제에 답변해야 제출이 가능합니다.</li>
              <li>제한 시간이 종료되면 자동으로 제출됩니다.</li>
              <li>부정행위가 적발될 경우 0점 처리됩니다.</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <button
                onClick={onStart}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              시험 시작하기
            </button>
          </div>
        </div>
      </div>
  );
};

export default ExamSubmissionStartScreen;
