import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '../../assets/epariLogo.jpg';
import {
  Bell,
  BookOpen,
  ClipboardList,
  FileText,
  FolderOpen,
  Layout,
  ListChecks,
  PenTool,
  ScrollText,
  Settings,
  Users
} from 'lucide-react';
import { RoleBasedComponent } from '../../auth/RoleBasedComponent';
import { ROLES } from '../../constants/auth';
import LectureAPI from "../../api/lecture/lectureApi.js";


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
        const response = await LectureAPI.getLectureDetail(courseId);
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
  ] : [];

  // 학생 전용 메뉴
  const studentMenuItems = courseId ? [
    {
      icon: <ListChecks size={20}/>,
      text: '나의 학습현황',
      path: `/courses/${courseId}/my-progress`
    }
  ] : [];

  // 공통 메뉴
  const commonMenuItems = courseId ? [
    {
      icon: <Bell size={20}/>,
      text: '강의 공지사항',
      path: `/courses/${courseId}/notices`
    },
    {
      icon: <ScrollText size={20}/>,
      text: '강의 커리큘럼',
      path: `/courses/${courseId}/curriculum`
    },
    {
      icon: <Settings size={20}/>,
      text: '학습 활동',
      path: `/courses/${courseId}/activities`
    },
    {
      icon: <PenTool size={20}/>,
      text: '시험',
      path: `/courses/${courseId}/exams`
    },
    {
      icon: <FileText size={20}/>,
      text: '과제',
      path: `/courses/${courseId}/assignments`
    },
    {
      icon: <BookOpen size={20}/>,
      text: 'Q&A 게시판',
      path: `/courses/${courseId}/qna`
    },
    {
      icon: <FolderOpen size={20}/>,
      text: '자료실',
      path: `/courses/${courseId}/files`
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

  return (
      <div className="w-64 min-h-screen bg-white p-6 border-r border-gray-200">
        <Link to="/" className="flex items-center gap-1 text-inherit no-underline mb-6 px-2">
          <img src={Logo} className="w-12 h-12" alt="Logo"/>
          <span className="text-lg font-semibold text-black">SeSAC</span>
          <sup className="text-xs text-gray-500 font-normal">epari</sup>
        </Link>

        <Link
            to={courseId ? `/courses/${courseId}` : '/courses'}
            className="flex items-center gap-3 p-3 bg-green-500 rounded-lg text-white no-underline mb-4"
        >
          <Layout size={20}/>
          <span className="text-sm font-medium line-clamp-1" title={courseName}>
          {loading ? '로딩 중...' : error ? '강의명을 불러올 수 없습니다' : courseName}
        </span>
        </Link>

        <div className="flex flex-col gap-1">
          {/* 강사 전용 메뉴 렌더링 */}
          <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
            {instructorMenuItems.map(renderMenuItem)}
          </RoleBasedComponent>

          {/* 학생 전용 메뉴 렌더링 */}
          <RoleBasedComponent requiredRoles={[ROLES.STUDENT]}>
            {studentMenuItems.map(renderMenuItem)}
          </RoleBasedComponent>

          {/* 공통 메뉴 렌더링 */}
          {commonMenuItems.map(renderMenuItem)}
        </div>
      </div>
  );
};

export default Sidebar;
