import React from 'react';
import Logo from '../assets/epariLogo.jpg'
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from "../components/common/button/GoogleLoginButton.jsx";

const SignIn = () => {
  const navigate = useNavigate();
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
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

          <form className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                  type="email"
                  placeholder="user@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                  type="password"
                  placeholder="user password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

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

              <GoogleLoginButton/>
            </div>
          </form>
        </div>
      </div>
  );
};

export default SignIn;
