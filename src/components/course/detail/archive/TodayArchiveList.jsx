import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, FileText } from 'lucide-react';
import { CourseFileAPI } from '../../../../api/lecture/CourseFileApi';

const TodayArchiveList = ({ courseId }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(new Set());

  useEffect(() => {
    const fetchTodayFiles = async () => {
      if (!courseId) {
        setError('강의 ID가 필요합니다.');
        return;
      }

      try {
        setLoading(true);
        const todayContents = await CourseFileAPI.getTodayFiles(courseId);
        const allFiles = todayContents.flatMap(content =>
            content.files.map(file => ({
              ...file,
              contentId: content.id,
              contentTitle: content.title,
              date: content.date
            }))
        );
        setFiles(allFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('파일을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayFiles();
  }, [courseId]);

  const downloadFile = async (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 약간의 지연 후 URL 해제
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  const handleDownload = async (contentId, fileId, fileName) => {
    const key = `${contentId}-${fileId}`;
    if (downloadProgress.has(key)) return;

    try {
      setDownloadProgress(prev => new Set([...prev, key]));
      const blob = await CourseFileAPI.downloadFile(courseId, contentId, fileId);

      if (blob.type === 'application/json') {
        // API 에러 응답 처리
        const text = await blob.text();
        throw new Error(text);
      }

      await downloadFile(blob, fileName);
    } catch (error) {
      console.error('Download error:', error);
      alert('파일 다운로드에 실패했습니다.');
    } finally {
      setDownloadProgress(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleSelect = (contentId, fileId) => {
    const fileKey = `${contentId}-${fileId}`;
    setSelectedFiles(prev =>
        prev.includes(fileKey)
            ? prev.filter(key => key !== fileKey)
            : [...prev, fileKey]
    );
  };

  const handleBulkDownload = async () => {
    try {
      const selectedItems = selectedFiles.map(fileKey => {
        const [contentId, fileId] = fileKey.split('-');
        const file = files.find(f =>
            f.contentId.toString() === contentId && f.id.toString() === fileId
        );
        return {
          contentId,
          fileId,
          fileName: file?.originalFileName
        };
      });

      for (const item of selectedItems) {
        if (item.fileName) {
          await handleDownload(item.contentId, item.fileId, item.fileName);
          // 각 다운로드 사이에 약간의 지연을 줌
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Bulk download error:', error);
      alert('일괄 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => `${file.contentId}-${file.id}`));
    }
  };

  if (loading) {
    return (
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"/>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-white rounded-lg p-6">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">자료실</h3>
          <div className="flex items-center gap-2">
            <button
                onClick={handleSelectAll}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <CheckCircle
                  size={14}
                  className={selectedFiles.length === files.length ? "text-green-500" : "text-gray-400"}
              />
              전체 선택
            </button>
            {selectedFiles.length > 0 && (
                <button
                    onClick={handleBulkDownload}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-600"
                >
                  <Download size={14}/>
                  다운로드 ({selectedFiles.length})
                </button>
            )}
          </div>
        </div>

        <div className="h-[120px] overflow-y-auto">
          <div className="space-y-2">
            {files.length > 0 ? (
                files.map((file) => {
                  const fileKey = `${file.contentId}-${file.id}`;
                  const isDownloading = downloadProgress.has(fileKey);

                  return (
                      <div
                          key={fileKey}
                          className="flex items-center text-sm bg-gray-50 p-2 rounded hover:bg-gray-100"
                      >
                        <FileText size={16} className="text-gray-400 mr-2"/>
                        <span className="text-blue-500 cursor-pointer hover:underline flex-1">
                    {file.originalFileName}
                  </span>
                        <span className="text-xs text-gray-400 mx-2">
                    ({(file.fileSize / 1024).toFixed(1)} KB)
                  </span>
                        <span className="text-gray-400 mx-2">{file.date}</span>
                        <div className="flex items-center gap-2">
                          <button
                              onClick={() => handleDownload(file.contentId, file.id, file.originalFileName)}
                              className="p-1 hover:bg-gray-200 rounded-full"
                              disabled={isDownloading}
                          >
                            {isDownloading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"/>
                            ) : (
                                <Download size={14} className="text-gray-600"/>
                            )}
                          </button>
                          <button
                              onClick={() => handleSelect(file.contentId, file.id)}
                              className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <CheckCircle
                                size={14}
                                className={
                                  selectedFiles.includes(fileKey)
                                      ? "text-green-500"
                                      : "text-gray-300"
                                }
                            />
                          </button>
                        </div>
                      </div>
                  );
                })
            ) : (
                <div className="text-sm text-gray-500">등록된 자료가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
  );
};

export default TodayArchiveList;
