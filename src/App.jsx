import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/CourseListPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import NoticeListPage from "./pages/NoticeListPage.jsx";
import LectureNoticeListPage from "./pages/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/QnAListPage.jsx";
import QnADetailPage from "./pages/QnADetailPage.jsx";
import QnAWritePage from "./pages/QnAWritePage.jsx";
import CurriculumPage from "./pages/CurriculumPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AssignmentSubmitPage from "./pages/assignment/AssignmentSubmitPage.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/assignment" element={<AssignmentPage/>}/>
          <Route path="/assignmentcreate" element={<AssignmentCreatePage/>}/>
          <Route path="/assignmentsubmit" element={<AssignmentSubmitPage/>}/>
          <Route path="/courselist" element={<CourseListPage/>}/>
          <Route path="/coursedetail" element={<CourseDetailPage/>}/>
          <Route path="/noticelist" element={<NoticeListPage />} />
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
