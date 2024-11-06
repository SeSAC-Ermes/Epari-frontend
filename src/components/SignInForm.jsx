import React, { useState } from 'react';
import { signIn, confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/epariLogo.jpg'

const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('로그인 시도:', { email });

      const signInResult = await signIn({
        username: email,
        password: password,
      });

      console.log('로그인 결과:', signInResult);

      // 비밀번호 재설정이 필요한 경우
      if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setShowNewPasswordForm(true);
        return;
      }

      if (signInResult.isSignedIn) {
        handleSuccessfulSignIn();
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmResult = await confirmSignIn({
        challengeResponse: newPassword
      });

      console.log('비밀번호 변경 결과:', confirmResult);

      if (confirmResult.isSignedIn) {
        handleSuccessfulSignIn();
      }
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      setError(error.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSuccessfulSignIn = async () => {
    try {
      console.log('세션 가져오기 시도');
      const session = await fetchAuthSession();
      console.log('세션 정보:', session);

      const token = session.tokens?.accessToken?.toString();
      console.log('토큰:', token);

      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      localStorage.setItem('token', token);

      const response = await fetch('http://localhost:8080/api/auth/validate', { // TODO: 환경 변수 설정 및 fetch -> axios 라이브러리로 변경하기
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/courselist');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (sessionError) {
      console.error('세션/토큰 처리 중 에러:', sessionError);
      setError('세션 처리 중 오류가 발생했습니다.');
    }
  };

  if (showNewPasswordForm) {
    return (
        <>
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-12">
            <img
                src={Logo}
                alt="Epari Logo"
                className="w-15 h-14 object-contain"
            />
            <div className="flex items-baseline">
            <span className="text-3xl font-semibold">
              SeSAC
            </span>
              <span className="text-base text-gray-500 font-normal">
              epari
            </span>
            </div>
          </div>

          {/* New Password Form Container */}
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-center text-gray-900">
                비밀번호 재설정
              </h1>
              <p className="text-sm text-center text-gray-600">
                첫 로그인을 위해 새로운 비밀번호를 설정해주세요.
              </p>
              {/* Gradient Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="w-2/3 h-0.5 bg-gradient-to-r from-gray-200 via-green-400 to-gray-200"></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleNewPasswordSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="새 비밀번호를 입력하세요"
                />
              </div>

              {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
              )}

              <div className="flex flex-col items-center">
                <button
                    type="submit"
                    className="w-60 py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
        </>
    );
  }

  return (
      <>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img
              src={Logo}
              alt="Epari Logo"
              className="w-15 h-14 object-contain"
          />
          <div className="flex items-baseline">
          <span className="text-3xl font-semibold">
            SeSAC
          </span>
            <span className="text-base text-gray-500 font-normal">
            epari
          </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              Sign In
            </h1>
            {/* Gradient Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-2/3 h-0.5 bg-gradient-to-r from-gray-200 via-green-400 to-gray-200"></div>
              </div>
            </div>
          </div>

          {/* 기존 JSX 구조 유지 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
            )}

            {/* Buttons Container */}
            <div className="flex flex-col items-center space-y-4">
              {/* Sign In Button */}
              <button
                  type="submit"
                  className="w-60 py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Sign In
              </button>

              {/* Sign Up Button */}
              <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-60 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </>
  );
};

export default SignInForm;
