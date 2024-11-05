import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import Logo from '../assets/epariLogo.jpg';
import {Calendar, Database, FileText, Layout, MessageSquare, Settings, User} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {icon: <FileText size={20}/>, text: 'Schedules', path: '/schedules'},
    {icon: <Database size={20}/>, text: 'Resources', path: '/resources'},
    {icon: <MessageSquare size={20}/>, text: 'Discussion', path: '/discussion'},
    {icon: <Calendar size={20}/>, text: 'Schedules', path: '/schedule'},
    {icon: <User size={20}/>, text: 'my Account', path: '/account'},
    {icon: <Settings size={20}/>, text: 'Settings', path: '/settings'}
  ];

  return (
      <div className="w-64 min-h-screen bg-white p-6 border-r border-gray-200">
        <Link to="/" className="flex items-center gap-1 text-inherit no-underline mb-6 px-2">
          <img
              src={Logo}
              className="w-12 h-12"
              alt="Logo"
          />
          <span className="text-lg font-semibold text-black">SeSAC</span>
          <sup className="text-xs text-gray-500 font-normal">epari</sup>
        </Link>
        <Link to="/aws" className="flex items-center gap-3 p-3 bg-green-500 rounded-lg text-white no-underline mb-4">
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
