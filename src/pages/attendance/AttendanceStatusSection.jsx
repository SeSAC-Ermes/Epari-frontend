import React from 'react';
import { ClipboardList } from 'lucide-react';
import StatCards from './StatCards';
import DateNavigation from "./DateNavigation.jsx";

/**
 * 출석부 상단 섹션 컴포넌트
 * 날짜 네비게이션과 출석 현황 통계를 표시
 */
const AttendanceStatusSection = ({ stats, currentDate, onDateChange }) => {
  return (
      <div className="space-y-4">
        <DateNavigation
            currentDate={currentDate}
            onDateChange={onDateChange}
        />
        <div className="w-full bg-white rounded-3xl shadow-sm p-4">
          <div className="flex items-center justify-center px-2">
            <div className="flex items-center gap-3 mr-4">
              <ClipboardList className="w-6 h-6 text-green-500"/>
              <span className="text-lg font-medium">출석률</span>
            </div>
            <StatCards stats={stats}/>
          </div>
        </div>
      </div>
  );
};

export default AttendanceStatusSection;
