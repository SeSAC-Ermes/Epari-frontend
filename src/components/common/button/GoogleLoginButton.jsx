import React, { useEffect } from 'react';
import { fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios.js';

/**
 * Google 로그인 버튼 컴포넌트, 그룹 확인 후 적절한 페이지로 이동 처리.
 */
const GoogleLoginButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        handleAuthRedirect();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuthRedirect = async () => {
    try {
      const session = await fetchAuthSession();
      console.log('Auth Session:', session);

      const token = session.tokens.accessToken.toString();
      localStorage.setItem('token', token);

      const { groups, email } = getSessionInfo(session);
      await handleUserNavigation(session, groups, email);
    } catch (error) {
      console.error('Error during login process:', error.response?.data || error);
      await signOut();
      navigate('/signin');
    } finally {
    }
  };

  const getSessionInfo = (session) => {
    const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
    const email = session.tokens.accessToken.payload['email'];
    console.log('User Groups:', groups);
    return { groups, email };
  };

  const handleUserNavigation = async (session, groups) => {
    if (groups.includes('INSTRUCTOR') || groups.includes('STUDENT')) {
      await updateGoogleProfile(session);
      navigate('/courses');
      return;
    }
    navigate('/pending-approval');
  };

  const updateGoogleProfile = async (session) => {
    const idToken = session.tokens.idToken.payload;
    const isGoogleUser = Array.isArray(idToken.identities) &&
        idToken.identities.some(identity => identity.providerName === "Google");

    if (isGoogleUser && idToken['custom:profile_image']) {
      try {
        await axios.post('/api/auth/google-profile', {
          email: idToken.email,
          imageUrl: idToken['custom:profile_image']
        });
      } catch (error) {
        console.error('Failed to update Google profile image:', error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
      <button
          onClick={handleGoogleSignIn}
          className="w-60 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
          />
          <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
          />
          <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
          />
          <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
          />
        </svg>
        <span className="font-medium">Google 로그인</span>
      </button>
  );
};

export default GoogleLoginButton;
