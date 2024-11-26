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
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // hasRole과 hasAnyRole 함수를 먼저 정의
  const hasRole = (requiredRole) => {
    return userGroups.includes(requiredRole);
  };

  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.some(role => userGroups.includes(role));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();

        const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
        // identities 필드를 확인하여 Google 사용자 여부 확인
        const identities = session.tokens.idToken.payload['identities'] || [];
        const isGoogle = identities.some(identity => identity.providerName === 'Google');

        // 디버깅을 위한 로그 추가
        console.log('Session Tokens:', session.tokens);
        console.log('ID Token Payload:', session.tokens.idToken.payload);
        console.log('Is Google User:', isGoogle);

        setUser(currentUser);
        setUserGroups(groups);
        setIsGoogleUser(isGoogle);
      } catch (error) {
        console.error('Auth Error:', error);
        setUser(null);
        setUserGroups([]);
        setIsGoogleUser(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  const value = {
    user,
    loading,
    userGroups,
    hasRole,
    hasAnyRole,
    isGoogleUser
  };

  return (
      <AuthContext.Provider value={value}>
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
