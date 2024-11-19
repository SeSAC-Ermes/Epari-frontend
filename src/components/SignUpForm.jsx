import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/epariLogo.jpg';
import axios from '../api/axios.js';

/**
 * 회원가입 폼
 */
const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const [validation, setValidation] = useState({
    isEmailValid: false,
    isPasswordValid: false,
    isPasswordMatch: false,
    isNameValid: false
  });

  const [emailVerification, setEmailVerification] = useState({
    isVerifyButtonDisabled: false,
    showVerificationField: false,
    verificationCode: '',
    isEmailVerified: false,
    isVerificationCodeValid: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setValidation(prev => ({
        ...prev,
        isEmailValid: validateEmail(value)
      }));
    } else if (name === 'password') {
      setValidation(prev => ({
        ...prev,
        isPasswordValid: validatePassword(value),
        isPasswordMatch: value === formData.confirmPassword
      }));
    } else if (name === 'confirmPassword') {
      setValidation(prev => ({
        ...prev,
        isPasswordMatch: formData.password === value
      }));
    } else if (name === 'name') {
      setValidation(prev => ({
        ...prev,
        isNameValid: value.length > 0
      }));
    }
  };

  // 인증 코드 유효성 검사 함수 추가
  const validateVerificationCode = (code) => {
    return code.length === 6 && /^\d+$/.test(code);  // 6자리 숫자인지 확인
  };

// 인증 코드 입력 핸들러 수정
  const handleVerificationCodeChange = (e) => {
    const code = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);  // 숫자만 입력 가능, 최대 6자리
    setEmailVerification(prev => ({
      ...prev,
      verificationCode: code,
      isVerificationCodeValid: validateVerificationCode(code)
    }));
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/send-verification', {
        email: formData.email
      });
      console.log('email: ' + formData.email);

      if (response.data) {
        setEmailVerification(prev => ({
          ...prev,
          isVerifyButtonDisabled: true,
          showVerificationField: true,
          verificationCode: ''
        }));
        alert(response.data.message || '인증 코드가 이메일로 전송되었습니다.');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      const errorMessage = err.response?.data?.message;

      if (err.response?.status === 400) {
        if (errorMessage === "이미 가입된 이메일입니다.") {
          setError("이미 가입된 이메일입니다. 로그인을 진행해주세요.");
        } else if (errorMessage === "가입 승인 대기중입니다.") {
          setError("가입 승인 대기중입니다. 관리자의 승인을 기다려주세요.");
        } else {
          setError(errorMessage || '이메일 인증 요청 중 오류가 발생했습니다.');
        }

        setEmailVerification(prev => ({
          ...prev,
          isVerifyButtonDisabled: false,
          showVerificationField: false
        }));
        return;
      }

      setError(errorMessage || '이메일 인증 요청 중 오류가 발생했습니다.');
      setEmailVerification(prev => ({
        ...prev,
        isVerifyButtonDisabled: false
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-code', {
        email: formData.email,
        code: emailVerification.verificationCode
      });

      setEmailVerification(prev => ({
        ...prev,
        isEmailVerified: true,
        showVerificationField: false
      }));
      alert(response.data.message || '이메일 인증이 완료되었습니다.');
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setError(errorMessage || '잘못된 인증 코드입니다.');

      setEmailVerification(prev => ({
        ...prev,
        verificationCode: ''
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/resend-verification', {
        email: formData.email
      });

      setEmailVerification(prev => ({
        ...prev,
        verificationCode: ''
      }));
      alert(response.data.message || '인증 코드가 재발송되었습니다.');
    } catch (err) {
      console.error('Resend code error:', err);
      const errorMessage = err.response?.data?.message;
      setError(errorMessage || '인증 코드 재발송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerification.isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!validation.isPasswordValid || !validation.isPasswordMatch) {
      alert('비밀번호를 확인해주세요.');
      return;
    }

    if (!formData.name) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/signup', {
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        name: formData.name,
        verificationCode: emailVerification.verificationCode
      });

      alert('회원가입이 완료되었습니다. 관리자 승인 후 이용하실 수 있습니다.');
      navigate('/signin');
    } catch (err) {
      console.error('SignUp error:', err);
      const errorMessage = err.response?.data?.message;
      setError(errorMessage || '회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img src={Logo} alt="Epari Logo" className="w-15 h-14 object-contain"/>
          <div className="flex items-baseline">
            <span className="text-3xl font-semibold">SeSAC</span>
            <span className="text-base text-gray-500 font-normal">epari</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-900">회원가입</h1>
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field with Verification */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일</label>
              <div className="flex gap-2">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    disabled={emailVerification.isEmailVerified}
                />
                <button
                    type="button"
                    onClick={handleEmailVerification}
                    disabled={!validation.isEmailValid || emailVerification.isVerifyButtonDisabled || isLoading}
                    className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:bg-gray-300"
                >
                  인증하기
                </button>
              </div>
              {!validation.isEmailValid && formData.email && (
                  <p className="text-sm text-red-500">유효한 이메일 주소를 입력해주세요.</p>
              )}
            </div>

            {/* Verification Code Field */}
            {emailVerification.showVerificationField && !emailVerification.isEmailVerified && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">인증 코드</label>
                  <div className="flex gap-2">
                    <input
                        type="text"
                        value={emailVerification.verificationCode}
                        onChange={handleVerificationCodeChange}
                        maxLength={6}
                        placeholder="6자리 인증 코드를 입력하세요."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={handleVerificationCodeSubmit}
                        disabled={!emailVerification.isVerificationCodeValid || isLoading}  // 수정
                        className="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:bg-gray-300"
                    >
                      확인
                    </button>
                  </div>
                  {emailVerification.verificationCode && !emailVerification.isVerificationCodeValid && (
                      <p className="text-sm text-red-500">6자리 숫자를 입력해주세요.</p>
                  )}
                  <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm text-green-600 hover:text-green-700"
                  >
                    인증 코드 재발송
                  </button>
                </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              {!validation.isPasswordValid && formData.password && (
                  <p className="text-sm text-red-500">
                    비밀번호는 최소 8자 이상이며, 숫자와 소문자를 포함해야 합니다.
                  </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              {formData.confirmPassword && !validation.isPasswordMatch && (
                  <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Buttons Container */}
            <div className="flex flex-col items-center space-y-4">
              {/* Sign Up Button */}
              <button
                  type="submit"
                  disabled={!validation.isEmailValid || !validation.isPasswordValid || !validation.isNameValid || !emailVerification.isEmailVerified || isLoading}
                  className="w-60 py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:bg-gray-300"
              >
                {isLoading ? '처리중...' : '회원가입'}
              </button>

              {/* Sign In Button */}
              <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  disabled={isLoading}
                  className="w-60 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </>
  );
};

export default SignUpForm;
