import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

/**
 * 로그인 여부에 따라 해당 페이지로 리다이렉트해주는 컴포넌트
 */
const RootRedirect = () => {
  const { user, loading } = useAuth();

  // 로딩 중일 때 처리
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  // 인증 상태에 따라 리다이렉트
  return user ? <Navigate to="/courselist" replace/> : <Navigate to="/signin" replace/>;
};

export default RootRedirect;
