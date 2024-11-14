import React, { useState } from 'react';
import { ArrowDownToLine, Download, Trash2 } from 'lucide-react';
import { CourseFileAPI } from '../../../api/lecture/CourseFileApi.js';


/**
 * 강의 자료 목록 다운로드 관리
 */
const FileDownloadList = ({ files, courseId, contentId, onDelete, isEditMode = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleDownload = async () => {
    try {
      // 선택된 파일들 필터링
      const selectedFileObjects = files.filter(file =>
          selectedFiles.includes(file.id)
      );

      for (const file of selectedFileObjects) {
        setDownloadingFiles(prev => new Set([...prev, file.id]));
        await CourseFileAPI.downloadFile(
            courseId,
            contentId,
            file.id,
            file.originalFileName  // 원본 파일명 전달
        );
        setDownloadingFiles(prev => {
          const next = new Set(prev);
          next.delete(file.id);
          return next;
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          {!isEditMode && (
              <>
                <div className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={selectedFiles.length === files.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600">전체 선택</span>
                </div>
                {selectedFiles.length > 0 && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <ArrowDownToLine size={16} />
                      <span className="text-sm">선택 파일 다운로드</span>
                    </button>
                )}
              </>
          )}
        </div>

        <div className="space-y-2">
          {files.map((file) => (
              <div
                  key={file.id}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  onClick={(e) => e.stopPropagation()}
              >
                {!isEditMode && (
                    <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleSelectFile(file.id)}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 mr-3"
                    />
                )}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    {downloadingFiles.has(file.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
                    ) : (
                        <Download size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.originalFileName}</p>
                    <p className="text-xs text-gray-500">
                      {(file.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                {isEditMode && (
                    <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete && onDelete(file.id);
                        }}
                        className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default FileDownloadList;
