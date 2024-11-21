import React from 'react';
import CourseFileCreateContent from '../../components/course/file/CourseFileCreateContent.jsx';
import { withPageAuth } from '../../auth/WithAuth.jsx';

const CourseFileCreatePage = () => {
  return (
      <CourseFileCreateContent/>
  );
};

export default withPageAuth(CourseFileCreatePage, 'COURSE_MATERIAL_UPLOAD')
