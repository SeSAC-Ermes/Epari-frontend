/**
 * 날짜를 한국 형식으로 포맷팅
 * @param {string | Date} dateString - 날짜 문자열 또는 Date 객체
 * @param {boolean} includeTime - 시간 포함 여부 (기본값: false)
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

/**
 * D-Day 계산 및 상태 반환
 * @param {string | Date} deadline - 마감일
 * @returns {{text: string, class: string}} D-Day 텍스트와 스타일 클래스
 */
export const calculateDday = (deadline) => {
  const today = new Date();
  const dueDate = new Date(deadline);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: '마감', class: 'bg-gray-100 text-gray-600' };
  } else if (diffDays === 0) {
    return { text: 'D-Day', class: 'bg-red-100 text-red-600' };
  } else {
    return { text: `D-${diffDays}`, class: 'bg-blue-100 text-blue-600' };
  }
};

/**
 * 과제 상태 확인
 * @param {string | Date} deadline - 마감일
 * @returns {{text: string, class: string}} 상태 텍스트와 스타일 클래스
 */
export const getAssignmentStatus = (deadline) => {
  const today = new Date();
  const dueDate = new Date(deadline);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (today > dueDate) {
    return { text: '과제 확인', class: 'bg-gray-100 text-gray-600' };
  } else {
    return { text: '과제 진행 중', class: 'bg-green-100 text-green-600' };
  }
};

/**
 * 날짜 문자열을 ISO 형식으로 변환
 * @param {string} dateString - 날짜 문자열
 * @returns {string} ISO 형식의 날짜 문자열
 */
export const formatToISOString = (dateString) => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 0);
  return date.toISOString().split('.')[0];
};
