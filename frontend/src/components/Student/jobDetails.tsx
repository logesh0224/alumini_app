import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  GraduationCap, Briefcase, Clock, MapPin, Building, 
  ChevronRight, Linkedin, FileText,
  Calendar, DollarSign, Users, Globe, X
} from 'lucide-react';

interface Job {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  experience: string;
  deadline: string;
  description: string;
  requirements: string;
  companyDescription: string;
  companyWebsite: string;
}

interface FormData {
  resume: File | null;
  linkedinUrl: string;
  yearsOfExperience: string;
  coverLetter: string;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    resume: null,
    linkedinUrl: '',
    yearsOfExperience: '',
    coverLetter: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const jobRes = await axios.get(`http://localhost:5000/api/students/jobs/${id}`, config);
        setJob(jobRes.data.data);
        
        const applicationRes = await axios.get(`http://localhost:5000/api/students/applications/check/${id}`, config);
        setAlreadyApplied(applicationRes.data.applied);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, navigate]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData({
        ...formData,
        resume: file
      });
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }
      formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      formDataToSend.append('yearsOfExperience', formData.yearsOfExperience);
      formDataToSend.append('coverLetter', formData.coverLetter);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      await axios.post(
        `http://localhost:5000/api/students/applications/${id}`, 
        formDataToSend,
        config
      );
      
      setSuccessMessage('Application submitted successfully!');
      setShowModal(false);
      setAlreadyApplied(true);
    } catch (err) {
      //@ts-ignore
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto animate-bounce" />
          <p className="mt-4 text-lg text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Job not found or you don't have permission to view it.
        </div>
        <div className="mt-4">
          <Link to="/student/dashboard" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/student/dashboard" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Jobs
          </Link>
         
        </div>
        
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <Building className="h-5 w-5 mr-2" />
                  <span className="font-medium mr-2">{job.company}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
             
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-blue-700">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span className="font-medium">Job Type</span>
                </div>
                <p className="mt-1 text-gray-900">{job.jobType}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span className="font-medium">Salary</span>
                </div>
                <p className="mt-1 text-gray-900">{job.salary || 'Not specified'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center text-purple-700">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">Experience</span>
                </div>
                <p className="mt-1 text-gray-900">{job.experience || 'Not specified'}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center text-orange-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">Deadline</span>
                </div>
                <p className="mt-1 text-gray-900">{new Date(job.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="whitespace-pre-line text-gray-700">{job.description}</div>
            </div>

            {job.requirements && (
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <div className="whitespace-pre-line text-gray-700">{job.requirements}</div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About the Company</h2>
              <div className="flex items-start gap-4">
               
                <div>
                  <h3 className="text-lg font-medium">{job.company}</h3>
                  <p className="text-gray-600 mt-1">{job.companyDescription || 'No company description available.'}</p>
                  {job.companyWebsite && (
                    <a 
                      href={job.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t bg-gray-50 px-8 py-6">
            {alreadyApplied ? (
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center text-blue-700 mb-2">
                  <Clock className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">Application Submitted</h3>
                </div>
                <p className="text-gray-700">Your application is currently under review. We'll notify you of any updates.</p>
              </div>
            ) : new Date(job.deadline) < new Date() ? (
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex items-center text-gray-700 mb-2">
                  <Clock className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">Job Posting Expired</h3>
                </div>
                <p className="text-gray-600">
                  This position is no longer accepting applications. 
                  The deadline was {new Date(job.deadline).toLocaleDateString()}.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Apply for this Position
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-gray-600">{job.company} • {job.location}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (PDF)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="resume"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://linkedin.com/in/yourprofile"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-7">5-7 years</option>
                    <option value="7+">7+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    rows={6}
                    value={formData.coverLetter}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Tell us why you're the perfect fit for this role..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {submitLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;