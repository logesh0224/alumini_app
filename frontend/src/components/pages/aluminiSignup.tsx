import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Briefcase } from 'lucide-react';
import axios from 'axios';

const AlumniRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    company: '',
    position: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, graduationYear, company, position } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/alumni/register', {
        name,
        email,
        password,
        graduationYear: parseInt(graduationYear),
        company,
        position
      });

      setSuccess(res.data.message);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        graduationYear: '',
        company: '',
        position: ''
      });

      // Redirect to login after 1 second
      setTimeout(() => {
        navigate('/alumni/login');
      }, 1000);

    } catch (err) {
        //@ts-ignore
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
     style={{
       backgroundImage: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)'
     }}>   <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Alumni Registration</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">Full Name</label>
              <Mail className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="sr-only">Email address</label>
              <Mail className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <label htmlFor="graduationYear" className="sr-only">Graduation Year</label>
              <Briefcase className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                required
                min="1900"
                max="2099"
                value={graduationYear}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Graduation Year"
              />
            </div>

            <div className="relative">
              <label htmlFor="company" className="sr-only">Current Company</label>
              <Briefcase className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="company"
                name="company"
                type="text"
                required
                value={company}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Company"
              />
            </div>

            <div className="relative">
              <label htmlFor="position" className="sr-only">Current Position</label>
              <Briefcase className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="position"
                name="position"
                type="text"
                required
                value={position}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Position"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="password"
                name="password"
                type="password"
                required
                  //@ts-ignore
                minLength="6"
                value={password}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <Lock className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                //@ts-ignore
                minLength="6"
                value={confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Register as Alumni'}
            </button>
          </div>

          <div className="mt-4 text-center text-gray-600">
            Already have an account? <Link to="/alumni/login" className="text-blue-500">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumniRegister;
