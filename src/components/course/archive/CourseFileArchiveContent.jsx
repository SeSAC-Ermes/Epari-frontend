import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FileArchiveList from './FileArchiveList.jsx';
import { CourseFileAPI } from '../../../api/course/courseFileAPI.js';

/**
 * 강의 자료실 컨텐츠를 관리하는 컴포넌트
 * 자료실 다운로드 관리와 검색, 무한 스크롤 기능 제공
 */

const CourseFileArchiveContent = () => {
  const { courseId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [cursorDate, setCursorDate] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fetchFiles = async (isNewSearch = false) => {
    try {
      setLoading(true);
      let response;

      // 새로운 검색이면 커서 초기화
      const currentCursorId = isNewSearch ? null : cursorId;
      const currentCursorDate = isNewSearch ? null : cursorDate;

      if (searchTerm) {
        response = await CourseFileAPI.searchCourseFiles(
            courseId,
            { title: searchTerm, content: searchTerm },
            currentCursorId,
            currentCursorDate
        );
      } else {
        response = await CourseFileAPI.getCourseFiles(
            courseId,
            currentCursorId,
            currentCursorDate
        );
      }

      // hasNext 상태 업데이트
      setHasMore(response.hasNext);

      // 커서 정보 업데이트
      if (response.cursor) {
        setCursorId(response.cursor.id);
        setCursorDate(response.cursor.date);
      }

      // API 응답을 원하는 형태로 변환
      const formattedFiles = response.contents.map(file => ({
        id: file.id,
        title: file.title,
        content: file.content,
        createdAt: file.date,
        instructor: file.instructor,
        files: file.files.map(attachment => ({
          id: attachment.id,
          originalFileName: attachment.originalFileName,
          fileSize: formatFileSize(attachment.fileSize)
        }))
      }));

      // 새로운 검색이면 데이터 교체, 아니면 추가
      setFiles(prevFiles => isNewSearch ? formattedFiles : [...prevFiles, ...formattedFiles]);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('파일 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 검색어 변경 시 처리
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCursorId(null);
      setCursorDate(null);
      setHasMore(true);
      fetchFiles(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 무한 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
          window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight - 100
      ) {
        if (hasMore && !loading) {
          fetchFiles(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, cursorId, cursorDate]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchFiles(true);
  }, [courseId]);

  const handleDownloadFiles = async (items) => {
    try {
      const processedFiles = new Set();

      for (const item of items) {
        if (item.type === 'file') {
          const content = files.find(f => f.id.toString() === item.contentId.toString());
          const file = content?.files.find(f => f.id.toString() === item.fileId.toString());

          if (file) {
            const key = `${item.contentId}-${item.fileId}`;
            if (!processedFiles.has(key)) {
              processedFiles.add(key);
              await CourseFileAPI.downloadFile(
                  courseId,
                  item.contentId,
                  item.fileId,
                  file.originalFileName
              );
              await new Promise(resolve => setTimeout(resolve, 500)); // 다운로드 간 지연
            }
          }
        } else if (item.type === 'content') {
          const content = files.find(f => f.id.toString() === item.id.toString());
          if (content && content.files.length > 0) {
            for (const file of content.files) {
              const key = `${content.id}-${file.id}`;
              if (!processedFiles.has(key)) {
                processedFiles.add(key);
                await CourseFileAPI.downloadFile(
                    courseId,
                    content.id,
                    file.id,
                    file.originalFileName
                );
                await new Promise(resolve => setTimeout(resolve, 500)); // 다운로드 간 지연
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

  if (initialLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
    );
  }

  if (error && files.length === 0) {
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
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          loading={loading}
          hasMore={hasMore}
      />
  );
};

export default CourseFileArchiveContent;
