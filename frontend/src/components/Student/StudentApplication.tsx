import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye, Briefcase } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  deadline: string;
  postedBy: {
    name: string;
    email: string;
    batch: string;
  };
}

interface Application {
  _id: string;
  job: Job;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  resume: string;
  coverLetter: string;
}

const StudentApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/students/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setApplications(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch applications');
        console.error('Error fetching applications:', err);
        setApplications([]); // Ensure applications is set to an empty array
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
      case 'reviewed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center"><Eye className="w-3 h-3 mr-1" /> Reviewed</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
        <Link to="/student/jobs" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
       
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((application) => (
          <div key={application._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                    {application.job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{application.job.company} • {application.job.location}</p>
                </div>
                {getStatusBadge(application.status)}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Applied: {formatDate(application.appliedAt)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Deadline: {formatDate(application.job.deadline)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
  <div className="flex items-center text-sm">
    <span className="text-gray-600">Posted by:</span>
    {application.job.postedBy ? (
      <>
        <span className="ml-2 font-medium text-gray-900">{application.job.postedBy.name}</span>
        <span className="ml-2 text-gray-500">Batch {application.job.postedBy.batch}</span>
      </>
    ) : (
      <span className="ml-2 text-gray-500">Unknown</span>
    )}
  </div>
</div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3">
              {/* Footer content */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentApplications;