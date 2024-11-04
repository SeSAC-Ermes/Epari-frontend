import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-5">
        <h1 className="text-3xl text-gray-700">SeSAC Home Page</h1>
        <Link
            to="/exams"
            className="px-6 py-3 bg-green-500 text-white no-underline rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Go to Exams
        </Link>
      </div>
  );
};

export default Home;
