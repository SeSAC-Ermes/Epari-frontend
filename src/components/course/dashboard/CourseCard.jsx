import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, UserCircle2 } from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = course.courseImage || course.imageUrl;

  return (
      <div
          className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleClick}
      >
        <div className="h-32 bg-blue-50 relative">
          {imageUrl && !imageError ? (
              <img
                  src={imageUrl}
                  alt={course.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-blue-200">
                  <UserCircle2 size={48} />
                </div>
              </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {course.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>{course.startDate} ~ {course.endDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <UserCircle2 size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                {course.instructor?.name || '강사 미정'}
              </span>
              </div>
              {course.classroom && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={16} />
                    <span className="text-sm">{course.classroom}</span>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourseCard;
