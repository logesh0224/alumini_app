import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import AlumniSignupPage from './components/pages/aluminiSignup';
import AdminLoginPage from './components/pages/signIn';
import StudentLogin from './components/pages/StudentSignIn';
import JobsPage from './components/pages/JobPages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumni-signup" element={<AlumniSignupPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path='/student-login' element={<StudentLogin/>} />
        <Route path='/student-loginn' element={<JobsPage/>} />

      </Routes>
    </Router>
  );
};

export default App;