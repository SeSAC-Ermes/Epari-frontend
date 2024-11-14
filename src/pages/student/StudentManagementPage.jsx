import React from 'react';

/**
 * 수강생 관리 페이지
 * 강사가 수강생 목록을 확인하고 관리할 수 있는 페이지
 */
const StudentManagementPage = () => {
  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">수강생 관리</h1>
            <div className="flex items-center gap-4">
              <input
                  type="text"
                  placeholder="수강생 검색..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="min-h-[400px] flex items-center justify-center text-gray-500">
            수강생 목록이 이곳에 표시됩니다.
          </div>
        </div>
      </main>
  );
};

export default StudentManagementPage;
