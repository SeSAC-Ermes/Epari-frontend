import React, {useState} from 'react';
import {ExamCreateForm} from './ExamCreateForm';

export const ExamCreateContainer = () => {
  const [error, setError] = useState(null);

  return (
      <div className="min-h-screen bg-gray-50 flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 py-8">
          {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
          )}
          <ExamCreateForm setError={setError}/>
        </main>
      </div>
  );
};
