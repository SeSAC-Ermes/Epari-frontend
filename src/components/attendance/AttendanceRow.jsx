import React from 'react';

/**
 * 개별 학생의 출석 상태를 표시하고 변경하는 테이블 행 컴포넌트
 */
const AttendanceRow = ({ student, onStatusChange }) => {
  const statuses = [
    { key: '출석', color: 'green', bgClass: 'bg-green-500', borderClass: 'border-green-500' },
    { key: '지각', color: 'orange', bgClass: 'bg-orange-500', borderClass: 'border-orange-500' },
    { key: '병결', color: 'gray', bgClass: 'bg-gray-500', borderClass: 'border-gray-500' },
    { key: '결석', color: 'blue', bgClass: 'bg-blue-500', borderClass: 'border-blue-500' }
  ];

  const handleStatusChange = (newStatus) => {
    onStatusChange?.({ ...student, status: newStatus });
  };

  const getStatusBadge = (status) => {
    let className = 'px-2 py-1 rounded-full text-xs font-medium ';

    switch (status) {
      case '출석':
        className += 'bg-green-50 text-green-700';
        break;
      case '결석':
        className += 'bg-blue-50 text-blue-700';
        break;
      case '병결':
        className += 'bg-gray-50 text-gray-700';
        break;
      case '지각':
        className += 'bg-red-50 text-red-700';
        break;
      default:
        className += 'bg-gray-50 text-gray-700';
    }

    return <span className={className}>{status}</span>;
  };

  return (
      <tr className="border-b border-gray-100 hover:bg-gray-50 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
        <td className="py-3 px-4 text-center text-sm text-gray-600">{student.no}</td>
        <td className="py-3 px-4 text-center text-sm font-medium text-gray-900">
          {student.name}
        </td>
        {statuses.map(({ key, bgClass, borderClass }) => (
            <td key={key} className="py-3 px-4 text-center">
              <label className="cursor-pointer flex justify-center items-center">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={student.status === key}
                    onChange={() => handleStatusChange(key)}
                />
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center 
              ${student.status === key ? borderClass : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {student.status === key && (
                      <div className={`w-3 h-3 rounded-full ${bgClass}`}/>
                  )}
                </div>
              </label>
            </td>
        ))}
        <td className="py-3 px-4 text-center">
          {getStatusBadge(student.status)}
        </td>
      </tr>
  );
};

export default React.memo(AttendanceRow);
