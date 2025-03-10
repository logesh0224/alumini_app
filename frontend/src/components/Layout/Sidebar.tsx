import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
 
  GraduationCap,
 
 
  LogOut,

  FileCheck,
 
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  userType: 'student' | 'admin';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, onLogout }) => {
  const location = useLocation();

  const studentLinks = [
    { path: '/student/dashboard', icon: Home, label: 'Home' },
    { path: '/student/applications', icon: FileCheck, label: 'Applications' },
      ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Home' },
    { path: '/admin/alumni', icon: GraduationCap, label: 'Alumni' },
    
  ];

  const links = userType === 'student' ? studentLinks : adminLinks;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">
            {userType === 'student' ? 'Student Portal' : 'Admin Portal'}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;