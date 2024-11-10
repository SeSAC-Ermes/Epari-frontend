import React from 'react';
import Logo from '../../assets/epariLogo.jpg';

/**]
 * 첫 로그인 시 적용되는 비밀번호 변경 컴포넌트
 */
const NewPasswordForm = ({ onSubmit, error, newPassword, setNewPassword }) => {
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
            <span className="text-3xl font-semibold">SeSAC</span>
            <span className="text-base text-gray-500 font-normal">epari</span>
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

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
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
};

export default NewPasswordForm;
