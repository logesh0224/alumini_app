import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    jobType: 'Full-time',
    deadline: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      try {
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

        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, config);
        
        // Format the date to YYYY-MM-DD for the input field
        const jobData = res.data.data;
        const formattedDate = jobData.deadline ? 
          new Date(jobData.deadline).toISOString().split('T')[0] : '';
        
        setFormData({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          requirements: jobData.requirements,
          salary: jobData.salary || '',
          jobType: jobData.jobType,
          deadline: formattedDate
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, navigate]);

  const { 
    title, 
    company, 
    location, 
    description, 
    requirements, 
    salary, 
    jobType, 
    deadline 
  } = formData;
  //@ts-ignore
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update a job');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put(`http://localhost:5000/api/jobs/${id}`, formData, config);

      setSuccess('Job updated successfully!');
      
      // Redirect to my jobs page after 2 seconds
      setTimeout(() => {
        navigate('/alumni/my-jobs');
      }, 2000);
    } catch (err) {
      //@ts-ignore
      setError(err.response?.data?.message || 'Error updating job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading job details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Job Posting</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">Job Title *</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="company">Company *</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            id="company"
            name="company"
            value={company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location">Location *</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={handleChange}
            required
            placeholder="e.g., New York, NY or Remote"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">Job Description *</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Provide a detailed description of the job role and responsibilities"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="requirements">Requirements *</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="requirements"
            name="requirements"
            value={requirements}
            onChange={handleChange}
            required
            rows={5}
            placeholder="List required skills, education, experience, etc."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="salary">Salary/CTC</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="text"
            id="salary"
            name="salary"
            value={salary}
            onChange={handleChange}
            placeholder="e.g., $70,000 - $90,000 or Competitive"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="jobType">Job Type *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            id="jobType"
            name="jobType"
            value={jobType}
            onChange={handleChange}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="deadline">Application Deadline *</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            type="date"
            id="deadline"
            name="deadline"
            value={deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Job'}
          </button>
          
          <button
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none"
            type="button"
            onClick={() => navigate('/alumni/my-jobs')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;