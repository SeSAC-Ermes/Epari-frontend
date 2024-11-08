import React from 'react';

const CourseCard = ({ course }) => {
  return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-blue-100 relative"/>
        <div className="p-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{course.startDate} ~ {course.endDate}</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"/>
            <div>
              <p className="font-medium text-sm">{course.instructor}</p>
              <p className="text-xs text-gray-500">{course.instructorTitle}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourseCard;
