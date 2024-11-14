import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ExamContainer = () => {
  const [exams, setExams] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">시험 관리</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                    type="text"
                    placeholder="시험 제목 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-64 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                  type="button"
                  onClick={() => navigate('create')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                시험 출제하기
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
              <tr className="border-y">
                <th className="py-4 text-left text-sm font-medium text-gray-600">No.</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">시험 출제 일자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">제목</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">작성자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">시험 응시 일자</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">응시 인원</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">평균 점수</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">점수 확인</th>
              </tr>
              </thead>
              <tbody>
              {exams
                  .filter(exam =>
                      exam.title.toLowerCase().includes(searchKeyword.toLowerCase())
                  )
                  .map((exam) => (
                      <ExamListItem
                          key={exam.id}
                          exam={exam}
                          courseId={exam.courseId}
                      />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
};
