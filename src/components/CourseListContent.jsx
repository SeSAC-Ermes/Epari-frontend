import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 사용지가 현재 수강 중인 강의와 관련된 정보를 표시하는 컴포넌트
 */
const CourseListContent = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      category: 'NOTICE',
      title: '(정부지원가) AWS 클라우드를 활용한 MSA 기반 거버넌스 솔루션',
      instructor: '윤지수',
      instructorTitle: 'Server AI Engineer'
    },
    {
      id: 2,
      category: 'LEARNING GUIDE',
      title: '취업을 위한 자료구조 및 알고리즘 특강',
      instructor: '김명우',
      instructorTitle: 'Software Developer'
    }
  ];

  const tabData = {
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
      },
      {
        id: 3,
        title: '교육과정 개편 안내',
        writer: '세바 관리자',
        date: '2024/10/15',
        views: 156
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
  };

  const getTableHeaders = () => {
    return ['No.', '제목', '작성자', '날짜', '조회수'];
  };

  const handleViewAll = () => {
    if (activeTab === 'notice') {
      navigate('/noticelist');
    } else {
      navigate('/lecturenoticelist');
    }
  };

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">현재 수강 중인 강의</h1>

        <div className="flex gap-8">
          <div className="w-2/3">
            <div className="grid grid-cols-2 gap-4">
              {courses.map(course => (
                  <div
                      key={course.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" // cursor-pointer 추가
                      onClick={() => navigate('/coursedetail')}
                  >
                    <div className="h-32 bg-blue-100 relative">
                      <div
                          className={`absolute bottom-2 left-2 ${
                              course.category === 'NOTICE' ? 'bg-green-400' : 'bg-purple-400'
                          } text-white px-2 py-1 rounded-full text-xs`}
                      >
                        {course.category}
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200"/>
                        <div>
                          <p className="font-medium text-sm">{course.instructor}</p>
                          <p className="text-xs text-gray-500">{course.instructorTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="w-1/3">
            {/* 추가 콘텐츠 영역 */}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6 border-b">
            <div className="flex gap-6">
              <button
                  className={`pb-2 font-medium ${
                      activeTab === 'notice'
                          ? 'text-green-500 border-b-2 border-green-500'
                          : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('notice')}
              >
                공지사항
              </button>
              <button
                  className={`pb-2 font-medium ${
                      activeTab === 'courseNotice'
                          ? 'text-green-500 border-b-2 border-green-500'
                          : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('courseNotice')}
              >
                강의 공지사항
              </button>
            </div>
            <button
                onClick={handleViewAll}
                className="text-sm text-green-500 hover:text-green-600"
            >
              전체보기
            </button>
          </div>

          <table className="w-full">
            <thead>
            <tr className="border-t border-b">
              {getTableHeaders().map((header, index) => (
                  <th key={index} className="py-3 text-left">
                    {header}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {tabData[activeTab].map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{item.id}</td>
                  <td className="py-3">{item.title}</td>
                  <td className="py-3">{item.writer}</td>
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.views}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </main>
  );
};

export default CourseListContent;
