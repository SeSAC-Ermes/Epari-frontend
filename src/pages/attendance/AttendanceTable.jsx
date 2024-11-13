import React from 'react';
import AttendanceRow from "./AttendanceRow.jsx";

/**
 * 전체 학생들의 출석 현황을 테이블 형태로 표시하는 컨테이너 컴포넌트
 */
const AttendanceTable = ({ students, onStudentStatusChange }) => {
  return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[8%]"/>
            <col className="w-[20%]"/>
            <col className="w-[12%]"/>
            <col className="w-[12%]"/>
            <col className="w-[12%]"/>
            <col className="w-[12%]"/>
            <col className="w-[12%]"/>
          </colgroup>
          <thead className="bg-gray-50">
          <tr className="border-b border-gray-100">
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">No.</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">수강생 이름</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">출석</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">지각</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">병결</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">결석</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">상태</th>
          </tr>
          </thead>
          <tbody>
          {students.length > 0 ? (
              students.map((student, index) => (
                  <AttendanceRow
                      key={student.no}
                      student={student}
                      onStatusChange={onStudentStatusChange}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                  />
              ))
          ) : (
              <tr className="animate-[fadeIn_0.3s_ease-in-out_forwards]">
                <td colSpan="7" className="py-16 text-center">
                  <p className="text-gray-500">검색 결과가 없습니다</p>
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
};

export default AttendanceTable;
