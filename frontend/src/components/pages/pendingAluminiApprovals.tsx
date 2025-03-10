import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Building, 
  GraduationCap,
  Mail,
  Briefcase,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import DashboardLayout from '../Layout/Dashboard';

interface Alumni {
  _id: string;
  name: string;
  email: string;
  graduationYear: number;
  company?: string;
  position?: string;
}

const PendingAlumniApprovals = () => {
  const [pendingAlumni, setPendingAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingAlumni = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/admin/pending-alumni', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendingAlumni(res.data.data);
      } catch (err) {
        setError('Failed to fetch pending alumni accounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAlumni();
  }, [navigate]);

//@ts-ignore
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/admin/approve-alumni/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
//@ts-ignore
      setPendingAlumni(pendingAlumni.filter(alumni => alumni._id !== id));
      setSuccessMessage('Alumni approved successfully');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to approve alumni');
      console.error(err);
      
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
//@ts-ignore
  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this alumni? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`http://localhost:5000/api/admin/reject-alumni/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
//@ts-ignore
        setPendingAlumni(pendingAlumni.filter(alumni => alumni._id !== id));
        setSuccessMessage('Alumni rejected successfully');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError('Failed to reject alumni');
        console.error(err);
        
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Loading pending approvals...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" onLogout={handleLogout}>
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pending Alumni Approvals</h1>
              <p className="text-gray-600">Review and manage alumni registration requests</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        {pendingAlumni.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
            <p className="text-gray-600">There are no alumni registrations waiting for approval at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-600">Alumni Details</th>
                  <th className="pb-3 font-semibold text-gray-600">Contact</th>
                  <th className="pb-3 font-semibold text-gray-600">Education</th>
                  <th className="pb-3 font-semibold text-gray-600">Employment</th>
                  <th className="pb-3 font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingAlumni.map((alumni) => (
                  <tr key={alumni._id} className="group hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{alumni.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Building className="h-4 w-4 mr-1" />
                          
                            {alumni.company || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {alumni.email}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        Class of {alumni.graduationYear}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {alumni.position || 'Not specified'}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleApprove(alumni._id)}
                          className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(alumni._id)}
                          className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingAlumniApprovals;