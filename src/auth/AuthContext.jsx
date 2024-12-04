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
  const [profileImage, setProfileImage] = useState(null);

  const hasRole = (requiredRole) => {
    return userGroups.includes(requiredRole);
  };

  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.some(role => userGroups.includes(role));
  };

  const updateProfileImage = async (newImageUrl) => {
    setProfileImage(newImageUrl);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await fetchAuthSession();

        if (session?.tokens) {
          const currentUser = await getCurrentUser();
          const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
          const identities = session.tokens.idToken.payload['identities'] || [];
          const isGoogle = identities.some(identity => identity.providerName === 'Google');
          const profileImageUrl = session.tokens.idToken.payload['custom:profile_image'];

          setUser(currentUser);
          setUserGroups(groups);
          setIsGoogleUser(isGoogle);
          setProfileImage(profileImageUrl);
        } else {
          setUser(null);
          setUserGroups([]);
          setIsGoogleUser(false);
          setProfileImage(null);
        }
      } catch (error) {
        if (error.name !== 'UserUnAuthenticatedException') {
          console.error('Auth Error:', error);
        }
        setUser(null);
        setUserGroups([]);
        setIsGoogleUser(false);
        setProfileImage(null);
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
    isGoogleUser,
    profileImage,
    updateProfileImage
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
