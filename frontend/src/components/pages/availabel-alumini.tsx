import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Alumni {
  _id: string;
  name: string;
  email: string;
  graduationYear: number;
  company: string;
  position: string;
}

const AvailableAlumni = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/admin/alumni', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAlumni(res.data.data);
      } catch (err) {
        setError('Failed to fetch alumni');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [navigate]);

  //@ts-ignore
  const handleSuspend = async (id) => {
    if (window.confirm('Are you sure you want to suspend this alumni? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`http://localhost:5000/api/admin/suspend-alumni/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  //@ts-ignore
        // Update the list by removing the suspended alumni
        setAlumni(alumni.filter(alum => alum._id !== id));
        setSuccessMessage('Alumni suspended successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError('Failed to suspend alumni');
        console.error(err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2">Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Available Alumni</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
      
      {alumni.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded">
          <p>No available alumni at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Graduation Year</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Position</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((alum) => (
                  //@ts-ignore
                <tr key={alum._id} className="border-t hover:bg-gray-50">
                 {/* @ts-ignore */}
                  <td className="py-3 px-4">{alum.name}</td>
                   {/* @ts-ignore */}
                  <td className="py-3 px-4">{alum.email}</td>
                   {/* @ts-ignore */}
                  <td className="py-3 px-4">{alum.graduationYear}</td>
                   {/* @ts-ignore */}
                  <td className="py-3 px-4">{alum.company}</td>
                   {/* @ts-ignore */}
                  <td className="py-3 px-4">{alum.position}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button
                    
                      onClick={() => handleSuspend(alum._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailableAlumni;