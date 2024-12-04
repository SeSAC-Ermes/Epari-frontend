import React from 'react';
import SubmissionList from "../../components/assignment/SubmissionList.jsx";
import { withPageAuth } from "../../auth/WithAuth.jsx";

/**
 * 과제 리스트페이지
 */
const SubmissionListPage = () => {
  return (
      <SubmissionList/>
  );
};

export default withPageAuth(SubmissionListPage, 'SUBMISSION_LIST');
