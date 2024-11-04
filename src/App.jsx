import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ExamPage from './pages/exam/ExamPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exams" element={<ExamPage />} />
        </Routes>
      </Router>
  );
}

export default App;
