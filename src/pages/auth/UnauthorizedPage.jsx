import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 접근 권한이 없는 경우 사용하는 안내 페이지
 */
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-6">
            이 페이지에 접근할 수 있는 권한이 없습니다.
            필요한 권한이 있는지 확인해 주세요.
          </p>
          <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
  );
};

export default UnauthorizedPage;
