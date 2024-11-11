import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 강의 목록에서 각 강의를 카드 형태로 표시하는 컴포넌트
 * 강의명, 기간, 강사 정보, 강의실 정보를 보여주고 클릭 시 상세 페이지로 이동
 */

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/coursedetail?id=${course.id}`);
  };

  return (
      <div
          className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleClick}
      >
        <div className="h-32 bg-blue-100 relative"/>
        <div className="p-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{course.title || course.name}</h3>
          <p className="text-xs text-gray-500 mb-2">
            {course.startDate} ~ {course.endDate}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"/>
            <div>
              <p className="font-medium text-sm">
                {typeof course.instructor === 'object'
                    ? course.instructor.name
                    : course.instructor || '강사 미정'}
              </p>
              {course.classroom && (
                  <p className="text-xs text-gray-500">강의실: {course.classroom}</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourseCard;
