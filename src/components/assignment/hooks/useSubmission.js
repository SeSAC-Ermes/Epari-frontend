import { useEffect, useState } from 'react';
import { SubmissionApi } from "../../../api/assignment/SubmissionApi.js";
import { AssignmentFileApi } from "../../../api/assignment/AssignmentFileApi.js";
import { SubmissionFileApi } from "../../../api/assignment/SubmissionFileApi.js";

export const useSubmission = (courseId, assignmentId) => {
  const [submission, setSubmission] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 파일 관련 상태
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchSubmission();
  }, [courseId, assignmentId]);

  const fetchSubmission = async () => {
    if (!courseId || !assignmentId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching submission...', { courseId, assignmentId });

      const data = await SubmissionApi.getSubmissionById(courseId, assignmentId);
      console.log('Submission data received:', data);

      if (data) {
        setSubmission(data);
        setDescription(data.description || '');
        if (data.files) {
          setExistingFiles(data.files);
        }
      }
      // data가 null이어도 에러로 처리하지 않음 (아직 제출하지 않은 상태)
      setError(null);
    } catch (err) {
      console.log('Error fetching submission:', err);
      if (err.response?.status !== 404) { // 404는 정상적인 상황이므로 에러 메시지 표시하지 않음
        setError('제출된 과제를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // FormData 직접 생성
      const formData = new FormData();
      formData.append('description', description);

      // 새로운 파일들 추가
      if (newFiles && newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await SubmissionApi.createSubmission(
          courseId,
          assignmentId,
          formData
      );

      if (response) {
        setSubmission(response);
        setDescription(response.description || '');
        setExistingFiles(response.files || []); // 여기서 파일 목록 업데이트
        setNewFiles([]); // 새 파일 목록 초기화
        alert(submission ? '과제가 성공적으로 수정되었습니다.' : '과제가 성공적으로 제출되었습니다.');

        // 제출물 정보 리프레시
        await fetchSubmission();  // 이 함수 추가
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || '과제 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (files) => {
    setNewFiles(files); // 이 함수가 전달되지 않았나봅니다
  };

  return {
    submission,
    description,
    setDescription,
    isSubmitting,
    error,
    isLoading,
    existingFiles,
    filesToRemove,
    newFiles,
    setNewFiles,
    fetchSubmission,
    handleSubmit,
    handleFilesChange,
    ...useFileHandling(courseId, assignmentId, submission, setExistingFiles, setFilesToRemove, setNewFiles)
  };
};

const useFileHandling = (courseId, assignmentId, submission, setExistingFiles, setFilesToRemove, setNewFiles) => {
  const handleFileDelete = async (fileId) => {
    try {
      if (!submission) return;

      // 먼저 API 호출로 실제 삭제
      await SubmissionFileApi.deleteFile(
          courseId,
          assignmentId,
          submission.id,
          fileId
      );

      // API 호출이 성공하면 UI 업데이트
      setFilesToRemove(prev => [...prev, fileId]);
      setExistingFiles(prev => prev.filter(file => file.id !== fileId));

    } catch (error) {
      console.error('파일 삭제 중 오류가 발생했습니다.', error);
      throw error; // 에러를 다시 던져서 상위에서 처리하도록
    }
  };

  const handleNewFileDelete = (index) => {
    setNewFiles(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const handleFileDownload = async (submissionId, fileId, fileName) => {
    try {
      await AssignmentFileApi.downloadFile(courseId, assignmentId, fileId, fileName);
    } catch (err) {
      console.error('파일 다운로드 중 오류가 발생했습니다.', err);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };


  return {
    handleFileDelete,
    handleNewFileDelete,
    handleFileDownload,
  };
};
