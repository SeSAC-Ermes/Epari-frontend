import React, { useEffect, useState } from 'react';
import { Clock, MapPin, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';

/**
 * 마이페이지의 강의 이력 및 수강 이력을 표시하는 컴포넌트
 */
const CourseHistory = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses/usercourses');
        setCourses(response.data);

        // 토큰에서 역할 확인
        const token = localStorage.getItem('token');
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        setIsInstructor(decodedPayload['cognito:groups']?.includes('INSTRUCTOR') || false);

      } catch (err) {
        setError('강의 이력을 불러오는데 실패했습니다.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-48">
          <div className="text-xl">강의 이력을 불러오는 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-48">
          <div className="text-xl text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {isInstructor ? '강의 이력' : '수강 이력'}
        </h2>

        {courses.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {isInstructor ? '강의 이력이 없습니다.' : '수강 이력이 없습니다.'}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                  <div
                      key={course.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="h-24 bg-blue-50 relative">
                      {course.imageUrl ? (
                          <img
                              src={course.imageUrl}
                              alt={course.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                          <div class="text-blue-200">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                        </div>
                      `;
                              }}
                          />
                      ) : (
                          <div
                              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="text-blue-200">
                              <UserCircle2 size={48}/>
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
                          <Clock size={16}/>
                          <span>{course.startDate} ~ {course.endDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <UserCircle2 size={16} className="text-gray-400"/>
                            <span className="text-sm font-medium text-gray-700">
                        {course.instructor?.name || '강사 미정'}
                      </span>
                          </div>
                          {course.classroom && (
                              <div className="flex items-center gap-1 text-gray-500">
                                <MapPin size={16}/>
                                <span className="text-sm">{course.classroom}</span>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default CourseHistory;
