import apiClient from "../axios.js";

export const fetchCurriculumEvents = async (courseId) => {
  const response = await apiClient.get(`/api/courses/${courseId}/curriculums`);
  return response.data;
};
