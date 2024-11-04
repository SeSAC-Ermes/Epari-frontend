import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExamPage from './pages/exam/ExamPage';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/CourseListPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LectureNoticeListPage from "./pages/LectureNoticeListPage.jsx";
import QnAListPage from "./pages/QnAListPage.jsx";
import CurriculumPage from "./pages/CurriculumPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/courselist" element={<CourseListPage/>}/>
          <Route path="/coursedetail" element={<CourseDetailPage />} />
          <Route path="/lecturenoticelist" element={<LectureNoticeListPage />} />
          <Route path="/qnalist" element={<QnAListPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Router>
  );
}

export default App;
