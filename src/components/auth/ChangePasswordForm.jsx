import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'aws-amplify/auth';
import PasswordValidation from './PasswordValidation';

/**
 * 비밀번호 변경 폼
 */
const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurrentPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword: currentPassword
      });
      setStep(2);
    } catch (error) {
      console.error('Current password verification error:', error);
      if (error.name === 'NotAuthorizedException') {
        setError('현재 비밀번호가 일치하지 않습니다.');
      } else {
        setError('비밀번호 확인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (newPassword) => {
    setLoading(true);
    setError('');

    if (currentPassword === newPassword) {
      setError('새 비밀번호가 현재 비밀번호와 동일합니다.');
      setLoading(false);
      return;
    }

    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
      });
      setStep(3);
    } catch (error) {
      console.error('Password change error:', error);
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
            <form onSubmit={handleCurrentPasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  현재 비밀번호
                </label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="현재 비밀번호를 입력하세요"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  disabled={loading}
              >
                {loading ? '확인중...' : '확인'}
              </button>
            </form>
        );

      case 2:
        return (
            <div className="space-y-6">
              <PasswordValidationWrapper onSubmit={handlePasswordChange} loading={loading}/>
            </div>
        );

      case 3:
        return (
            <div className="text-center space-y-6">
              <p className="text-green-600 font-medium">
                비밀번호가 성공적으로 변경되었습니다!
              </p>
              <button
                  onClick={() => navigate('/mypage')}
                  className="w-full py-2 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                마이페이지로 돌아가기
              </button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              비밀번호 변경
            </h1>
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
        </div>
      </div>
  );
};

const PasswordValidationWrapper = ({ onSubmit, loading }) => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });

  const [validation, setValidation] = useState({
    hasMinLength: false,
    hasMaxLength: true,
    hasNumber: false,
    hasLowerCase: false,
    isPasswordMatch: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordValid) {
      onSubmit(passwords.password);
    }
  };

  const isPasswordValid = validation.hasMinLength &&
      validation.hasMaxLength &&
      validation.hasNumber &&
      validation.hasLowerCase &&
      validation.isPasswordMatch;

  return (
      <form onSubmit={handleSubmit}>
        <PasswordValidation
            passwords={passwords}
            setPasswords={setPasswords}
            validation={validation}
            setValidation={setValidation}
        />
        <button
            type="submit"
            className={`w-full mt-6 py-2 px-4 ${
                isPasswordValid
                    ? 'bg-green-400 hover:bg-green-500'
                    : 'bg-gray-300 cursor-not-allowed'
            } text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2`}
            disabled={loading || !isPasswordValid}
        >
          {loading ? '변경중...' : '비밀번호 변경'}
        </button>
      </form>
  );
};

export default ChangePasswordForm;
