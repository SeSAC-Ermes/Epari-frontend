// components/exam/ExamContainer.jsx
import React from 'react';
import ExamHeader from './ExamHeader';

const ExamContainer = () => {
  return (
      <div className="container mx-auto px-4 py-8">
        <ExamHeader />
        <div className="mt-8">
          {/* 시험 목록 테이블이 들어갈 자리 */}
          <table className="min-w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험 출제 일자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시험 응시 일자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답수 확인</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {/* 시험 목록 데이터가 들어갈 자리 */}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ExamContainer;
