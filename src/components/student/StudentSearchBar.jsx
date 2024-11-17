import React from 'react';
import { Search } from 'lucide-react';

/**
 * 학생 검색을 위한 검색바 컴포넌트
 * 이름 또는 이메일로 학생을 검색할 수 있음
 */

const StudentSearchBar = ({ searchTerm, onSearchChange }) => {
  return (
      <div className="relative w-64">
        <input
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
        />
      </div>
  );
};

export default StudentSearchBar;
