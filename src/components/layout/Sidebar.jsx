import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '../../assets/epariLogo.jpg';
import {
  Bell,
  Clipboard,
  ClipboardList,
  FolderArchive,
  Layout,
  Library,
  MessageSquare,
  NotebookPen,
  Settings,
  User
} from 'lucide-react';
import { RoleBasedComponent } from '../../auth/RoleBasedComponent';
import { ROLES } from '../../constants/auth';


/**
 * 페이지 왼쪽에 위치한 공용 사이드바 컴포넌트
 */
const Sidebar = () => {
  const location = useLocation();
  const { courseId } = useParams();
  // 기본 메뉴 아이템 (모든 사용자 공통)
  const baseMenuItems = [
    { icon: <Bell size={20}/>, text: '공지사항', path: '/noticelist' },
    // { icon: <Bell size={20}/>, text: '강의 공지사항', path: '/lecturenoticelist' }
    { icon: <Bell size={20}/>, text: '강의 공지사항', path: '/courses/2/notices' }
  ];

  // 강사 전용 메뉴
  const instructorMenuItems = [
    {
      icon: <ClipboardList size={20}/>,
      text: '출석 관리',
      path: `/instructor/courses/1/attendance`  // TODO: 추후 courseId로 변경 필요
    }
  ];

  // 공통 메뉴 (출석 관리 이후 메뉴들)
  const commonMenuItems = [
    { icon: <Clipboard size={20}/>, text: 'Q&A 게시판', path: '/qnalist' },
    { icon: <MessageSquare size={20}/>, text: '커리큘럼', path: '/curriculum' },
    { icon: <NotebookPen size={20}/>, text: '시험', path: '/exams' },
    { icon: <NotebookPen size={20}/>, text: '과제', path: `/courses/${courseId}/assignments` },
    { icon: <Library size={20}/>, text: '강의 자료 목록', path: courseId ? `/courses/${courseId}/files` : '/courses' },
    {
      icon: <FolderArchive size={20}/>,
      text: '자료실',
      path: courseId ? `/courses/${courseId}/file-archive` : '/courses'
    },
    { icon: <User size={20}/>, text: '내정보', path: '/account' },
    { icon: <Settings size={20}/>, text: 'Settings', path: '/settings' }
  ];

  const renderMenuItem = (item, index) => (
      <Link
          key={item.path}
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
          <span className="text-sm font-medium">(영등포 6기) AWS 클라우드...</span>
        </Link>

        <div className="flex flex-col gap-1">
          {/* 기본 메뉴 렌더링 */}
          {baseMenuItems.map(renderMenuItem)}

          {/* 강사 전용 메뉴 렌더링 */}
          <RoleBasedComponent requiredRoles={[ROLES.INSTRUCTOR]}>
            {instructorMenuItems.map(renderMenuItem)}
          </RoleBasedComponent>

          {/* 공통 메뉴 렌더링 */}
          {commonMenuItems.map(renderMenuItem)}
        </div>
      </div>
  );
};

export default Sidebar;
