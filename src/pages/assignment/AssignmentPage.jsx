import React from 'react';
import AssignmentDetail from '../../components/assignment/AssignmentDetail.jsx';
import { withPageAuth } from "../../auth/WithAuth.jsx";

/**
 * 과제 리스트페이지
 */

const AssignmentPage = () => {
  return (
      <AssignmentDetail/>
  );
};

export default withPageAuth(AssignmentPage, 'ASSIGNMENT_LIST');
