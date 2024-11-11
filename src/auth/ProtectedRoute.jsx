import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * 페이지 레벨의 접근 제어,
 * 인증되지 않은 사용자는 '/unauthorized'로 리다이렉트
 */
export const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!user) {

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트하고,
    // 원래 가려고 했던 페이지 정보를 state로 전달
    return <Navigate to="/signin" state={{ from: location.pathname }} replace/>;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace/>;
  }

  return children;
};
