import React, { useState } from 'react';
import { confirmSignIn, fetchAuthSession, signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/epariLogo.jpg';
import apiClient from '../api/axios';
import NewPasswordForm from './auth/NewPasswordForm';
import GoogleLoginButton from './common/button/GoogleLoginButton';

/**
 * 사용자 로그인 처리 및 인증을 담당하는 컴포넌트
 */
const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);

  // 사용자 입력 유효성 검사
  const validateInputs = () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    if (!email.includes('@')) {
      setError('유효한 이메일 형식이 아닙니다.');
      return false;
    }
    return true;
  };

  // 토큰 유효성 검증
  const validateToken = async (token) => {
    try {
      const response = await apiClient.post('/api/auth/validate', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { isValid: true, userGroups: response.data.groups };
    } catch (error) {
      console.error('Token validation error:', error.response?.data || error.message);
      let errorMessage = '토큰이 유효하지 않습니다.';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
            break;
          case 403:
            errorMessage = '접근 권한이 없습니다.';
            break;
          default:
            errorMessage = '서버 오류가 발생했습니다.';
        }
      }

      return { isValid: false, error: errorMessage };
    }
  };

  // 사용자 권한 검사
  const checkUserAuthorization = (userGroups) => {
    if (!userGroups || userGroups.length === 0) {
      throw new Error('권한이 없습니다.');
    }
    return true;
  };

  // 로그인 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInputs()) {
      return;
    }

    try {
      const signInResult = await signIn({
        username: email,
        password: password,
      });

      if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setShowNewPasswordForm(true);
        return;
      }

      if (signInResult.isSignedIn) {
        await handleSuccessfulSignIn();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';

      switch (error.name) {
        case 'UserNotFoundException':
          errorMessage = '존재하지 않는 사용자입니다.';
          break;
        case 'NotAuthorizedException':
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        default:
          if (error.message === 'Network Error') {
            errorMessage = '네트워크 연결을 확인해주세요.';
          }
      }

      setError(errorMessage);
    }
  };

  // 비밀번호 변경 폼 제출 처리
  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmResult = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (confirmResult.isSignedIn) {
        await handleSuccessfulSignIn();
      }
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      setError(error.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  // 로그인 성공 처리
  const handleSuccessfulSignIn = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        throw new Error('로그인 토큰이 없습니다.');
      }

      // 토큰 유효성 검증
      const { isValid, userGroups, error: validationError } = await validateToken(token);

      if (!isValid) {
        throw new Error(validationError || '토큰 검증에 실패했습니다.');
      }

      // 권한 검사
      checkUserAuthorization(userGroups);

      // 토큰 저장 및 리다이렉트
      localStorage.setItem('token', token);
      navigate('/courses');

    } catch (error) {
      console.error('Session/token handling error:', error);
      setError(error.message || '인증 처리 중 오류가 발생했습니다.');
    }
  };

  // 비밀번호 변경 폼
  if (showNewPasswordForm) {
    return (
        <NewPasswordForm
            onSubmit={handleNewPasswordSubmit}
            error={error}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
        />
    );
  }

  // 기본 로그인 폼 렌더링
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
              로그인
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이메일
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
                비밀번호
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
                로그인
              </button>

              {/* Sign Up Button */}
              <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-60 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                회원가입
              </button>

              {/* Password Reset Button - 추가 */}
              <button type="button" onClick={() => navigate('/reset-password')}
                      className="text-sm text-gray-500 hover:text-gray-700">
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-center">
            <GoogleLoginButton/>
          </div>
        </div>
      </>
  );
};

export default SignInForm;
