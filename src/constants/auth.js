/**
 * 권한 관련 상수와 타입 관리
 */

// 사용자 역할 정의
export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT'
});

// 페이지별 접근 권한 매핑
export const PAGE_PERMISSIONS = Object.freeze({

  // 강의 관련
  COURSE_LIST: [ROLES.INSTRUCTOR, ROLES.STUDENT],
  COURSE_MANAGEMENT: [ROLES.INSTRUCTOR],
  COURSE_CREATION: [ROLES.INSTRUCTOR],

  // 출석 관련
  ATTENDANCE_VIEW: [ROLES.INSTRUCTOR, ROLES.STUDENT],
  ATTENDANCE_MANAGEMENT: [ROLES.INSTRUCTOR],

  // 과제 관련
  ASSIGNMENT_LIST: [ROLES.INSTRUCTOR, ROLES.STUDENT],
  ASSIGNMENT_CREATION: [ROLES.INSTRUCTOR],
  ASSIGNMENT_SUBMISSION: [ROLES.STUDENT],

  // QnA 관련
  QNA_LIST: [ROLES.INSTRUCTOR, ROLES.STUDENT],
  QNA_CREATION: [ROLES.STUDENT],
  QNA_RESPONSE: [ROLES.INSTRUCTOR]
});

// 기능별 권한 매핑
export const FEATURE_PERMISSIONS = Object.freeze({
  // 강의 관련 기능
  EDIT_COURSE: [ROLES.INSTRUCTOR],
  DELETE_COURSE: [ROLES.INSTRUCTOR],

  // 출석 관련 기능
  MARK_ATTENDANCE: [ROLES.INSTRUCTOR],
  VIEW_ATTENDANCE_STATS: [ROLES.INSTRUCTOR],

  // 과제 관련 기능
  GRADE_ASSIGNMENT: [ROLES.INSTRUCTOR],
  SUBMIT_ASSIGNMENT: [ROLES.STUDENT],

  // QnA 관련 기능
  ANSWER_QUESTION: [ROLES.INSTRUCTOR],
  ASK_QUESTION: [ROLES.STUDENT]
});
