import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const groups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];

        // 그룹 기반 리다이렉션
        if (groups.includes('PENDING_ROLES')) {
          navigate('/PendingApprovalPage');
        } else if (groups.includes('STUDENT') || groups.includes('INSTRUCTOR')) {
          navigate('/courses');
        } else {
          // 그룹이 없는 경우의 처리 (선택적)
          console.warn('User has no recognized groups');
          navigate('/signin');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/signin');
      }
    };

    handleRedirect();
  }, [navigate]);

  return null;
};

export default RootRedirect;
