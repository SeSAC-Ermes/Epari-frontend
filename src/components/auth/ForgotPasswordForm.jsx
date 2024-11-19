// src/components/auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import Logo from '../../assets/epariLogo.jpg';
import apiClient from '../../api/axios';

/**
 * 비밀번호 재설정 폼
 */
const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateVerificationCode = (code) => {
    return code.length === 6 && /^\d+$/.test(code);  // 6자리 숫자인지 확인
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);  // 숫자만 입력 가능, 최대 6자리
    setCode(newCode);
  };

  // 사용자 그룹 확인 함수
  const checkUserGroup = async (email) => {
    try {
      const response = await apiClient.post('/api/auth/check-user', { email });
      const userGroups = response.data.groups;

      // STUDENT 또는 INSTRUCTOR 그룹에 속하는지 확인
      return userGroups.some(group => ['STUDENT', 'INSTRUCTOR'].includes(group));
    } catch (error) {
      console.error('User group check error:', error);
      throw new Error('사용자 그룹 확인 중 오류가 발생했습니다.');
    }
  };

  // 이메일로 인증 코드 요청
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. 먼저 사용자 그룹 확인
      const isValidUser = await checkUserGroup(email);

      if (!isValidUser) {
        setError('등록되지 않은 사용자입니다.');
        return;
      }

      // 2. 유효한 사용자인 경우 비밀번호 재설정 코드 발송
      await resetPassword({ username: email });
      setStep(2);
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.message) {
        setError(error.message);
      } else {
        switch (error.name) {
          case 'UserNotFoundException':
            setError('등록되지 않은 이메일입니다.');
            break;
          case 'LimitExceededException':
            setError('너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            setError('인증 코드 발송 중 오류가 발생했습니다.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const requirements = [
      { test: password.length >= 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
      { test: /[a-z]/.test(password), message: '소문자를 최소 1개 이상 포함해야 합니다.' },
      { test: /\d/.test(password), message: '숫자를 최소 1개 이상 포함해야 합니다.' }
    ];

    for (const requirement of requirements) {
      if (!requirement.test) {
        return requirement.message;
      }
    }

    return null;
  };

  // 새 비밀번호로 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePassword(newPassword)) {
      setError('비밀번호는 최소 8자 이상이며, 숫자와 소문자를 포함해야 합니다.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });
      setStep(4);
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.name === 'CodeMismatchException' || error.name === 'ExpiredCodeException') {
        setError('인증 코드가 유효하지 않습니다. 처음부터 다시 시도해주세요.');
        setStep(1);
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!code.trim()) {
      setError('인증 코드를 입력해주세요.');
      setLoading(false);
      return;
    }

    if (!validateVerificationCode(code)) {
      setError('6자리 숫자를 입력해주세요.');
      setLoading(false);
      return;
    }

    setStep(3);
    setLoading(false);
  };

  // 인증 코드 재발송 함수 구현
  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      // 먼저 사용자 그룹 재확인
      const isValidUser = await checkUserGroup(email);
      if (!isValidUser) {
        setError('등록되지 않은 사용자입니다.');
        return;
      }

      await resetPassword({ username: email });
      setError('인증 코드가 재발송되었습니다.');
    } catch (error) {
      console.error('Resend code error:', error);
      if (error.name === 'LimitExceededException') {
        setError('너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('인증 코드 재발송 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 각 단계별 폼 렌더링
  const renderStep = () => {
    switch (step) {
      case 1: // 이메일 입력 & 인증코드 요청
        return (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="이메일을 입력하세요"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  disabled={loading}
              >
                {loading ? '처리중...' : '인증 코드 받기'}
              </button>
            </form>
        );

      case 2: // 인증코드 검증
        return (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  인증 코드
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="6자리 인증 코드를 입력하세요"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  disabled={loading}
              >
                {loading ? '처리중...' : '인증 코드 확인'}
              </button>
              <button
                  type="button"
                  onClick={handleResendCode}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                인증 코드 재발송
              </button>
            </form>
        );

      case 3: // 새 비밀번호 설정
        return (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="새로운 비밀번호를 입력하세요"
                    required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="새로운 비밀번호를 다시 입력하세요"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  disabled={loading}
              >
                {loading ? '처리중...' : '비밀번호 변경하기'}
              </button>
            </form>
        );

      case 4: // 완료
        return (
            <div className="text-center space-y-6">
              <p className="text-green-600 font-medium">
                비밀번호가 성공적으로 변경되었습니다!
              </p>
              <button
                  onClick={() => navigate('/signin')}
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                로그인하러 가기
              </button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img
              src={Logo}
              alt="Epari Logo"
              className="w-15 h-14 object-contain"
          />
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold">SeSAC</span>
            <span className="text-base text-gray-500 font-normal">epari</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              비밀번호 찾기
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

          {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
          )}

          {renderStep()}

          {/* Back to Login Link */}
          {step !== 4 && (
              <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={() => navigate('/signin')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                  로그인
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default ForgotPasswordForm;
