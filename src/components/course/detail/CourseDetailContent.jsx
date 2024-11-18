import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseHeader from './CourseHeader';
import InstructorCard from './InstructorCard';
import NoticeQnaSection from './NoticeQnaSection';
import ExamAssignmentSection from './ExamAssignmentSection';
import { CourseAPI } from '../../../api/course/courseAPI.js';
import TodayArchiveList from "./archive/TodayArchiveList.jsx";

/**
 * 강의 상세 페이지의 메인 컨텐츠 컴포넌트
 * - 강의 기본 정보 (제목, 기간, 강의실) 표시
 * - 강사 정보 카드 표시
 * - 오늘의 자료실 섹션 표시
 * - 시험/과제 섹션 표시
 * - 공지사항/Q&A 섹션 표시
 */

const CourseDetailContent = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [notices] = useState([
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
  ]);

  const [qnas] = useState([
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
  ]);

  const [examsAndAssignments] = useState([
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
  ]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setError('강의 ID가 없습니다.');
        return;
      }

      try {
        setLoading(true);
        const response = await CourseAPI.getCourseDetail(courseId);
        const formattedCourseInfo = {
          id: response.id,
          title: response.name,
          period: `${response.startDate} ~ ${response.endDate}`,
          classroom: response.classroom || '강의실 정보가 없습니다.',
          instructor: {
            name: response.instructor?.name || '강사 정보가 없습니다.',
            email: response.instructor?.email || 'Email 정보가 없습니다.',
            phoneNumber: response.instructor?.phoneNumber || response.instructor?.phone || '전화번호 정보가 없습니다.'
          }
        };
        setCourseInfo(formattedCourseInfo);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('강의 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleNavigate = (path) => {
    switch (path) {
      case 'notice':
        navigate(`/courses/${courseId}/notices`);
        break;
      case 'qna':
        navigate(`/courses/${courseId}/qna`);
        break;
      case 'exam':
        navigate(`/courses/${courseId}/exams`);
        break;
      case 'assignment':
        navigate(`/courses/${courseId}/assignments`);
        break;
      default:
        navigate(`/courses/${courseId}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl">강의 정보를 불러오는 중...</div>
  </div>;

  if (error) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl text-red-500">{error}</div>
  </div>;

  if (!courseInfo) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl">강의 정보를 찾을 수 없습니다.</div>
  </div>;

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CourseHeader
            title={courseInfo.title}
            period={courseInfo.period}
            classroom={courseInfo.classroom}
        />

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* 강사정보는 2/3 차지 */}
          <div className="col-span-2">
            <InstructorCard instructor={courseInfo.instructor}/>
          </div>

          {/* 자료실은 1/3 차지 */}
          <div className="col-span-1">
            <TodayArchiveList courseId={courseId}/>
          </div>
        </div>

        <div className="space-y-8">
          <ExamAssignmentSection
              examsAndAssignments={examsAndAssignments}
              onNavigate={handleNavigate}
          />

          <NoticeQnaSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              notices={notices}
              qnas={qnas}
              onNavigate={handleNavigate}
          />
        </div>

      </main>
  );
};

export default CourseDetailContent;
