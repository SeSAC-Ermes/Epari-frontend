import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import FileUpload from "../../common/FileUpload.jsx";
import FileDownloadList from './FileDownloadList.jsx';
import { quillFormats, quillModules } from '../../common/QuillConfig.js';
import 'react-quill/dist/quill.snow.css';

/**
 * 강의 자료 수정 폼 컴포넌트
 *
 * 기존 강의 자료를 수정하기 위한 폼을 제공합니다.
 * - 제목, 내용 수정 기능
 * - 기존 첨부파일 관리 (다운로드, 삭제)
 * - 새 파일 첨부 기능
 * - 폼 유효성 검사
 */

const CourseFileEditForm = ({
                              courseId,
                              contentId,
                              initialTitle,
                              initialContent,
                              existingFiles,
                              onSubmit,
                              onCancel,
                              onRemoveFile,
                              isSubmitting
                            }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [newFiles, setNewFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    onSubmit(formData);
  };

  const handleFilesChange = (files) => {
    setNewFiles(files);
  };

  return (
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
              />
            </div>
            <div className="flex items-center gap-2 mt-7">
              <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
              >
                취소
              </button>
              <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
              >
                {isSubmitting ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </div>

          <div className="space-y-2" style={{ marginBottom: '80px' }}>
            <label className="block text-sm font-medium text-gray-700">내용</label>
            <div className="rounded-lg">
              <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-[200px]"
              />
            </div>
          </div>

          {existingFiles.length > 0 && (
              <div className="space-y-2">
                <div className="border rounded-lg p-4 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    기존 첨부파일
                  </label>
                  <FileDownloadList
                      files={existingFiles}
                      courseId={courseId}
                      contentId={contentId}
                      onDelete={onRemoveFile}
                      isEditMode={true}
                  />
                </div>
              </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              새 파일 첨부
            </label>
            <FileUpload onFilesChange={handleFilesChange} />
          </div>
        </form>
      </div>
  );
};

export default CourseFileEditForm;
