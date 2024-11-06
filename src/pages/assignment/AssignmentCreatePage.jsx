import React, { useState } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import Sidebar from '../../components/layout/Sidebar';
import FileUpload from "../../components/common/FileUpload.jsx";
import 'react-quill/dist/quill.snow.css';

/**
  과제 출제 페이지 입니다.
 */

const AssignmentCreatePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);

  const modules = {
    toolbar: {
      container: [
        [{'size': ['small', false, 'large', 'huge']}],
        [{'font': []}],
        ['bold', 'italic', 'underline', 'strike'],
        [{'color': []}, {'background': []}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'align': []}],
        ['link', 'image'],
        ['clean']
      ],
    }
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '' || dueDate.trim() === '' || status.trim() === '') {
      alert('모든 필드를 입력해 주세요.');
      return;
    }
    console.log('과제가 제출되었습니다.');
    alert('과제가 성공적으로 제출되었습니다.');
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar/>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">과제 생성하기</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">설명</label>
                <div className="h-96 border border-gray-300 rounded-lg">
                  <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      modules={modules}
                      formats={formats}
                      className="h-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">제출 기한</label>
                  <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">상태</label>
                  <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                  >
                    <option value="">선택하세요</option>
                    <option value="진행 중">진행 중</option>
                    <option value="완료됨">완료됨</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
                <FileUpload onFilesChange={handleFilesChange} />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  미리보기
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  과제 제출하기
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
                        <X size={20}/>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">{title}</h3>
                      <div
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{__html: description}}
                      />
                      <div className="text-sm text-gray-500">
                        <p>제출 기한: {dueDate}</p>
                        <p>상태: {status}</p>
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
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AssignmentCreatePage;
