import React from 'react';
import { ClipboardList } from 'lucide-react';
import StatCards from './StatCards';

/**
 * 전체 출석 현황의 요약 통계를 표시하는 헤더 섹션 컴포넌트
 */
const AttendanceStatusSection = ({ stats, currentDate, onDateChange }) => {
  return (
      <div className="w-full bg-white rounded-3xl shadow-sm p-4">
        <div className="flex items-center justify-center px-2">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-green-500"/>
            <span className="text-lg font-medium">출석부</span>
            <input
                type="date"
                className="ml-4 px-3 py-1 border rounded-lg text-sm text-gray-600"
                value={currentDate}
                onChange={onDateChange}
            />
          </div>
          <StatCards stats={stats}/>
        </div>
      </div>
  );
};

export default AttendanceStatusSection;
