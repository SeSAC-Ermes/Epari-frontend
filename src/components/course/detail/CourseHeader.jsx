import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * 강의 페이지 상단의 헤더 컴포넌트
 * 강의명, 교육 기간, 강의실 정보를 표시
 */

const CourseHeader = ({ title, period, classroom }) => (
    <div className="p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="space-y-2">
        <div className="flex items-center text-gray-500">
          <span className="w-20">교육 기간</span>
          <span>{period}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <span className="w-20">강의실</span>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-gray-400"/>
            <span>{classroom}</span>
          </div>
        </div>
      </div>
    </div>
);

export default CourseHeader;
