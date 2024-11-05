import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CourseList from "./pages/CourseList.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AssignmentSubmitPage from "./pages/assignment/AssignmentSubmitPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<CourseList/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/assign" element={<AssignmentPage/>}/>
          <Route path="/assignsubmit" element={<AssignmentSubmitPage/>}/>
        </Routes>
      </Router>
  );
}

export default App;
