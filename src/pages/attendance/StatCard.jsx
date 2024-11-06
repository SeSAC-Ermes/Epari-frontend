import React from 'react';

/**
 * 단일 통계 정보를 아이콘과 함께 카드 형태로 표시하는 UI 컴포넌트
 */
const StatCard = ({ icon, label, count, bgColor }) => {
  const getTextColor = (bgColor) => {
    const colorMap = {
      'green': 'text-green-600',
      'red': 'text-red-600',
      'blue': 'text-blue-600',
      'gray': 'text-gray-900',
    };
    return colorMap[bgColor] || 'text-gray-900';
  };

  const getBgClass = (bgColor) => {
    const bgMap = {
      'green': 'bg-green-50 border-green-100',
      'red': 'bg-red-50 border-red-100',
      'blue': 'bg-blue-50 border-blue-100',
      'gray': 'bg-gray-50 border-gray-200',
    };
    return bgMap[bgColor] || 'bg-white border-gray-100';
  };

  return (
      <div className={`flex items-center gap-3 ${getBgClass(bgColor)} rounded-xl px-7 py-2.5 min-w-[150px] border`}>
        <div className="flex flex-col items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
        <span className={`text-xl font-medium ml-auto ${getTextColor(bgColor)}`}>
        {count}
      </span>
      </div>
  );
};

export default StatCard;
