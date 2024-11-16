import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/lecture/CourseListPage.jsx";
import CourseDetailPage from "./pages/lecture/CourseDetailPage.jsx";
import LectureNoticeListPage from "./pages/notice/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/qna/QnAListPage.jsx";
import QnADetailPage from "./pages/qna/QnADetailPage.jsx";
import QnAWritePage from "./pages/qna/QnAWritePage.jsx";
import CurriculumPage from "./pages/lecture/CurriculumPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import CourseFilePage from "./pages/lecture/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/lecture/CourseFileCreatePage.jsx";
import CourseFileContent from "./components/lecture/file/CourseFileContent.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';
import RootRedirect from "./components/auth/RootRedirect.jsx";
import AssignmentDetailPage from "./pages/assignment/AssignmentDetailPage.jsx";
import CourseFileArchivePage from "./pages/lecture/CourseFileArchivePage.jsx";
import NoticeDetailPage from "./pages/notice/NoticeDetailPage.jsx";
import NoticeListPage from "./pages/notice/NoticeListPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>

          {/* Protected Routes - wrapped with AuthProvider */}
          <Route path="/*" element={
            <AuthProvider>
              <Routes>
                <Route path="/" element={<RootRedirect/>}/>
                <Route path="/courses/:courseId/assignments" element={<AssignmentPage/>}/>
                <Route path="/courses/:courseId/assignments/create" element={<AssignmentCreatePage/>}/>
                <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentDetailPage/>}/>
                <Route path="/courses" element={<CourseListPage/>}/>
                <Route path="/courses/:courseId" element={<CourseDetailPage/>}/>
                <Route path="/courses/:courseId/files" element={<CourseFilePage/>}/>
                <Route path="/courses/:courseId/files/create" element={<CourseFileCreatePage/>}/>
                <Route path="/courses/:courseId/files/:fileId" element={<CourseFileContent/>}/>
                <Route path="/courses/:courseId/file-archive" element={<CourseFileArchivePage/>}/>

                <Route path="/notices/:noticeId" element={<NoticeDetailPage/>}/>

                <Route path="/noticelist" element={<NoticeListPage/>}/>
                <Route path="/notice/:id" element={<NoticeDetailPage/>}/>
                <Route path="/courses/:courseId/notices" element={<LectureNoticeListPage/>}/>
                
                <Route path="/qnalist" element={<QnAListPage/>}/>
                <Route path="/qna/write" element={<QnAWritePage/>}/>
                <Route path="/qnalist/:num" element={<QnADetailPage/>}/>
                <Route path="/curriculum" element={<CurriculumPage/>}/>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/instructor/courses/:courseId/attendance" element={<AttendanceManagementPage/>}/>
                <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
              </Routes>
            </AuthProvider>
          }/>
        </Routes>
      </Router>
  );
}

export default App;
