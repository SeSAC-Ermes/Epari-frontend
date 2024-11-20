import { AssignmentFileApi } from "../../../api/assignment/AssignmentFileApi.js";
import {downloadFileFromUrl} from "../../../utils/FileDownloadUtils.js";

export const useFileHandling = (courseId, assignmentId) => {
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await AssignmentFileApi.getFileDownloadUrl(courseId, assignmentId, fileId);
      const presignedUrl = response.data;
      await downloadFileFromUrl(presignedUrl, fileName);
    } catch (error) {
      console.error('파일 다운로드 중 오류가 발생했습니다:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return {
    handleDownloadFile
  };
};
