import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Components
import Home from './components/pages/Home';
import JobsPage from './components/pages/JobPages';

// Admin Components
import AdminLogin from './components/pages/adminLogin';
import AdminRegister from './components/pages/adminRegister';
import AdminDashboard from './components/pages/DashBoards/AdminDashboard';
import PendingAlumniApprovals from './components/pages/pendingAluminiApprovals';

// Alumni Components
import AlumniLogin from './components/pages/aluminiSignin';
import AlumniRegister from './components/pages/aluminiSignup';

// Student Components
import StudentLogin from './components/Student/StudentSignIn';
import StudentRegister from './components/Student/StudentSignup';
import MyJobs from './components/pages/jobs/myjobs';
import PostJob from './components/pages/jobs/jobPost';
import EditJob from './components/pages/jobs/EditJob';
import StudentDashboard from './components/pages/DashBoards/StudentDashboard';
import JobDetails from './components/Student/jobDetails';
import AvailableAlumni from './components/pages/availabel-alumini';
import StudentApplications from './components/Student/StudentApplication';

// Protected Route Component
interface ProtectedRouteProps {
  role: string;
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, element }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated || (role && userRole !== role)) {
    return <Navigate to={`/${role}/login`} />;
  }
  
  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin" element={<AdminDashboard />} />
          } />
          <Route path="/admin/pending-alumni" element={
            <ProtectedRoute role="admin" element={<PendingAlumniApprovals />} />
          } />
          
          {/* Alumni Routes */}
          <Route path="/alumni/login" element={<AlumniLogin />} />
          <Route path="/alumni/register" element={<AlumniRegister />} />
         
          {/* Student Routes */}
          <Route path="/student/signin" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/alumni/dashboard" element={<MyJobs />} /> 
          <Route path="/alumni/post-job" element={<PostJob />} />
          <Route path="/alumni/my-jobs" element={<MyJobs />} />
          <Route path="/alumni/edit-job/:id" element={<EditJob />} /> {/* Route for editing a job */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/jobs/:id" element={<JobDetails />} />
          <Route path="admin/alumni" element={<AvailableAlumni />} />
          <Route path='/student/applications' element={<StudentApplications />} />
            
          {/* Fallback route */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;