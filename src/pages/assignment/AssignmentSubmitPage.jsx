import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/Assignment/Header.jsx';
import { AssignmentHeader } from '../../components/Assignment/AssignmentHeader.jsx';
import { AssignmentInstructions } from '../../components/Assignment/AssignmentInstructions.jsx';

const AssignmentSubmission = () => {
  const [submissionText, setSubmissionText] = useState('');

  // 예시 데이터 - 실제로는 props나 API를 통해 받아올 것입니다
  const assignmentData = {
    title: '[AWS] 리액트 - 스프링부트 - MySQL 배포 실습 과제',
    date: '2024.10.30',
    deadline: 'D-3 12:00:01',
    instructions: `위 이미지와 같이 될 Dockerfile을 대체하지 않음 : Docker Compose는 Dockerfile을 대체하는 도구가 아닙니다.
    Dockerfile과 함께 작동하여 이미지를 빌드하고 컨테이너를 실행할 수 있도록 돕는 도구입니다.

    위 구조로 배포한 후 실습 파일을 다운로드 받은 후, 수정한 부분을 표현하여 파일을 업로드 하여 주세요`
  };

  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="p-8 w-full bg-white">
          <Header title="과제 제출" />

          <AssignmentHeader
              date={assignmentData.date}
              title={assignmentData.title}
              deadline={assignmentData.deadline}
          />

          <AssignmentInstructions instructions={assignmentData.instructions} />

          <div>
            <h3 className="font-bold mb-4">과제 제출</h3>
            {/* 임시 텍스트 필드 */}
            <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full h-40 p-2 border rounded-md mb-6"
                placeholder="과제 내용을 작성하세요."
            />
            {/* 임시 파일 업로드 버튼 */}
            <input
                type="file"
                className="mb-6"
            />

            {/*<SubmissionTextArea*/}
            {/*    value={submissionText}*/}
            {/*    onChange={(e) => setSubmissionText(e.target.value)}*/}
            {/*/>*/}
            {/*<FileDropZone />*/}

            {/* 제출하기 버튼 */}
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all ease-in-out duration-200 mt-6 shadow-lg">
                제출하기
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AssignmentSubmission;
