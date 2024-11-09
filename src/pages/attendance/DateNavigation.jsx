import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 날짜 네비게이션 컴포넌트
 * 이전/다음 날짜로 이동 기능 제공
 * 오늘 날짜까지만 선택 가능하도록 제한
 */
const DateNavigation = ({ currentDate, onDateChange }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDateObj = new Date(currentDate);
  currentDateObj.setHours(0, 0, 0, 0);

  const isToday = currentDateObj.getTime() === today.getTime();

  const handlePrevDate = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    onDateChange({ target: { value: date.toISOString().split('T')[0] } });
  };

  const handleNextDate = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);

    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);

    if (nextDate.getTime() <= today.getTime()) {
      onDateChange({ target: { value: date.toISOString().split('T')[0] } });
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() <= today.getTime()) {
      onDateChange(e);
    }
  };

  return (
      <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
        <div className="flex items-center justify-center gap-2">
          <button
              onClick={handlePrevDate}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="이전 날짜"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500"/>
          </button>

          <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium min-w-[150px] text-center">
            {formatDate(currentDate)}
          </span>
            <input
                type="date"
                className="sr-only"
                value={currentDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {!isToday && (
              <button
                  onClick={handleNextDate}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="다음 날짜"
              >
                <ChevronRight className="w-5 h-5 text-gray-500"/>
              </button>
          )}
          {isToday && <div className="w-7"/>}
        </div>
      </div>
  );
};

export default DateNavigation;
