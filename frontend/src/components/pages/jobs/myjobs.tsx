import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Building, Clock, Briefcase, DollarSign } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  posted: string;
  description: string;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * MyJobs is a React functional component responsible for displaying the jobs 
 * posted by the logged-in alumni. It allows users to search, filter, edit, 
 * and delete job postings. The component fetches job data from the server 
 * upon mounting and updates the UI based on the response. Users can filter 
 * jobs by type and location, as well as search by job title or company name. 
 * It handles navigation to other pages for editing and posting jobs.
 */

/******  3d22d804-3b85-4fbf-84a7-b0283940e95b  *******/const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/alumni/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.get('http://localhost:5000/api/jobs/my-jobs', config);
      setJobs(res.data.data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.delete(`http://localhost:5000/api/jobs/${id}`, config);

      // Remove the deleted job from state
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error(err);
    }
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/alumni/edit-job/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === 'all' || job.jobType.toLowerCase() === selectedType.toLowerCase()) &&
      (selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="text-center py-10">Loading your job postings...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              value={selectedLocation}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLocation(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Cochin">Cochin</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>

        {/* Post Job Button */}
        <div className="mb-8 text-right">
          <Link 
            to="/alumni/post-job" 
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post Job
          </Link>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't posted any jobs yet with that criteria</p>
              <Link 
                to="/alumni/post-job" 
                className="text-blue-500 hover:underline"
              >
                Post your job
              </Link>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <div className="flex items-center text-gray-500">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.jobType}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.posted}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{job.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <button 
                      onClick={() => handleDeleteJob(job._id)} 
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => handleEditJob(job._id)} 
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;