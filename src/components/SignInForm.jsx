import React, { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/epariLogo.jpg';

const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(email, password);
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', token);

      // Spring Boot API 서버에 인증 요청
      const response = await fetch('http://localhost:8080/api/auth/validate', { // TODO: URL 환경변수로 추출하기
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
