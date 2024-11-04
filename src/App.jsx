import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExamPage from './pages/exam/ExamPage';
import React from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CourseList from "./pages/CourseList.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/courselist" element={<CourseList/>}/>
        </Routes>
      </Router>
  );
}

export default App;
