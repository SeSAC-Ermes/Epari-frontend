import React from 'react';
import { ClipboardList, Search } from 'lucide-react';
import StatCards from './StatCards.jsx';
import DateNavigation from "./DateNavigation.jsx";

/**
 * 출석부 상단 섹션 컴포넌트
 * 날짜 네비게이션과 출석 현황 통계를 표시
 */
const AttendanceStatusSection = ({ stats, currentDate, onDateChange, onMarkAllPresent, onSearch }) => {
  return (
      <div className="space-y-4">
        {/* 새로운 헤더 섹션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-gray-500"/>
            <h1 className="text-xl font-semibold text-gray-900">출석 관리</h1>
          </div>

          <div className="relative">
            <div
                className="flex items-center h-10 w-64 rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3">
                <Search className="w-5 h-5 text-gray-400"/>
              </div>
              <input
                  type="text"
                  placeholder="학생 검색"
                  className="w-full h-full px-3 text-sm text-gray-900 bg-transparent border-none focus:outline-none"
                  onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DateNavigation
            currentDate={currentDate}
            onDateChange={onDateChange}
        />

        <div className="w-full bg-white rounded-3xl shadow-sm p-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-green-500"/>
              <span className="text-lg font-medium">출석률</span>
            </div>
            <button
                onClick={onMarkAllPresent}
                className="px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500"/>
              출석 전체 선택
            </button>
          </div>
          <StatCards stats={stats}/>
        </div>
      </div>
  );
};

export default AttendanceStatusSection;
