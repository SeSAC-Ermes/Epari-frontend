import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NoticeListPage from "./pages/NoticeListPage.jsx";
import CourseListPage from "./pages/lecture/CourseListPage.jsx";
import CourseDetailPage from "./pages/lecture/CourseDetailPage.jsx";
import LectureNoticeListPage from "./pages/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/QnAListPage.jsx";
import QnADetailPage from "./pages/QnADetailPage.jsx";
import QnAWritePage from "./pages/QnAWritePage.jsx";
import CurriculumPage from "./pages/lecture/CurriculumPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import CourseFilePage from "./pages/lecture/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/lecture/CourseFileCreatePage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';
import RootRedirect from "./components/auth/RootRedirect.jsx";
import AssignmentDetailPage from "./pages/assignment/AssignmentDetailPage.jsx";
import CourseFileArchivePage from "./pages/lecture/CourseFileArchivePage.jsx";
import SimpleLayout from "./components/layout/SimpleLayout.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

          {/* Protected Routes */}
          <Route element={
            <AuthProvider>
              <Outlet/>
            </AuthProvider>
          }>
            {/* Routes with Simple Layout */}
            <Route element={<SimpleLayout/>}>
              <Route path="/" element={<RootRedirect/>}/>
              <Route path="/courses" element={<CourseListPage/>}/>
            </Route>

            {/* Routes with Main Layout */}
            <Route element={<MainLayout/>}>
              <Route path="/courses/:courseId">
                <Route index element={<CourseDetailPage/>}/>
                <Route path="assignments">
                  <Route index element={<AssignmentPage/>}/>
                  <Route path="create" element={<AssignmentCreatePage/>}/>
                  <Route path=":assignmentId" element={<AssignmentDetailPage/>}/>
                </Route>
                <Route path="files">
                  <Route index element={<CourseFilePage/>}/>
                  <Route path="create" element={<CourseFileCreatePage/>}/>
                </Route>
                <Route path="file-archive" element={<CourseFileArchivePage/>}/>
              </Route>
              <Route path="/noticelist" element={<NoticeListPage/>}/>
              <Route path="/lecturenoticelist" element={<LectureNoticeListPage/>}/>
              <Route path="/qnalist">
                <Route index element={<QnAListPage/>}/>
                <Route path=":num" element={<QnADetailPage/>}/>
              </Route>
              <Route path="/qna/write" element={<QnAWritePage/>}/>
              <Route path="/curriculum" element={<CurriculumPage/>}/>
              <Route path="/account" element={<AccountPage/>}/>
              <Route path="/instructor/courses/:courseId/attendance" element={<AttendanceManagementPage/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
