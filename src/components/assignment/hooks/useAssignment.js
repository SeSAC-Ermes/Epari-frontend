import { useState } from 'react';
import { AssignmentAPI } from "../../../api/assignment/AssignmentApi.js";
import { FileAPI } from "../../../api/assignment/FileApi.js";

export const useAssignmentState = () => {
  const [assignments, setAssignments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);

  // 수정 관련 상태
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [files, setFiles] = useState([]);

  return {
    assignments, setAssignments,
    expandedId, setExpandedId,
    editingId, setEditingId,
    instructorId, setInstructorId,
    isSubmitting, setIsSubmitting,
    isLoading, setIsLoading,
    error, setError,
    existingFiles, setExistingFiles,
    filesToRemove, setFilesToRemove,
    isInstructor, setIsInstructor,
    editTitle, setEditTitle,
    editContent, setEditContent,
    editDueDate, setEditDueDate,
    files, setFiles
  };
};

export const useAssignmentActions = (courseId, state, setState) => {
  const fetchAssignments = async () => {
    try {
      setState.setIsLoading(true);
      const data = await AssignmentAPI.getAssignments(courseId);
      setState.setAssignments(data);
    } catch (err) {
      setState.setError('과제 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching assignments:', err);
    } finally {
      setState.setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e, assignmentId) => {
    e.preventDefault();
    setState.setError(null);

    if (!state.editTitle.trim() || !state.editContent.trim() || !state.editDueDate.trim()) {
      setState.setError('모든 필드를 입력해 주세요.');
      return;
    }

    try {
      setState.setIsSubmitting(true);

      for (const fileId of state.filesToRemove) {
        await FileAPI.deleteFile(courseId, assignmentId, fileId);
      }

      await AssignmentAPI.updateAssignment(
          courseId,
          assignmentId,
          {
            title: state.editTitle,
            description: state.editContent,
            dueDate: state.editDueDate,
            files: state.files
          },
          state.instructorId
      );

      await fetchAssignments();
      handleCancelEdit();
      alert('과제가 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('Update Error:', err);
      setState.setError(err.response?.data?.message || '과제 수정 중 오류가 발생했습니다.');
    } finally {
      setState.setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setState.setEditingId(null);
    setState.setEditTitle('');
    setState.setEditContent('');
    setState.setEditDueDate('');
    setState.setFiles([]);
    setState.setExistingFiles([]);
    setState.setFilesToRemove([]);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('정말로 이 과제를 삭제하시겠습니까? 첨부된 파일도 함께 삭제됩니다.')) {
      return;
    }

    try {
      if (!state.instructorId) {
        throw new Error('강사 정보를 찾을 수 없습니다.');
      }

      await AssignmentAPI.deleteAssignment(courseId, assignmentId, state.instructorId);
      setState.setAssignments(prev => prev.filter(a => a.id !== assignmentId));

      if (state.expandedId === assignmentId) {
        setState.setExpandedId(null);
      }
      if (state.editingId === assignmentId) {
        handleCancelEdit();
      }

      alert('과제가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('과제 삭제 중 오류가 발생했습니다.');
    }
  };

  return {
    fetchAssignments,
    handleUpdateSubmit,
    handleCancelEdit,
    handleDeleteAssignment
  };
};

export const useAuth = () => {
  const getIsInstructorFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload['cognito:groups']?.includes('INSTRUCTOR') || false;
    } catch (e) {
      console.error('Token parsing error:', e);
      return false;
    }
  };

  return { getIsInstructorFromToken };
};

export const useFileHandling = (courseId) => {
  const handleDownloadFile = async (assignmentId, fileId, fileName) => {
    try {
      const downloadUrl = await FileAPI.getFileDownloadUrl(courseId, assignmentId, fileId);

      // fetch로 파일을 가져옵니다
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // FileSaver.js 라이브러리를 사용하거나 아래 방식으로 다운로드
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 파일명 지정
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFile = (fileId, setState) => {
    setState.setFilesToRemove(prev => [...prev, fileId]);
    setState.setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFilesChange = (newFiles, setState) => {
    setState.setFiles(newFiles);
  };

  return {
    handleDownloadFile,
    handleDeleteFile,
    handleFilesChange
  };
};
