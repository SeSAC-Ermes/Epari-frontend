import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import LectureManagementModal from './LectureManagementModal';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import NoticeTabs from './NoticeTabs';
import NoticeTable from './NoticeTable';


const getIsInstructorFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.roles?.includes('ROLE_INSTRUCTOR') || false;
  } catch (e) {
    console.error('Token parsing error:', e);
    return false;
  }
};
const CourseListContent = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [tabData] = useState({
    notice: [
      {
        id: 1,
        title: '2024년도 1학기 수강신청 안내',
        writer: '세바 관리자',
        date: '2024/10/03',
        views: 245
      },
      {
        id: 2,
        title: '온라인 강의 시스템 업데이트 안내',
        writer: '세바 관리자',
        date: '2024/10/14',
        views: 189
      }
    ],
    courseNotice: [
      {
        id: 1,
        title: 'AWS 실습 환경 설정 안내',
        writer: '윤지수',
        date: '2024/10/12',
        views: 78
      },
      {
        id: 2,
        title: '알고리즘 스터디 그룹 모집',
        writer: '김명우',
        date: '2024/10/13',
        views: 92
      }
    ]
  });

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchApi = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const baseUrl = 'http://localhost:8080/api';

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      ...options
    };

    const response = await fetch(`${baseUrl}${url}`, defaultOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await fetchApi('/lectures/userlectures');
        if (data.length > 0 && data[0].instructor) {
          // 첫 번째 강의의 강사 정보가 있고, 그 강사가 현재 사용자인 경우
          setIsInstructor(true);
          setCurrentUserId(data[0].instructor.id);
        }

        const formattedCourses = data.map(lecture => ({
          id: lecture.id,
          title: lecture.name,
          startDate: lecture.startDate,
          endDate: lecture.endDate,
          instructor: lecture.instructor?.name || '강사 미정',
          instructorTitle: lecture.instructor?.title || 'Instructor',
          classroom: lecture.classroom
        }));
        setCourses(formattedCourses);
      } catch (err) {
        setError('사용자 정보를 불러오는데 실패했습니다.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCreateLecture = () => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }
    setSelectedLecture(null);
    setIsModalOpen(true);
  };

  const handleEditLecture = (lecture) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }

    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      try {
        await fetchApi(`/lectures/${lectureId}?instructorId=${currentUserId}`, {
          method: 'DELETE'
        });
        setCourses(prevCourses => prevCourses.filter(course => course.id !== lectureId));
      } catch (error) {
        console.error('강의 삭제 실패:', error);
        alert(error.message || '강의 삭제에 실패했습니다.');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }

    try {
      if (selectedLecture) {
        const data = await fetchApi(`/lectures/${selectedLecture.id}?instructorId=${currentUserId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === selectedLecture.id ? { ...course, ...data } : course
            )
        );
      } else {
        const data = await fetchApi(`/lectures?instructorId=${currentUserId}`, {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setCourses(prevCourses => [...prevCourses, data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('강의 저장 실패:', error);
      alert(error.message || '강의 저장에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">강의 목록을 불러오는 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 강의 목록</h1>
          {isInstructor && (
              <button
                  onClick={handleCreateLecture}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus size={20}/>
                새 강의 만들기
              </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {courses.map(course => (
              <div key={course.id} className="relative">
                <CourseCard course={course}/>
                {isInstructor && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                          onClick={() => handleEditLecture(course)}
                          className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                      >
                        <Pencil size={16} className="text-gray-600"/>
                      </button>
                      <button
                          onClick={() => handleDeleteLecture(course.id)}
                          className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                      >
                        <Trash2 size={16} className="text-red-500"/>
                      </button>
                    </div>
                )}
              </div>
          ))}
        </div>

        {/* 공지사항 섹션 */}
        <div className="bg-white rounded-lg p-6 mt-8">
          <NoticeTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
          <NoticeTable notices={tabData[activeTab]}/>
        </div>

        <LectureManagementModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            lecture={selectedLecture}
            onSubmit={handleModalSubmit}
        />
      </main>
  );
};

export default CourseListContent;
