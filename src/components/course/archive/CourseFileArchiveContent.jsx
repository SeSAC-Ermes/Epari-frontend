import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FileArchiveList from './FileArchiveList.jsx';
import { CourseFileAPI } from '../../../api/course/CourseFileAPI.js';

/**
 * 강의 자료실 컨텐츠를 관리하는 컴포넌트
 */

const CourseFileArchiveContent = () => {
  const { courseId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await CourseFileAPI.getCourseFiles(courseId);
        // API 응답을 원하는 형태로 변환
        const formattedFiles = response.map(file => ({
          id: file.id,
          createdAt: file.date,
          title: file.title,
          content: file.content,
          files: file.files.map(attachment => ({
            id: attachment.id,
            originalFileName: attachment.originalFileName,
            fileSize: formatFileSize(attachment.fileSize)
          }))
        }));
        setFiles(formattedFiles);
      } catch (err) {
        console.error('Error:', err);
        setError('파일 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [courseId]);

  const handleDownloadFiles = async (items) => {
    try {
      const processedFiles = new Set(); // 중복 다운로드 방지를 위한 Set

      for (const item of items) {
        if (item.type === 'file') {
          const key = `${item.contentId}-${item.fileId}`;
          if (!processedFiles.has(key)) {
            processedFiles.add(key);
            const blob = await CourseFileAPI.downloadFile(courseId, item.contentId, item.fileId);
            const content = files.find(f => f.id.toString() === item.contentId.toString());
            const file = content?.files.find(f => f.id.toString() === item.fileId.toString());

            if (file && blob) {
              downloadFile(blob, file.originalFileName || file.name);
            }
          }
        } else if (item.type === 'content') {
          const content = files.find(f => f.id.toString() === item.id.toString());
          if (content && content.files.length > 0) {
            for (const file of content.files) {
              const key = `${content.id}-${file.id}`;
              if (!processedFiles.has(key)) {
                processedFiles.add(key);
                const blob = await CourseFileAPI.downloadFile(courseId, content.id, file.id);
                if (blob) {
                  downloadFile(blob, file.originalFileName || file.name);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error downloading files:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 파일 다운로드 헬퍼 함수
  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-red-500">{error}</div>
        </div>
    );
  }

  return (
      <FileArchiveList
          files={files}
          onDownload={handleDownloadFiles}
      />
  );
};

export default CourseFileArchiveContent;
