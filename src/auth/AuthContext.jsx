import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

/**
 * 전역적인 인증 상태를 관리
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();

        // Cognito 그룹 정보 추출
        const groups = session.tokens.accessToken.payload['cognito:groups'] || [];

        setUser(currentUser);
        setUserGroups(groups);
      } catch (error) {
        if (error.name !== 'UserUnAuthenticatedException') {
          console.error('Unexpected auth error:', error);
        }
        setUser(null);
        setUserGroups([]);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const hasRole = (requiredRole) => {
    return userGroups.includes(requiredRole);
  };

  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.some(role => userGroups.includes(role));
  };

  if (loading) {

    // 로딩 중일 때 표시할 내용
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  return (
      <AuthContext.Provider value={{ user, loading, userGroups, hasRole, hasAnyRole }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
