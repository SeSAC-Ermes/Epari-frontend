import React from 'react';
import ExamBasicSettings from '../../components/exam/creation/ExamBasicSettings.jsx';
import { withPageAuth } from '../../auth/WithAuth.jsx';

const ExamBasicSettingsPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
              <ExamBasicSettings/>
            </div>
          </div>
        </main>
      </div>
  );
};

export default withPageAuth(ExamBasicSettingsPage, 'EXAM_CREATION');
