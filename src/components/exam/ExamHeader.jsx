// components/exam/ExamHeader.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';

const ExamHeader = () => {
  const navigate = useNavigate();

  return (
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">시험 목록</h1>
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            onClick={() => navigate('/exam/create')}  // 시험 출제 페이지로 이동
        >
          시험 출제하기
        </button>
      </div>
  );
};

export default ExamHeader;
