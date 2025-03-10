import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'student' | 'admin';
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userType, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType={userType} onLogout={onLogout} />
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout