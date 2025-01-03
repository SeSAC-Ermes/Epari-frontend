import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import CourseListPage from "./pages/course/CourseListPage.jsx";
import CourseDetailPage from "./pages/course/CourseDetailPage.jsx";
import QnAListPage from "./pages/qna/QnAListPage.jsx";
import QnADetailPage from "./pages/qna/QnADetailPage.jsx";
import QnAWritePage from "./pages/qna/QnAWritePage.jsx";
import CurriculumPage from "./pages/course/CurriculumPage.jsx";
import AssignmentPage from "./pages/assignment/AssignmentPage.jsx";
import AssignmentCreatePage from "./pages/assignment/AssignmentCreatePage.jsx";
import AssignmentDetailPage from "./pages/assignment/AssignmentDetailPage.jsx";
import CourseFilePage from "./pages/course/CourseFilePage.jsx";
import CourseFileCreatePage from "./pages/course/CourseFileCreatePage.jsx";
import CourseFileArchivePage from "./pages/course/CourseFileArchivePage.jsx";
import StudentManagementPage from "./pages/student/StudentManagementPage.jsx";
import MyProgressPage from "./pages/student/MyProgressPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';
import RootRedirect from "./components/auth/RootRedirect.jsx";
import SimpleLayout from "./components/layout/SimpleLayout.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import AttendanceManagementPage from "./pages/attendance/AttendanceManagementPage.jsx";
import ExamPage from "./pages/exam/ExamPage.jsx";
import ResetPasswordForm from "./components/auth/ResetPasswordForm.jsx";
import MyPage from "./pages/mypage/MyPage.jsx";
import ChangePasswordForm from "./components/auth/ChangePasswordForm.jsx";
import PendingApprovalPage from "./pages/auth/PendingApprovalPage.jsx";
import ExamSubmissionPage from "./pages/exam/ExamSubmissionPage.jsx";
import ExamBasicSettingsPage from "./pages/exam/ExamBasicSettingsPage.jsx";
import ExamDetailPage from "./pages/exam/ExamDetailPage.jsx";
import ExamQuestionPage from "./pages/exam/ExamQuestionPage.jsx";
import ExamEditPage from "./pages/exam/ExamEditPage.jsx";
import SubmissionListPage from "./pages/assignment/SubmissionListPage.jsx";
import ExamResults from './components/exam/results/ExamResults.jsx';
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";
import NoticeWritePage from "./pages/notice/NoticeWritePage.jsx";
import NoticeListPage from "./pages/notice/NoticeListPage.jsx";
import NoticeDetailPage from "./pages/notice/NoticeDetailPage.jsx";
import NoticeEditContent from "./components/notice/NoticeEditContent.jsx";
import CourseFileOffsetContent from "./components/course/file/CourseFileOffsetContent.jsx";
import BoardListPage from "./pages/board/BoardListPage.jsx";
import BoardWritePage from "./pages/board/BoardWritePage.jsx";
import BoardDetailPage from "./pages/board/BoardDetailPage.jsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
          <Route path="/reset-password" element={<ResetPasswordForm/>}/>
          <Route path="/pending-approval" element={<PendingApprovalPage/>}/>

          {/* Protected Routes */}
          <Route element={<AuthProvider><Outlet/></AuthProvider>}>
            {/* Simple Layout - 코스 목록 */}
            <Route element={<SimpleLayout/>}>
              <Route path="/" element={<RootRedirect/>}/>
              <Route path="/courses" element={<CourseListPage/>}/>
              <Route path="/mypage" element={<MyPage/>}/>
              <Route path="/mypage/change-password" element={<ChangePasswordForm/>}/>

              {/* 전체 공지사항 */}
              <Route path="/notices">
                <Route index element={<NoticeListPage type="GLOBAL"/>}/>
                <Route path="create" element={
                  <ProtectedRoute requiredRoles={['ADMIN']}>
                    <NoticeWritePage type="GLOBAL"/>
                  </ProtectedRoute>
                }/>
                <Route path=":noticeId" element={<NoticeDetailPage type="GLOBAL"/>}/>
                <Route path=":noticeId/edit" element={<NoticeEditContent type="GLOBAL"/>}/>
              </Route>

              {/* 게시판 */}
              <Route path="/board">
                <Route index element={<BoardListPage />} />
                <Route path="write" element={<BoardWritePage />} />
                <Route path=":postId" element={<BoardDetailPage />} />
              </Route>
            </Route>

            {/* Main Layout - 코스 관련 */}
            <Route path="/courses/:courseId" element={<MainLayout/>}>
              <Route index element={<CourseDetailPage/>}/>

              {/* 강의 공지사항 */}
              <Route path="notices">
                <Route index element={<NoticeListPage type="COURSE"/>}/>
                <Route path="create" element={<NoticeWritePage type="COURSE"/>}/>
                <Route path=":noticeId" element={<NoticeDetailPage type="COURSE"/>}/>
                <Route path=":noticeId/edit" element={<NoticeEditContent type="COURSE"/>}/>
              </Route>

              {/* Q&A */}
              <Route path="qna">
                <Route index element={<QnAListPage/>}/>
                <Route path=":qnaId" element={<QnADetailPage/>}/>
                <Route path="write" element={<QnAWritePage/>}/>
              </Route>

              {/* 과제 */}
              <Route path="assignments">
                <Route index element={<AssignmentPage/>}/>
                <Route path="create" element={<AssignmentCreatePage/>}/>
                <Route path=":assignmentId">
                  <Route index element={<AssignmentDetailPage/>}/>
                  <Route path="submissions" element={<SubmissionListPage/>}/>
                </Route>
              </Route>

              {/* 시험 */}
              <Route path="exams">
                <Route index element={<ExamPage/>}/>
                <Route path="settings" element={<ExamBasicSettingsPage/>}/>
                <Route path=":examId" element={<ExamDetailPage/>}/>
                <Route path=":examId/questions" element={<ExamQuestionPage/>}/>
                <Route path=":examId/edit" element={<ExamEditPage/>}/>
                <Route path=":examId/take" element={<ExamSubmissionPage/>}/>
                <Route path=":examId/results" element={<ExamResults/>}/>
              </Route>

              {/* 파일/자료 */}
              <Route path="files">
                <Route index element={<CourseFileArchivePage/>}/>
                <Route path="create" element={<CourseFileCreatePage/>}/>
              </Route>

              {/* 강의 관리 */}
              <Route path="curriculum" element={<CurriculumPage/>}/>
              <Route path="activities" element={<CourseFilePage/>}/>

              {/* 오프셋 기반 페이지네이션 라우트 추가 */}
              <Route path="offset" element={<CourseFileOffsetContent/>}/>

              {/* 강사 전용 */}
              <Route path="attendance" element={<AttendanceManagementPage/>}/>
              <Route path="students" element={<StudentManagementPage/>}/>

              {/* 학생 전용 */}
              <Route path="my-progress" element={<MyProgressPage/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
  );
}


export default App;
