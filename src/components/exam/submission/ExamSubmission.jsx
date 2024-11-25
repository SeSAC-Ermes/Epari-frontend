import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamSubmissionStartScreen from './ExamSubmissionStartScreen';
import ExamSubmissionHeader from './ExamSubmissionHeader';
import ExamSubmissionQuestionCard from './ExamSubmissionQuestionCard';
import ExamSubmissionNavigation from './ExamSubmissionNavigation';
import ExamSubmissionQuestionList from './ExamSubmissionQuestionList';

/**
 * 시험 응시 페이지의 컨테이너 컴포넌트
 * 시험 시작, 답안 작성, 임시저장, 제출 등의 기능을 관리
 */

const ExamSubmission = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const mockExam = {
    title: "자바 프로그래밍 중간고사",
    description: "1학기 자바 프로그래밍 중간고사입니다.",
    duration: 60,
    questions: [
      {
        id: 1,
        type: 'MULTIPLE_CHOICE',
        questionText: "자바의 기본 데이터 타입이 아닌 것은?",
        score: 5,
        imageUrl: "https://picsum.photos/400/300",
        choices: [
          { number: 1, choiceText: "int" },
          { number: 2, choiceText: "boolean" },
          { number: 3, choiceText: "String" },
          { number: 4, choiceText: "double" }
        ]
      },
      {
        id: 2,
        type: 'SUBJECTIVE',
        questionText: "객체지향 프로그래밍의 4가지 특징을 설명하시오.",
        score: 10
      }
    ]
  };

  const handleStartExam = () => {
    setIsStarted(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // API 호출로 임시저장 구현
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      alert('임시저장되었습니다.');
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishExam = () => {
    const unansweredCount = mockExam.questions.filter(q => !answers[q.id]).length;

    if (unansweredCount > 0) {
      if (!window.confirm(`아직 ${unansweredCount}개의 문제에 답하지 않았습니다. 정말 제출하시겠습니까?`)) {
        return;
      }
    } else {
      if (!window.confirm('시험을 제출하시겠습니까?')) {
        return;
      }
    }

    navigate('../');
  };

  if (!isStarted) {
    return <ExamSubmissionStartScreen exam={mockExam} onStart={handleStartExam}/>;
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ExamSubmissionHeader
            title={mockExam.title}
            description={mockExam.description}
            remainingTime={mockExam.duration}
            onSave={handleSave}
            onFinish={handleFinishExam}
            isSaving={isSaving}
        />

        <ExamSubmissionQuestionCard
            question={mockExam.questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={mockExam.questions.length}
            answer={answers[mockExam.questions[currentQuestion]?.id]}
            onAnswerChange={handleAnswerChange}
        />

        <ExamSubmissionNavigation
            currentQuestion={currentQuestion}
            totalQuestions={mockExam.questions.length}
            onPrev={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            onNext={() => setCurrentQuestion(prev => Math.min(mockExam.questions.length - 1, prev + 1))}
        />

        <ExamSubmissionQuestionList
            questions={mockExam.questions}
            currentQuestion={currentQuestion}
            answers={answers}
            onQuestionSelect={setCurrentQuestion}
        />
      </div>
  );
};

export default ExamSubmission;
