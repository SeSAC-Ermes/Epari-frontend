import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CourseList from "./pages/CourseList.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/courselist" element={<CourseList/>}/>
        </Routes>
      </Router>
  );
}

export default App;
