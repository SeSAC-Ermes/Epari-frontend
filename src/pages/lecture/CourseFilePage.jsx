import React from 'react';
import CourseFileContent from '../../components/lecture/file/CourseFileContent.jsx';
import { useSearchParams } from 'react-router-dom';

const CourseFilePage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  return (
      <CourseFileContent courseId={courseId}/>
  );
};

export default CourseFilePage;
