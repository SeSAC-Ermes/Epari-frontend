import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import AssignmentSubmitPage from "./pages/assignment/AssignmentSubmitPage.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import CourseFilePage from "./pages/lecture/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/lecture/CourseFileCreatePage.jsx";
import CourseFileContent from "./components/lecture/file/CourseFileContent.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/assignment" element={<AssignmentPage/>}/>
          <Route path="/assignmentcreate" element={<AssignmentCreatePage/>}/>
          <Route path="/assignmentsubmit" element={<AssignmentSubmitPage/>}/>
          <Route path="/courses" element={<CourseListPage/>}/>
          <Route path="/courses/:courseId" element={<CourseDetailPage/>}/>
          <Route path="/courses/:courseId/files" element={<CourseFilePage/>}/>
          <Route path="/courses/:courseId/files/create" element={<CourseFileCreatePage/>}/>
          <Route path="/courses/:courseId/files/:fileId" element={<CourseFileContent/>}/>
          <Route path="/noticelist" element={<NoticeListPage/>}/>
          <Route path="/lecturenoticelist" element={<LectureNoticeListPage/>}/>
          <Route path="/qnalist" element={<QnAListPage/>}/>
          <Route path="/qna/write" element={<QnAWritePage/>}/>
          <Route path="/qnalist/:num" element={<QnADetailPage/>}/>
          <Route path="/curriculum" element={<CurriculumPage/>}/>
          <Route path="/account" element={<AccountPage/>}/>
          <Route path="/instructor/lectures/:lectureId/attendance" element={<AttendanceManagementPage/>}/>
        </Routes>
      </Router>
  );
}

export default App;
