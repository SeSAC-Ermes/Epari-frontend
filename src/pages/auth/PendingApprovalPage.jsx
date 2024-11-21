import React from 'react';
import { Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "aws-amplify/auth";

const PendingApprovalPage = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
              <Clock className="w-12 h-12 text-blue-500"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              승인 대기 중
            </h1>
            <p className="text-gray-600">
              관리자의 승인을 기다리고 있습니다.
            </p>
          </div>

          {/* 상태 표시 섹션 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0"/>
              <span className="text-gray-600">이메일 인증 완료</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0"/>
              <span className="text-gray-600">회원가입 신청 완료</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div
                  className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0"/>
              <span className="text-blue-600 font-medium">관리자 승인 대기 중</span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-2">
              승인 절차 안내
            </h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>일반적으로 1-2일 내에 승인이 완료됩니다.</li>
              <li>승인이 완료되면 이메일로 알림이 발송됩니다.</li>
              <li>승인 완료 후 서비스 이용이 가능합니다.</li>
            </ul>
          </div>

          {/* 뒤로가기 버튼 */}
          <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 rounded-md text-white font-medium  transition-colors duration-200"
          >
            <span>로그인 페이지</span>
          </button>
        </div>
      </div>
  );
};

export default PendingApprovalPage;
