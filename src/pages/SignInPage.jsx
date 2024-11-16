import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignInForm from '../components/SignInForm';

/**
 * 로그인 페이지
 */
const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onLoginSuccess = () => {

    // location.state?.from에 원래 가려고 했던 페이지 경로가 있으면 그곳으로,
    // 없으면 기본적으로 courses 이동
    const destination = location.state?.from || '/courses';
    navigate(destination, { replace: true });
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <SignInForm onSuccess={onLoginSuccess}/>
      </div>
  );
};

export default SignInPage;
