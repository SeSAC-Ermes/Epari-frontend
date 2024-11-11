import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CourseHeader from './CourseHeader';
import InstructorCard from './InstructorCard';
import CourseMaterialsGrid from './CourseMaterialsGrid';
import CourseContentTabs from './CourseContentTabs';
import { LectureAPI } from '../../../api/lecture/lectureApi.js';

/**
 * 강의 상세 페이지의 메인 컴포넌트
 * 강의 정보, 강사 정보, 강의 자료, 공지사항/Q&A/시험 탭을 관리하고 표시
 */

const CourseDetailContent = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseid = searchParams.get('courseid');

  // 강의 자료 더미 데이터 (API 연동 전까지 유지)
  const courseMaterials = [
    {
      id: 1,
      title: '[AWS] 리액트 - 스토리북 - MySQL 배포 실습',
      file: '실습 파일.docx',
      date: '2024.10.01'
    },
    {
      id: 2,
      title: '[Quiz] AWS 시험',
      file: '검습 문제.pdf',
      date: '2024.10.23'
    }
  ];

  // 공지사항 더미 데이터 (API 연동 전까지 유지)
  const notices = [
    {
      id: 1,
      title: '휴강 안내',
      writer: '윤지수',
      date: '2024/09/13'
    },
    {
      id: 2,
      title: 'AWS 계정 안내',
      writer: '윤지수',
      date: '2024/09/13'
    }
  ];

  const qnas = [
    {
      id: 1,
      title: 'AWS EC2 접속 관련 질문입니다',
      writer: '김학생',
      date: '2024/09/13',
      status: '답변완료'
    },
    {
      id: 2,
      title: '과제 제출 방법 문의드립니다',
      writer: '이학생',
      date: '2024/09/13',
      status: '답변대기'
    }
  ];

  const examsAndAssignments = [
    {
      id: 1,
      type: '시험',
      title: '[Quiz] AWS 기초 이론 평가',
      writer: '윤지수',
      date: '2024/10/15',
      deadline: '2024/10/22',
      status: '진행중'
    },
    {
      id: 2,
      type: '과제',
      title: 'AWS EC2 인스턴스 생성 실습',
      writer: '윤지수',
      date: '2024/10/05',
      deadline: '2024/10/19',
      status: '제출완료'
    }
  ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseid) {
        setError('강의 ID가 없습니다.');
        return;
      }

      try {
        setLoading(true);
        const response = await LectureAPI.getLectureDetail(courseid);
        console.log('API Response:', response); // API 응답 데이터 확인용

        // API 응답을 컴포넌트에서 사용하는 형식으로 변환
        const formattedCourseInfo = {
          id: response.id,
          title: response.name,
          period: `${response.startDate} - ${response.endDate}`,
          classroom: response.classroom || '강의실 정보가 없습니다.',
          instructor: {
            name: response.instructor?.name || '강사 정보가 없습니다.',
            email: response.instructor?.email || 'Email 정보가 없습니다.',
            phoneNumber: response.instructor?.phoneNumber || response.instructor?.phone || '전화번호 정보가 없습니다.'
          }
        };

        console.log('Formatted Course Info:', formattedCourseInfo); // 변환된 데이터 확인용
        setCourseInfo(formattedCourseInfo);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('강의 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseid]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">강의 정보를 불러오는 중...</div>
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

  if (!courseInfo) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">강의 정보를 찾을 수 없습니다.</div>
        </div>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CourseHeader
            title={courseInfo.title}
            period={courseInfo.period}
            classroom={courseInfo.classroom}
        />

        <InstructorCard instructor={courseInfo.instructor}/>

        <CourseMaterialsGrid materials={courseMaterials}/>

        <CourseContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            notices={notices}
            qnas={qnas}
            examsAndAssignments={examsAndAssignments}
            onNavigate={handleNavigate}
        />
      </main>
  );
};

export default CourseDetailContent;
