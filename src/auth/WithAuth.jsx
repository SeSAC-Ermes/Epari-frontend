import React from 'react';
import { useAuth } from './AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedComponent } from './RoleBasedComponent';
import { PAGE_PERMISSIONS, FEATURE_PERMISSIONS } from '../constants/auth.js';

/**
 * withPageAuth와 withFeatureAuth는 컴포넌트의 권한 검사를 수행하는 HOC
 * 특정 페이지나 UI 요소가 사용자가 가진 권한에 따라 접근 가능 여부를 결정
 */

// 페이지 레벨 권한 검사를 위한 HOC
export const withPageAuth = (WrappedComponent, permissionKey) => {
  return function WithPageAuthWrapper(props) {
    const { hasAnyRole } = useAuth();
    const requiredRoles = PAGE_PERMISSIONS[permissionKey];

    return (
        <ProtectedRoute requiredRoles={requiredRoles}>
          <WrappedComponent {...props} />
        </ProtectedRoute>
    );
  };
};

// UI 요소 레벨 권한 검사를 위한 HOC
export const withFeatureAuth = (WrappedComponent, permissionKey) => {
  return function WithFeatureAuthWrapper(props) {
    const { hasAnyRole } = useAuth();
    const requiredRoles = FEATURE_PERMISSIONS[permissionKey];

    return (
        <RoleBasedComponent requiredRoles={requiredRoles}>
          <WrappedComponent {...props} />
        </RoleBasedComponent>
    );
  };
};
