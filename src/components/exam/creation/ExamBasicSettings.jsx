import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { ExamAPI } from '../../../api/exam/examAPI.js';

/**
 * 시험 설정 컴포넌트
 */
export default function ExamBasicSettings() {
  const {courseId} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState({
    title: '',
    description: '',
    examDateTime: {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      day: new Date().getDate().toString().padStart(2, '0'),
      hour: '09',  // 기본값 09시
      minute: '00'  // 기본값 00분
    },
    duration: '',
    totalScore: 100
  });

  const validateDate = (year, month, day, hour, minute) => {
    const examDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
    );
    return examDate >= new Date();
  };

  const validateInput = () => {
    const numberRegex = /^\d+$/;

    if (!numberRegex.test(examInfo.examDateTime.hour) ||
        !numberRegex.test(examInfo.examDateTime.minute)) {
      alert('시간은 숫자만 입력 가능합니다.');
      return false;
    }

    if (!numberRegex.test(examInfo.duration)) {
      alert('제한 시간은 숫자만 입력 가능합니다.');
      return false;
    }

    if (!numberRegex.test(examInfo.examDateTime.year) ||
        !numberRegex.test(examInfo.examDateTime.month) ||
        !numberRegex.test(examInfo.examDateTime.day)) {
      alert('날짜는 숫자만 입력 가능합니다.');
      return false;
    }

    if (!validateDate(
        examInfo.examDateTime.year,
        examInfo.examDateTime.month,
        examInfo.examDateTime.day,
        examInfo.examDateTime.hour,
        examInfo.examDateTime.minute
    )) {
      alert('시험 응시 일자는 오늘 이후 날짜만 선택 가능합니다.');
      return false;
    }

    const hour = parseInt(examInfo.examDateTime.hour);
    const minute = parseInt(examInfo.examDateTime.minute);

    if (hour < 0 || hour > 23) {
      alert('시간은 0~23 사이의 값이어야 합니다.');
      return false;
    }

    if (minute < 0 || minute > 59) {
      alert('분은 0~59 사이의 값이어야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      // ISO 문자열로 직접 변환
      const examDateString = `${examInfo.examDateTime.year}-${examInfo.examDateTime.month}-${examInfo.examDateTime.day}T${examInfo.examDateTime.hour.padStart(2, '0')}:${examInfo.examDateTime.minute.padStart(2, '0')}:00`;

      const examData = {
        title: examInfo.title,
        description: examInfo.description,
        examDateTime: examDateString,
        duration: parseInt(examInfo.duration),
        totalScore: 100
      };

      console.log('Sending exam data:', examData);

      const examId = await ExamAPI.createExam(courseId, examData);
      navigate(`/courses/${courseId}/exams/${examId}/questions`);
    } catch (error) {
      alert(error.response?.data?.message || '시험 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">시험 기본 설정</h1>
          <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-2"
          >
            {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  처리중...
                </>
            ) : '다음: 문제 출제'}
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            출제일자: {new Date().toLocaleDateString()}
          </span>
            <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="시험명을 입력하세요"
                value={examInfo.title}
                onChange={(e) => setExamInfo(prev => ({...prev, title: e.target.value}))}
                required
            />
          </div>

          <div>
          <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="시험 설명을 입력하세요"
              rows={4}
              value={examInfo.description}
              onChange={(e) => setExamInfo(prev => ({...prev, description: e.target.value}))}
              required
          />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-gray-600"/>
                  <span className="font-medium">시험 설정</span>
                </div>
                <div className="flex gap-4 ml-4">
                  <span>시험 응시 일자</span>
                  <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="w-16 px-3 py-1.5 border rounded-lg"
                        placeholder="2024"
                        value={examInfo.examDateTime.year}
                        maxLength={4}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, year: e.target.value}
                        }))}
                        required
                    />년
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="11"
                        value={examInfo.examDateTime.month}
                        maxLength={2}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, month: e.target.value}
                        }))}
                        required
                    />월
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="1"
                        value={examInfo.examDateTime.day}
                        maxLength={2}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, day: e.target.value}
                        }))}
                        required
                    />일
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="09"
                        value={examInfo.examDateTime.hour}
                        maxLength={2}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, hour: e.target.value}
                        }))}
                        required
                    />시
                    <input
                        type="text"
                        className="w-12 px-3 py-1.5 border rounded-lg"
                        placeholder="00"
                        value={examInfo.examDateTime.minute}
                        maxLength={2}
                        onChange={(e) => setExamInfo(prev => ({
                          ...prev,
                          examDateTime: {...prev.examDateTime, minute: e.target.value}
                        }))}
                        required
                    />분
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span>제한 시간</span>
                <div className="flex items-center gap-2">
                  <input
                      type="text"
                      className="w-20 px-3 py-1.5 border rounded-lg"
                      placeholder="0"
                      value={examInfo.duration}
                      onChange={(e) => setExamInfo(prev => ({
                        ...prev,
                        duration: e.target.value
                      }))}
                      required
                  />분
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm justify-end">
                <span>총점</span>
                <div className="flex items-center gap-2">
                  <input
                      type="number"
                      className="w-20 px-3 py-1.5 border rounded-lg bg-gray-100"
                      value={100}
                      disabled
                      required
                  />점
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
  );
}
