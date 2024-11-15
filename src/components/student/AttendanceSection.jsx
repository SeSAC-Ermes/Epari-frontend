import React from 'react';

/**
 * 학생의 출석 현황을 표시하는 컴포넌트
 * 출석/지각/결석 횟수를 시각적으로 표시
 */

const AttendanceSection = ({ attendance }) => {
  return (
      <div className="space-y-4">
        <h4 className="font-medium">출석 현황</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">출석</p>
            <p className="text-xl font-medium text-green-600">
              {attendance.present}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">지각</p>
            <p className="text-xl font-medium text-yellow-600">
              {attendance.late}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">병가</p>
            <p className="text-xl font-medium text-purple-600">
              {attendance.sick}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">결석</p>
            <p className="text-xl font-medium text-red-600">
              {attendance.absent}
            </p>
          </div>
        </div>
      </div>
  );
};

export default AttendanceSection;
