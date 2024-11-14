import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/lecture/CourseListPage.jsx";
import CourseDetailPage from "./pages/lecture/CourseDetailPage.jsx";
import LectureNoticeListPage from "./pages/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/QnAListPage.jsx";
import QnADetailPage from "./pages/QnADetailPage.jsx";
import QnAWritePage from "./pages/QnAWritePage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import AssignmentDetailPage from "./pages/assignment/AssignmentDetailPage.jsx";
import CourseFilePage from "./pages/lecture/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/lecture/CourseFileCreatePage.jsx";
import CourseFileArchivePage from "./pages/lecture/CourseFileArchivePage.jsx";
import CurriculumPage from "./pages/lecture/CurriculumPage.jsx";
import StudentManagementPage from "./pages/student/StudentManagementPage.jsx";
import MyProgressPage from "./pages/student/MyProgressPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';
import RootRedirect from "./components/auth/RootRedirect.jsx";
import SimpleLayout from "./components/layout/SimpleLayout.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import LearningActivitiesPage from "./pages/learning/LearningActivitiesPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

          {/* Protected Routes */}
          <Route element={<AuthProvider><Outlet/></AuthProvider>}>
            {/* Simple Layout - 코스 목록 */}
            <Route element={<SimpleLayout/>}>
              <Route path="/" element={<RootRedirect/>}/>
              <Route path="/courses" element={<CourseListPage/>}/>
            </Route>

            {/* Main Layout - 코스 관련 */}
            <Route path="/courses/:courseId" element={<MainLayout/>}>
              <Route index element={<CourseDetailPage/>}/>

              {/* 공지사항 */}
              <Route path="notices" element={<LectureNoticeListPage/>}/>

              {/* Q&A */}
              <Route path="qna">
                <Route index element={<QnAListPage/>}/>
                <Route path=":qnaId" element={<QnADetailPage/>}/>
                <Route path="write" element={<QnAWritePage/>}/>
              </Route>

              {/* 과제 */}
              <Route path="assignments">
                <Route index element={<AssignmentPage/>}/>
                <Route path="create" element={<AssignmentCreatePage/>}/>
                <Route path=":assignmentId" element={<AssignmentDetailPage/>}/>
              </Route>

              {/* 시험 */}
              <Route path="exams">
              </Route>

              {/* 파일/자료 */}
              <Route path="files">
                <Route index element={<CourseFilePage/>}/>
                <Route path="create" element={<CourseFileCreatePage/>}/>
              </Route>
              <Route path="file-archive" element={<CourseFileArchivePage/>}/>

              {/* 강의 관리 */}
              <Route path="curriculum" element={<CurriculumPage/>}/>
              <Route path="activities" element={<LearningActivitiesPage/>}/>

              {/* 강사 전용 */}
              <Route path="attendance" element={<AttendanceManagementPage/>}/>
              <Route path="students" element={<StudentManagementPage/>}/>

              {/* 학생 전용 */}
              <Route path="my-progress" element={<MyProgressPage/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
