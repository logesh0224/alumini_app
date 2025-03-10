import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  GraduationCap, 
  Briefcase, 
  Clock, 
  MapPin, 
  Building, 
  ChevronRight, 
  BookOpen,
  FileCheck,
  User,
  Mail,
  Calendar,
  BookmarkPlus,
  TrendingUp,
  Award,
  Search
} from 'lucide-react';
import DashboardLayout from '../../Layout/Dashboard';

interface Student {
  name: string;
  email: string;
  department: string;
  graduationYear: string;
}

interface Application {
  status: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  createdAt: string;
}

interface Filters {
  search: string;
  jobType: string;
  location: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    jobType: '',
    location: ''
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [profileRes, applicationsRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students/me', config),
          axios.get('http://localhost:5000/api/students/applications', config),
          axios.get('http://localhost:5000/api/jobs')
        ]);

        setStudent(profileRes.data.data);
        setApplications(applicationsRes.data.data);
        setAllJobs(jobsRes.data.data);
        setFilteredJobs(jobsRes.data.data);
      } catch (err) {
        setError('Failed to load your information. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let result = allJobs;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) || 
        job.company.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.jobType) {
      result = result.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters.location) {
      result = result.filter(job => job.location === filters.location);
    }
    
    setFilteredJobs(result);
  }, [filters, allJobs]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      jobType: '',
      location: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto animate-bounce" />
            <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <User className="h-12 w-12 text-indigo-600 mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Please log in to view your dashboard.</p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeApplications = applications.filter(app => app.status !== 'rejected' && app.status !== 'withdrawn');

  return (
    <DashboardLayout userType="student" onLogout={handleLogout}>
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {student.name}!</h1>
              <p className="text-gray-600">Continue your career journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              <Award className="h-4 w-4 mr-1" />
              Student
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="h-5 w-5" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <BookOpen className="h-5 w-5" />
            <span>{student.department}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>Class of {student.graduationYear}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{applications.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Applications</h3>
          <div className="mt-2 flex items-center text-blue-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Applications submitted</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileCheck className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{activeApplications.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Active Applications</h3>
          <div className="mt-2 flex items-center text-green-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Currently in progress</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <BookmarkPlus className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{allJobs.length}</span>
          </div>
          <h3 className="text-lg font-semibold">Available Jobs</h3>
          <div className="mt-2 flex items-center text-purple-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Open positions</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              value={filters.search}
              onChange={handleFilterChange}
              name="search"
              className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Briefcase className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
            <select
              value={filters.jobType}
              onChange={handleFilterChange}
              name="jobType"
              className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="relative">
            <MapPin className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
            <select
              value={filters.location}
              onChange={handleFilterChange}
              name="location"
              className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
            >
              <option value="">All Locations</option>
              {[...new Set(allJobs.map(job => job.location))].map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <div
            key={job._id}
            className="group relative bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Building className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.jobType === 'Full-time' ? 'bg-blue-100 text-blue-800' :
                  job.jobType === 'Part-time' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.jobType}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to={`/student/jobs/${job._id}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;