import { useAuth } from './AuthContext';

/**
 * UI 요소 레벨의 조건부 렌더링, 권한에 따른 컴포넌트 표시/숨김
 */
export const RoleBasedComponent = ({ children, requiredRoles, fallback = null }) => {
  const { hasAnyRole } = useAuth();

  if (!requiredRoles || hasAnyRole(requiredRoles)) {
    return children;
  }

  return fallback;
};
