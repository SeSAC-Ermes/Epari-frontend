import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import CourseManagementModal from './CourseManagementModal.jsx';
import NoticeTabs from './NoticeTabs';
import NoticeTable from './NoticeTable';
import { CourseAPI } from "../../../api/course/courseAPI.js";

/**
 * 강의 목록 페이지의 메인 컴포넌트
 * 사용자의 수강/강의 목록을 표시하고 강사용 강의 관리 기능(생성/수정/삭제) 제공
 * 하단에 공지사항 섹션 포함
 */

const getIsInstructorFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log('Decoded token payload:', decodedPayload);

    const isInstructor = decodedPayload['cognito:groups']?.includes('INSTRUCTOR') || false;
    console.log('Is instructor:', isInstructor);
    return isInstructor;
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
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const instructorStatus = getIsInstructorFromToken();
        setIsInstructor(instructorStatus);

        const data = await CourseAPI.getUserCourse();
        console.log('API response:', data);

        if (instructorStatus && data.length > 0) {
          const instructorId = data[0]?.instructor?.id;
          if (instructorId) {
            setCurrentUserId(instructorId);
            console.log('Setting currentUserId:', instructorId);
          }
        }

        const formattedCourses = data.map(course => ({
          id: course.id,
          title: course.name,
          name: course.name,
          startDate: course.startDate,
          endDate: course.endDate,
          instructor: course.instructor,
          classroom: course.classroom,
          imageUrl: course.imageUrl
        }));
        setCourses(formattedCourses);
      } catch (err) {
        setError('강의 목록을 불러오는데 실패했습니다.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCreateCourse = () => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }

    if (window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      try {
        await CourseAPI.deleteCourse(courseId, currentUserId);
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        alert('강의가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('강의 삭제 실패:', error);
        alert('강의 삭제에 실패했습니다. ' + (error.message || ''));
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!currentUserId) {
      alert('강사 권한이 필요합니다.');
      return;
    }

    try {
      let data;
      if (selectedCourse) {
        data = await CourseAPI.updateCourse(selectedCourse.id, currentUserId, formData);
        const updatedCourse = {
          id: data.id,
          title: data.name,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          instructor: data.instructor,
          classroom: data.classroom
        };
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === selectedCourse.id ? updatedCourse : course
            )
        );
      } else {
        data = await CourseAPI.createCourse(currentUserId, formData);
        const newCourse = {
          id: data.id,
          title: data.name,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          instructor: data.instructor,
          classroom: data.classroom
        };
        setCourses(prevCourses => [...prevCourses, newCourse]);
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          {courses.map(course => (
              <div key={course.id} className="relative">
                <CourseCard course={course}/>
                {isInstructor && (
                    <div
                        className="absolute top-2 right-2 flex gap-2 z-10"
                        onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                    >
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

        <CourseManagementModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            course={selectedCourse}
            onSubmit={handleModalSubmit}
        />
      </main>
  );
};

export default CourseListContent;
