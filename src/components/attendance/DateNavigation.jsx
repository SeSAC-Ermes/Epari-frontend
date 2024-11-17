import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 날짜 네비게이션 컴포넌트
 * 이전/다음 날짜로 이동 기능 제공
 * 오늘 날짜까지만 선택 가능하도록 제한
 */

const DateNavigation = ({ currentDate, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => new Date(currentDate));
  const [focusedDate, setFocusedDate] = useState(null);

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 이전 달의 마지막 날짜들
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
        isSelectable: prevDate <= today
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isSelectable: currentDate <= today
      });
    }

    // 다음 달의 시작 날짜들 (5주까지만)
    const remainingDays = 35 - days.length;
    if (remainingDays > 0) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          isSelectable: false
        });
      }
    }

    return days;
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setDisplayMonth(newDate);
    setFocusedDate(null);
  };

  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date) => {
    // 문자열로 변환하여 비교
    if (getDateString(date) === getDateString(today)) {
      onDateChange({
        target: { value: getDateString(today) }
      });
      setShowCalendar(false);
    } else if (date < today) {
      onDateChange({
        target: { value: getDateString(date) }
      });
      setShowCalendar(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!showCalendar) return;

    if (e.key === 'Escape') {
      setShowCalendar(false);
      return;
    }

    if (!focusedDate) {
      setFocusedDate(new Date(currentDate));
      return;
    }

    const newFocusedDate = new Date(focusedDate);

    switch (e.key) {
      case 'ArrowLeft':
        newFocusedDate.setDate(focusedDate.getDate() - 1);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newFocusedDate.setDate(focusedDate.getDate() + 1);
        e.preventDefault();
        break;
      case 'ArrowUp':
        newFocusedDate.setDate(focusedDate.getDate() - 7);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newFocusedDate.setDate(focusedDate.getDate() + 7);
        e.preventDefault();
        break;
      case 'Enter':
        // 날짜 문자열로 변환해서 비교
        if (getDateString(focusedDate) === getDateString(today)) {
          handleDateSelect(today);
        } else if (focusedDate < today) {
          handleDateSelect(focusedDate);
        }
        e.preventDefault();
        break;
      case 'Home':
        newFocusedDate.setDate(1);
        e.preventDefault();
        break;
      case 'End':
        newFocusedDate.setMonth(newFocusedDate.getMonth() + 1, 0);
        e.preventDefault();
        break;
      default:
        return;
    }

    // 월이 변경되면 디스플레이 월도 업데이트
    if (newFocusedDate.getMonth() !== focusedDate.getMonth()) {
      setDisplayMonth(newFocusedDate);
    }
    setFocusedDate(newFocusedDate);
  }, [showCalendar, focusedDate, currentDate, today, handleDateSelect]);

  const goToToday = () => {
    const todayString = getDateString(today);
    onDateChange({
      target: { value: todayString }
    });
    setShowCalendar(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

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

          <button
              onClick={() => setShowCalendar(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gray-500"/>
            {formatDate(currentDate)}
          </button>

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

        {showCalendar && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowCalendar(false);
                }}
            >
              <div
                  className="bg-white rounded-xl p-4 shadow-xl max-w-sm w-full mx-4"
                  onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                      onClick={() => handleMonthChange(-1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="이전 달"
                  >
                    <ChevronLeft className="w-5 h-5"/>
                  </button>
                  <h2 className="text-lg font-semibold">
                    {displayMonth.getFullYear()}년 {displayMonth.getMonth() + 1}월
                  </h2>
                  <button
                      onClick={() => handleMonthChange(1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="다음 달"
                  >
                    <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                        {day}
                      </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(displayMonth).map((day, index) => {
                    const dateString = getDateString(day.date);
                    const isSelected = dateString === currentDate;
                    const isFocused = focusedDate && getDateString(day.date) === getDateString(focusedDate);
                    const isTodays = getDateString(day.date) === getDateString(today);

                    return (
                        <button
                            key={index}
                            onClick={() => day.isSelectable && handleDateSelect(day.date)}
                            disabled={!day.isSelectable}
                            tabIndex={isFocused ? 0 : -1}
                            className={`
                      relative p-2 text-sm rounded-lg font-medium
                      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}
                      ${!day.isSelectable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      ${isTodays && !isSelected ? 'ring-2 ring-blue-200' : ''}
                    `}
                        >
                          {day.date.getDate()}
                          {isTodays && (
                              <span
                                  className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"/>
                          )}
                        </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                      onClick={goToToday}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    오늘
                  </button>
                  <button
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default DateNavigation;
