import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CurriculumCalendar from "../../CurriculumCalendar.jsx";
import { fetchCurriculumEvents } from "../../../api/curriculum/curriculum.js";

/**
 * 커리큘럼 페이지의 메인 컴포넌트
 * 강의의 주차별 학습 내용, 강의 계획, 실습 일정 등을 표시
 */
const CurriculumContent = () => {
  const { courseId } = useParams();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCurriculumEvents(courseId);
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [courseId]);

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">커리큘럼</h1>
          {isLoading && <div>로딩 중...</div>}
          {error && <div>에러 발생: {error}</div>}
          {!isLoading && !error && <CurriculumCalendar events={events}/>}
        </div>
      </main>
  );
};

export default CurriculumContent;
