import axios from 'axios';

const AssignmentAPI = () => {
  const API_URL = 'http://localhost:8080/api/assignments';

  // 인증 토큰을 가져오는 함수
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`} : {};
  };

  // axios 인스턴스 생성
  const axiosInstance = axios.create({
    baseURL: API_URL, headers: {
      'Content-Type': 'application/json',
    }
  });

  // 요청 인터셉터 추가
  axiosInstance.interceptors.request.use((config) => {
    const headers = getAuthHeader();
    config.headers = {...config.headers, ...headers};
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // 과제 생성
  const createAssignment = async (assignmentData) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);

      const formattedDate = date.toISOString().split('.')[0];

      const requestData = {
        title: assignmentData.title, description: assignmentData.description, deadline: formattedDate, score: 0
      };

      console.log('Sending assignment data:', requestData);

      const response = await axiosInstance.post('', requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error creating assignment:', error);
      throw new Error('과제 생성 중 오류가 발생했습니다.');
    }
  };

  // 파일 업로드
  const uploadFiles = async (files, assignmentId) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (assignmentId) {
        formData.append('assignmentId', assignmentId);
      }

      const response = await axiosInstance.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', ...getAuthHeader()
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error uploading files:', error);
      throw new Error('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  // 과제 목록 조회
  const getAssignments = async () => {
    try {
      const response = await axiosInstance.get('');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error fetching assignments:', error);
      throw new Error('과제 목록 조회 중 오류가 발생했습니다.');
    }
  };

  // 과제 상세 조회
  const getAssignmentById = async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error fetching assignment:', error);
      throw new Error('과제 상세 조회 중 오류가 발생했습니다.');
    }
  };

  // 과제 수정
  const updateAssignment = async (id, assignmentData) => {
    try {
      const date = new Date(assignmentData.dueDate);
      date.setHours(23, 59, 59, 0);

      const formattedDate = date.toISOString().split('.')[0];

      const response = await axiosInstance.put(`/${id}`, {
        title: assignmentData.title,
        description: assignmentData.description,
        deadline: formattedDate,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error updating assignment:', error);
      throw new Error('과제 수정 중 오류가 발생했습니다.');
    }
  };

  // 과제 삭제
  const deleteAssignment = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }
      console.error('Error deleting assignment:', error);
      throw new Error('과제 삭제 중 오류가 발생했습니다.');
    }
  };

  return {
    createAssignment, uploadFiles, getAssignments, getAssignmentById, updateAssignment, deleteAssignment
  };
};

export default AssignmentAPI;
