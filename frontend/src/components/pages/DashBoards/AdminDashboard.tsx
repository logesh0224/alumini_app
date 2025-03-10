import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users,
  GraduationCap,

  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../Layout/Dashboard';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    pendingAlumni: 0,
    totalAlumni: 0,
    totalCompanies: 0,
    totalJobs: 0
  });
  interface Alumni {
    _id: string;
    name: string;
    department: string;
    graduationYear: string;
    status: 'approved' | 'pending' | 'rejected';
  }

  const [recentAlumni, setRecentAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/admin/login');
          return;
        }
//@ts-ignore
        const userData = JSON.parse(localStorage.getItem('userData'));
        setAdmin(userData);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch all stats in parallel
        const [statsRes, recentRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', config),
          axios.get('http://localhost:5000/api/admin/recent-alumni', config)
        ]);

        setStats({
          pendingAlumni: statsRes.data.pendingAlumni || 0,
          totalAlumni: statsRes.data.totalAlumni || 0,
          totalCompanies: statsRes.data.totalCompanies || 0,
          totalJobs: statsRes.data.totalJobs || 0
        });
        
        setRecentAlumni(recentRes.data.alumni || []);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
            <p className="mt-4 text-lg text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" onLogout={handleLogout}>
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
               {/* @ts-ignore */}
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {admin?.name}!</h1>
              <p className="text-gray-600">Manage your platform efficiently</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Stats Grid */}
     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Link to="/admin/pending-alumni">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.pendingAlumni}</span>
          </div>
          <h3 className="text-lg font-semibold">Pending Alumni</h3>
          <div className="mt-2 flex items-center text-yellow-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Awaiting approval</span>
          </div>
        </div>
        </Link>
        
<Link to="/admin/alumni">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.totalAlumni}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Alumni</h3>
          <div className="mt-2 flex items-center text-green-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Registered alumni</span>
          </div>
        </div>
      </Link>
      

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileCheck className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.totalJobs}</span>
          </div>
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <div className="mt-2 flex items-center text-purple-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">Posted positions</span>
          </div>
        </div>
      </div>
    

      {/* Recent Alumni */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Alumni Registrations</h2>
          <Link
            to="/admin/alumni"
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-600">Name</th>
                <th className="pb-3 font-semibold text-gray-600">Department</th>
                <th className="pb-3 font-semibold text-gray-600">Graduation Year</th>
                <th className="pb-3 font-semibold text-gray-600">Status</th>
                <th className="pb-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAlumni.length > 0 ? (
                recentAlumni.map((alumni) => (
                  //@ts-ignore
                  <tr key={alumni._id} className="text-gray-800">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="ml-2">{alumni.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{alumni.department}</td>
                    <td className="py-3">{alumni.graduationYear}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alumni.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : alumni.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {alumni.status === 'approved' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : alumni.status === 'pending' ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {alumni.status.charAt(0).toUpperCase() + alumni.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/admin/alumni/${alumni._id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                 {/* @ts-ignore */}
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No recent alumni registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;