import React, { useState } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import FileUpload from "../../components/common/FileUpload.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import 'react-quill/dist/quill.snow.css';

const CourseFileCreatePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // React-Quill 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    }
  };

  const formats = [
    'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('제목과 설명을 모두 입력해 주세요.');
      return;
    }

    if (files.length === 0) {
      setError('최소 하나의 파일을 업로드해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: API 연동
      // const response = await uploadCourseFile({
      //   title,
      //   description,
      //   files
      // });

      alert('강의 자료가 성공적으로 업로드되었습니다.');
      navigate('/coursefile');
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">강의 자료 업로드</h1>

              {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">제목</label>
                  <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="자료 제목을 입력하세요"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">설명</label>
                  <div className="border border-gray-300 rounded-lg" style={{ height: '400px' }}>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                        formats={formats}
                        className="h-[350px]"
                        placeholder="자료에 대한 설명을 입력하세요"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
                  <FileUpload onFilesChange={handleFilesChange} />
                </div>

                <div className="flex gap-4 justify-end pb-8">
                  <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={isSubmitting}
                  >
                    미리보기
                  </button>
                  <button
                      type="submit"
                      className={`px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? '업로드 중...' : '자료 업로드'}
                  </button>
                </div>
              </form>

              {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">미리보기</h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">{title}</h3>
                        <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                        {files.length > 0 && (
                            <div className="mt-2">
                              <p>첨부 파일:</p>
                              <ul className="list-disc list-inside">
                                {files.map(file => (
                                    <li key={file.name}>{file.name}</li>
                                ))}
                              </ul>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default CourseFileCreatePage;