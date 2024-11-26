import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { ExamAPI } from '../../../api/exam/examAPI.js';
import QuestionCard from './QuestionCard';
import UploadGuide from './UploadGuide';

/**
 * 전체 시험 문제 출제 컴포넌트
 */

export default function ExamQuestions() {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [previewImages, setPreviewImages] = useState({});

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({
          ...prev,
          [index]: reader.result
        }));

        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
          ...questions[index],
          image: file
        };
        setQuestions(updatedQuestions);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });

    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...questions[index],
      image: null
    };
    setQuestions(updatedQuestions);
  };

  const calculateTotalScore = () => {
    return questions.reduce((sum, question) => sum + (parseInt(question.score) || 0), 0);
  };

  const validateQuestion = (question) => {
    if (question.score <= 0) {
      alert(`${question.id}번 문제의 배점은 양수여야 합니다.`);
      return false;
    }

    if (!question.content.trim()) {
      alert(`${question.id}번 문제의 내용을 입력해주세요.`);
      return false;
    }

    if (question.type === 'multiple') {
      if (question.choices.some(choice => !choice.trim())) {
        alert(`${question.id}번 문제의 모든 보기를 입력해주세요.`);
        return false;
      }

      const answer = parseInt(question.answer);
      if (isNaN(answer) || answer < 1 || answer > 5) {
        alert(`${question.id}번 문제의 답은 1부터 5 사이의 숫자여야 합니다.`);
        return false;
      }
    } else {
      if (!question.answer.trim()) {
        alert(`${question.id}번 문제의 답을 입력해주세요.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questions.length) {
      alert('최소 1개 이상의 문제를 추가해주세요.');
      return;
    }

    for (const question of questions) {
      if (!validateQuestion(question)) {
        return;
      }
    }

    setLoading(true);

    try {
      for (const question of questions) {
        const questionData = {
          questionText: question.content,
          score: question.score,
          type: question.type === 'multiple' ? 'MULTIPLE_CHOICE' : 'SUBJECTIVE',
          correctAnswer: question.answer,
          choices: question.type === 'multiple' ?
              question.choices.map((choice, index) => ({
                number: index + 1,
                choiceText: choice
              })) : undefined,
        };

        await ExamAPI.createQuestion(courseId, examId, questionData);
      }

      navigate(`/courses/${courseId}/exams`);
    } catch (error) {
      alert(error.response?.data?.message || '문제 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: 'multiple',
      content: '',
      score: 1,
      choices: ['', '', '', '', ''],
      answer: '',
      image: null
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    if (window.confirm('문제를 삭제하시겠습니까?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index)
          .map((q, i) => ({
            ...q,
            id: i + 1
          }));
      setQuestions(updatedQuestions);

      setPreviewImages(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
    }
  };

  return (
      <div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">문제 출제</h1>
            <button
                type="submit"
                disabled={loading || questions.length === 0 || calculateTotalScore() > 100}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    처리중...
                  </>
              ) : '완료'}
            </button>
          </div>

          {questions.map((question, index) => (
              <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                  previewImage={previewImages[index]}
                  onQuestionChange={(index, updatedQuestion) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index] = updatedQuestion;
                    setQuestions(updatedQuestions);
                  }}
                  onRemove={removeQuestion}
                  onImageChange={handleImageChange}
                  onImageRemove={removeImage}
              />
          ))}

          <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-500"
          >
            + 문제 추가하기
          </button>

          <UploadGuide />

          <div className="fixed bottom-6 right-24">
            <div className="text-sm text-gray-600">
              총점: <span className={calculateTotalScore() > 100 ? 'text-red-500' : 'text-green-500'}>
              {calculateTotalScore()}/100
            </span>
            </div>
          </div>

          <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          >
            <ChevronUp size={24}/>
          </button>
        </form>
      </div>
  );
}
