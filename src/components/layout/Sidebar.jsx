import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '../../assets/epariLogo.jpg';
import { Bell, Calendar, Database, FileText, Layout, Library, MessageSquare, Settings, User } from 'lucide-react';

/**
 * 페이지 왼쪽에 위치한 공용 사이드바 컴포넌트입니다.
 */

const Sidebar = () => {
  const location = useLocation();
  const { courseId } = useParams();

  const menuItems = [
    { icon: <Bell size={20}/>, text: '공지사항', path: '/noticelist' },
    { icon: <FileText size={20}/>, text: '강의 공지사항', path: '/lecturenoticelist' },
    { icon: <Database size={20}/>, text: 'Q&A 게시판', path: '/qnalist' },
    { icon: <MessageSquare size={20}/>, text: '커리큘럼', path: '/curriculum' },
    { icon: <Calendar size={20}/>, text: '시험 및 과제', path: '/exams' },
    { icon: <Library size={20}/>, text: '강의 자료 목록', path: courseId ? `/courses/${courseId}/files` : '/courses' },
    { icon: <User size={20}/>, text: '내정보', path: '/account' },
    { icon: <Settings size={20}/>, text: 'Settings', path: '/settings' }
  ];

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
          {menuItems.map((item, index) => (
              <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg text-gray-500 no-underline transition-all hover:bg-gray-100 
                    ${location.pathname === item.path ? 'bg-gray-100 text-gray-700' : ''}`}
              >
                {item.icon}
                <span className="text-sm font-normal">{item.text}</span>
              </Link>
          ))}
        </div>
      </div>
  );
};

export default Sidebar;
