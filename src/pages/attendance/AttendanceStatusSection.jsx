import React from 'react';
import { ClipboardList } from 'lucide-react';
import StatCards from './StatCards';

/**
 * 전체 출석 현황의 요약 통계를 표시하는 헤더 섹션 컴포넌트
 */
const AttendanceStatusSection = ({ stats }) => {
  return (
      <div className="w-full bg-white rounded-3xl shadow-sm p-4">
        <div className="flex items-center justify-center px-2">
          <div className="flex items-center gap-3 mr-4">
            <ClipboardList className="w-6 h-6 text-green-500"/>
            <span className="text-lg font-medium">출석부</span>
          </div>
          <StatCards stats={stats}/>
        </div>
      </div>
  );
};

export default AttendanceStatusSection;
