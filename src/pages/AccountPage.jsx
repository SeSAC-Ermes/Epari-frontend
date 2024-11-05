import React from 'react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar.jsx';
import AccountContent from '../components/AccountContent.jsx';

const AccountPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <AccountContent />
        </div>
      </div>
  );
};

export default AccountPage;
