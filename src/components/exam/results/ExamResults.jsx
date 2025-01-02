import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronUp, FileText} from 'lucide-react';
import {useParams} from 'react-router-dom';
import apiClient from "../../../api/axios.js";

const ExamResults = () => {
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [examResults, setExamResults] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);
  const {courseId, examId} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsURL = `/api/courses/${courseId}/exams/${examId}/results`;

        console.log('Requesting URL:', resultsURL); // URL 확인용

        const response = await apiClient.get(resultsURL);

        // 응답 데이터 로깅
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);

        if (Array.isArray(response.data)) {
          setExamResults(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setExamResults([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        setExamResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, examId]);

  const toggleStudentExpansion = (studentEmail) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentEmail)) {
      newExpanded.delete(studentEmail);
    } else {
      newExpanded.add(studentEmail);
    }
    setExpandedStudents(newExpanded);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">학생</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제출일</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">상태</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">총점</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">답안지</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {examResults.map((result) => (
                <React.Fragment key={result.studentEmail}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{result.studentName}</div>
                      <div className="text-sm text-gray-500">{result.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'NOT_SUBMITTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.status === 'NOT_SUBMITTED' ? '미응시' : '제출완료'}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {result.totalScore}점
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {result.status !== 'NOT_SUBMITTED' && (
                          <button
                              onClick={() => toggleStudentExpansion(result.studentEmail)}
                              className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                          >
                            <FileText size={16}/>
                            답안지 보기
                            {expandedStudents.has(result.studentEmail) ? (
                                <ChevronUp size={16}/>
                            ) : (
                                <ChevronDown size={16}/>
                            )}
                          </button>
                      )}
                    </td>
                  </tr>
                  {expandedStudents.has(result.studentEmail) && result.answers && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold mb-4">답안 목록</h3>
                            <table className="min-w-full">
                              <thead>
                              <tr>
                                <th className="px-4 py-2 text-left">문항</th>
                                <th className="px-4 py-2 text-left">문제</th>
                                <th className="px-4 py-2 text-left">학생 답안</th>
                                <th className="px-4 py-2 text-left">정답</th>
                                <th className="px-4 py-2 text-left">획득 점수</th>
                              </tr>
                              </thead>
                              <tbody>
                              {result.answers.map((answer, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2">문제 {answer.questionNumber}</td>
                                    <td className="px-4 py-2">{answer.questionText}</td>
                                    <td className="px-4 py-2">{answer.studentAnswer}</td>
                                    <td className="px-4 py-2">{answer.correctAnswer}</td>
                                    <td className="px-4 py-2">{answer.earnedScore}점</td>
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                            <div className="mt-4 text-right font-semibold">
                              총점: {result.totalScore}점
                            </div>
                          </div>
                        </td>
                      </tr>
                  )}
                </React.Fragment>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default ExamResults;
