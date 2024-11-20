import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * 비밀번호 유효성 검사 및 확인을 실시간으로 처리하고 조건을 시각적으로 표시하는 컴포넌트
 */
const PasswordValidation = ({ passwords, setPasswords, validation, setValidation }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 20) return;

    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setValidation(prev => ({
        ...prev,  // 기존 validation 상태 유지
        hasMinLength: value.length >= 8,
        hasMaxLength: value.length <= 20,
        hasNumber: /\d/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        isPasswordMatch: value === passwords.confirmPassword
      }));
    } else if (name === 'confirmPassword') {
      setValidation(prev => ({
        ...prev,  // 기존 validation 상태 유지
        isPasswordMatch: passwords.password === value
      }));
    }
  };


  const ValidationIcon = ({ isValid }) => (
      isValid ?
          <Check className="w-4 h-4 text-green-500"/> :
          <X className="w-4 h-4 text-red-500"/>
  );

  return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">비밀번호</label>
          <input
              type="password"
              name="password"
              value={passwords.password}
              onChange={handleChange}
              maxLength={20}
              placeholder="비밀번호를 입력하세요."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              maxLength={20}
              placeholder="비밀번호를 다시 입력하세요."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          {passwords.confirmPassword && !validation.isPasswordMatch && (
              <p className="text-sm text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        {/* 비밀번호 요구사항 체크리스트 */}
        <h3 className="text-sm font-medium text-gray-700 mb-2">비밀번호 설정 조건</h3>
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <ValidationIcon isValid={validation.hasMinLength}/>
              <span className="text-sm text-gray-600">8자 이상</span>
            </div>
            <div className="flex items-center gap-2">
              <ValidationIcon isValid={validation.hasMaxLength}/>
              <span className="text-sm text-gray-600">20자 이하</span>
            </div>
            <div className="flex items-center gap-2">
              <ValidationIcon isValid={validation.hasNumber}/>
              <span className="text-sm text-gray-600">숫자 포함</span>
            </div>
            <div className="flex items-center gap-2">
              <ValidationIcon isValid={validation.hasLowerCase}/>
              <span className="text-sm text-gray-600">영문 소문자 포함</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PasswordValidation;
