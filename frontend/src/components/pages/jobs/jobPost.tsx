import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Bangalore',
    description: '',
    requirements: '',
    salary: '2-3 LPA',
    jobType: 'Full-time',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get alumni data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData && userData.company) {
      setFormData(prevState => ({
        ...prevState,
        company: userData.company
      }));
    }
  }, []);

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
        setError('You must be logged in to post a job');
        setLoading(false);
        return;
      }

    

      // const res = await axios.post('http://localhost:5000/api/jobs', formData, config);

      setSuccess('Job posted successfully!');
      // Reset form
      setFormData({
        title: '',
        company: company, // Keep the company name
        location: 'Bangalore',
        description: '',
        requirements: '',
        salary: '2-3 LPA',
        jobType: 'Full-time',
        deadline: ''
      });

      // Redirect to my jobs page after 2 seconds
      setTimeout(() => {
        navigate('/alumni/my-jobs');
      }, 2000);
    } catch (err) {
      //@ts-ignore
      setError(err.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">Job Title *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              required
            >
              <option value="">Select Job Title</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>

          {/* Company */}
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

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="location">Location *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              id="location"
              name="location"
              value={location}
              onChange={handleChange}
              required
            >
              <option value="Bangalore">Bangalore</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Cochin">Cochin</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          {/* Job Description */}
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

          {/* Requirements */}
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

          {/* Salary */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="salary">Salary/CTC</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              id="salary"
              name="salary"
              value={salary}
              onChange={handleChange}
            >
              <option value="2-3 LPA">2-3 LPA</option>
              <option value="3-5 LPA">3-5 LPA</option>
              <option value="5-7 LPA">5-7 LPA</option>
              <option value="7-10 LPA">7-10 LPA</option>
              <option value="10+ LPA">10+ LPA</option>
            </select>
          </div>

          {/* Job Type */}
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

          {/* Deadline */}
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

          {/* Submit Button */}
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;