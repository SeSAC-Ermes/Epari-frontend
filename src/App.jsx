import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/lecture/CourseListPage.jsx";
import CourseDetailPage from "./pages/lecture/CourseDetailPage.jsx";
import LectureNoticeListPage from "./pages/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/QnAListPage.jsx";
import QnADetailPage from "./pages/QnADetailPage.jsx";
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
          <Route element={<AuthProvider><Outlet/></AuthProvider>}>
            {/* Simple Layout - 코스 목록 */}
            <Route element={<SimpleLayout/>}>
              <Route path="/" element={<RootRedirect/>}/>
              <Route path="/courses" element={<CourseListPage/>}/>
            </Route>

            {/* Main Layout - 코스 관련 */}
            <Route path="/courses/:courseId" element={<MainLayout/>}>
              <Route index element={<CourseDetailPage/>}/>
              <Route path="notices" element={<LectureNoticeListPage/>}/>
              <Route path="qna">
                <Route index element={<QnAListPage/>}/>
                <Route path=":num" element={<QnADetailPage/>}/>
              </Route>
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
              <Route path="attendance" element={<AttendanceManagementPage/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
