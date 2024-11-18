import {BrowserRouter as Router, Outlet, Route, Routes} from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/course/CourseListPage.jsx";
import CourseDetailPage from "./pages/course/CourseDetailPage.jsx";
import CourseNoticeListPage from "./pages/CourseNoticeListPage.jsx";
import QnAListPage from "./pages/qna/QnAListPage.jsx";
import QnADetailPage from "./pages/qna/QnADetailPage.jsx";
import QnAWritePage from "./pages/qna/QnAWritePage.jsx";
import CurriculumPage from "./pages/course/CurriculumPage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import AssignmentDetailPage from "./pages/assignment/AssignmentDetailPage.jsx";
import CourseFilePage from "./pages/course/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/course/CourseFileCreatePage.jsx";
import CourseFileArchivePage from "./pages/course/CourseFileArchivePage.jsx";
import StudentManagementPage from "./pages/student/StudentManagementPage.jsx";
import MyProgressPage from "./pages/student/MyProgressPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';
import RootRedirect from "./components/auth/RootRedirect.jsx";
import SimpleLayout from "./components/layout/SimpleLayout.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import ExamPage from "./pages/exam/ExamPage.jsx";
import ExamCreatePage from "./pages/exam/ExamCreatePage.jsx";

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
              <Route path="notices" element={<CourseNoticeListPage/>}/>

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
                <Route index element={<ExamPage/>}/>
                <Route path="create" element={<ExamCreatePage/>}/>
                {/*<Route path="/courses/:courseId/exams/:examId" element={<ExamDetailPage/>}/>*/}
              </Route>

              {/* 파일/자료 */}
              <Route path="files">
                <Route index element={<CourseFileArchivePage/>}/>
                <Route path="create" element={<CourseFileCreatePage/>}/>
              </Route>

              {/* 강의 관리 */}
              <Route path="curriculum" element={<CurriculumPage/>}/>
              <Route path="activities" element={<CourseFilePage/>}/>

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
