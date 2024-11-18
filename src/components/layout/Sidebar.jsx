import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  Layout,
  PenSquare,
  ScrollText,
  Users
} from 'lucide-react';
import { RoleBasedComponent } from '../../auth/RoleBasedComponent';
import { ROLES } from '../../constants/auth';
import CourseAPI from "../../api/course/courseAPI.js";


/**
 * 페이지 왼쪽에 위치한 공용 사이드바 컴포넌트
 */
const Sidebar = () => {
  const location = useLocation();
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('강의명');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseName = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const response = await CourseAPI.getCourseDetail(courseId);
        setCourseName(response.name);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('강의 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseName();
  }, [courseId]);

  // 공통 메뉴 - 핵심 학습
  const mainMenuItems = courseId ? [
    // {
    //   icon: <Bell size={20}/>,
    //   text: '전체 공지사항',
    //   path: `/courses/${courseId}/notices_global`
    // },
    {
      icon: <Bell size={20}/>,
      text: '강의 공지사항',
      path: `/courses/${courseId}/notices`
    },
    {
      icon: <Calendar size={20}/>,
      text: '학습 활동',
      path: `/courses/${courseId}/activities`
    },
    {
      icon: <FileText size={20}/>,
      text: '과제',
      path: `/courses/${courseId}/assignments`
    },
    {
      icon: <PenSquare size={20}/>,
      text: '시험',
      path: `/courses/${courseId}/exams`
    }
  ] : [];

  // 공통 메뉴 - 학습 지원
  const supportMenuItems = courseId ? [
    {
      icon: <BookOpen size={20}/>,
      text: 'Q&A 게시판',
      path: `/courses/${courseId}/qna`
    },
    {
      icon: <FolderOpen size={20}/>,
      text: '자료실',
      path: `/courses/${courseId}/files`
    },
    {
      icon: <ScrollText size={20}/>,
      text: '강의 커리큘럼',
      path: `/courses/${courseId}/curriculum`
    }
  ] : [];

  // 강사 전용 메뉴
  const instructorMenuItems = courseId ? [
    {
      icon: <ClipboardList size={20}/>,
      text: '출결 관리',
      path: `/courses/${courseId}/attendance`
    },
    {
      icon: <Users size={20}/>,
      text: '수강생 관리',
      path: `/courses/${courseId}/students`
    }
  ]: [];

  // 학생 전용 메뉴
  const studentMenuItems = courseId ? [
    {
      icon: <GraduationCap size={20}/>,
      text: '나의 학습현황',
      path: `/courses/${courseId}/my-progress`
    }
  ] : [];

  const renderMenuItem = (item, index) => (
      <Link
          key={`${item.path}-${index}`}
          to={item.path}
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-500 no-underline transition-all hover:bg-gray-100 
        ${location.pathname === item.path ? 'bg-gray-100 text-gray-700' : ''}`}
      >
        {item.icon}
        <span className="text-sm font-normal">{item.text}</span>
      </Link>
  );

  const renderMenuSection = (title, items) => (
      items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase mb-2 px-3">
              {title}
            </h3>
            <div className="flex flex-col gap-1">
              {items.map(renderMenuItem)}
            </div>
          </div>
      )
  );

  return (
      <div className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200">
        <div className="p-6">
          <Link
              to={courseId ? `/courses/${courseId}` : '/courses'}
              className="flex items-center gap-3 p-3 bg-green-500 rounded-lg text-white no-underline mb-6"
          >
            <Layout size={20}/>
            <span className="text-sm font-medium line-clamp-1" title={courseName}>
            {loading ? '로딩 중...' : error ? '강의명을 불러올 수 없습니다' : courseName}
          </span>
          </Link>

          {/* 핵심 학습 메뉴 */}
          {renderMenuSection('핵심 학습', mainMenuItems)}

          {/* 학습 지원 메뉴 */}
          {renderMenuSection('학습 지원', supportMenuItems)}

          {/* 강사 전용 메뉴 */}
          <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
            {renderMenuSection('강의 관리', instructorMenuItems)}
          </RoleBasedComponent>

          {/* 학생 전용 메뉴 */}
          <RoleBasedComponent requiredRoles={[ROLES.STUDENT]}>
            {renderMenuSection('학습 관리', studentMenuItems)}
          </RoleBasedComponent>
        </div>
      </div>
  );
};

export default Sidebar;
