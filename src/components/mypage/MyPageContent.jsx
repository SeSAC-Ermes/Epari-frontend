import React from 'react';
import { Calendar, MessageCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 마이페이지
 */
const MyPageContent = () => {

  const navigate = useNavigate()

  const userInfo = {
    name: "홍길동",
    email: "hong@example.com"
  };

  const courses = [
    {
      id: 1,
      title: 'AWS 클라우드를 활용한 MSA 기반 자바 개발자 양성 과정',
      period: '2024-07-03 ~ 2025-01-07',
      company: '윤강사',
      students: 301
    },
    {
      id: 2,
      title: '스프링 부트와 리액트를 활용한 풀스택 개발자 과정',
      period: '2024-08-05 ~ 2025-02-28',
      company: '김강사',
      students: 302
    }
  ];

  const qna = [
    {
      id: 1,
      date: '2024.10.30',
      category: 'BACKEND',
      title: 'AWS 인스턴스 구축 관련 질문',
      hasAnswer: true
    },
    {
      id: 2,
      date: '2024.07.10',
      category: 'BACKEND',
      title: '프로젝트 소개 화면 관련 질문',
      hasAnswer: true
    },
    {
      id: 3,
      date: '2024.07.10',
      category: 'BACKEND',
      title: '업데이트 사항 질문',
      hasAnswer: true
    }
  ];

  return (
      <div className="bg-white">
        {/* Profile Header */}
        <div className="max-w-7xl mx-auto px-4 py-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-2xl">{userInfo.name[0]}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                <p className="text-gray-500">{userInfo.email}</p>
              </div>
            </div>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => navigate('/mypage/change-password')}
            >
              <Lock size={16}/>
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 내 강의 목록 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">수강 이력</h3>
            <div className="flex gap-4 overflow-x-auto">
              {courses.map(course => (
                  <div key={course.id} className="w-1/3 flex-shrink-0 bg-white rounded-lg shadow-sm border p-4">
                    <h4 className="font-medium mb-2 line-clamp-2">{course.title}</h4>
                    <div className="flex flex-col text-sm text-gray-500 gap-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4"/>
                        <span>{course.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4"/>
                        <span>수강생 {course.students}명</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Q&A 섹션 */}
          <div>
            <h3 className="text-lg font-bold mb-4">나의 Q&A</h3>
            <div className="space-y-2">
              {qna.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{item.date}</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                    {item.category}
                  </span>
                      <span>{item.title}</span>
                    </div>
                    <button className="text-sm text-purple-600">답변보기</button>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default MyPageContent;
