import React, {useState, useRef} from 'react';
import {UploadCloud, X, File, CheckCircle} from 'lucide-react';

/**
 * 파일 업로드 컴포넌트 입니다.
 */

const FileUpload = ({onFilesChange}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    updateFiles(droppedFiles);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.target.files);
    updateFiles(selectedFiles);
  };

  const updateFiles = (newFiles) => {
    setFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      onFilesChange(updatedFiles); // 부모 컴포넌트에 파일 변경 알림
      return updatedFiles;
    });
  };

  const removeFile = (fileName) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.name !== fileName);
      onFilesChange(updatedFiles); // 부모 컴포넌트에 파일 변경 알림
      return updatedFiles;
    });
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
      <div className="space-y-2">
        <div
            className={`relative p-8 border-2 border-dashed rounded-lg 
        ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
        transition-all duration-200 ease-in-out`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
          <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadCloud className="w-12 h-12 text-gray-400"/>
            <p className="text-lg text-gray-600">
              파일을 드래그하여 업로드하거나
            </p>
            <button
                type="button"
                onClick={onButtonClick}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              파일 선택하기
            </button>
            <p className="text-sm text-gray-500">
              최대 10MB까지 업로드 가능합니다
            </p>
          </div>
        </div>

        {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">업로드된 파일</h3>
              <div className="space-y-2">
                {files.map((file) => (
                    <div
                        key={file.name}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-gray-400"/>
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <CheckCircle className="w-4 h-4 text-green-500"/>
                      </div>
                      <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-500"/>
                      </button>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default FileUpload;
