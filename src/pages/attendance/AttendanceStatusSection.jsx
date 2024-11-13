import React from 'react';
import { ClipboardList } from 'lucide-react';
import StatCards from './StatCards';
import DateNavigation from "./DateNavigation.jsx";

/**
 * 출석부 상단 섹션 컴포넌트
 * 날짜 네비게이션과 출석 현황 통계를 표시
 */
const AttendanceStatusSection = ({ stats, currentDate, onDateChange, onMarkAllPresent }) => {
  return (
      <div className="space-y-4">
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
