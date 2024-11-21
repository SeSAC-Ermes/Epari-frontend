import React, { useEffect, useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import StatCards from './StatCards.jsx';
import DateNavigation from "./DateNavigation.jsx";
import { useLocation } from "react-router-dom";

const AttendanceStatusSection = ({ stats, currentDate, onDateChange, onMarkAllPresent, onSearch }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      onSearch?.(location.state.searchQuery);
      window.history.replaceState({}, document.title);
      setInitialized(true);
    }
  }, [location.state, onSearch, initialized]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-gray-500"/>
            <h1 className="text-xl font-semibold text-gray-900">출결 관리</h1>
          </div>

          <div className="relative">
            <div className="flex items-center h-10 w-64 rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3">
                <Search className="w-5 h-5 text-gray-400"/>
              </div>
              <input
                  type="text"
                  placeholder="학생 검색"
                  className="w-full h-full px-3 text-sm text-gray-900 bg-transparent border-none focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

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
