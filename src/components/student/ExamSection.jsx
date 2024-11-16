import React from 'react';

const ExamSection = ({ exams }) => {
  return (
      <div className="space-y-4">
        <h4 className="font-medium">시험 성적</h4>
        <div className="space-y-2">
          {exams.map(exam => (
              <div key={exam.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{exam.title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{exam.date}</span>
                  <span className="text-sm font-medium">{exam.score}점</span>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default ExamSection;
