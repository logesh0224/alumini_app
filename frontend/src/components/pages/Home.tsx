
import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck } from 'lucide-react';

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const roles = [
    { 
      name: 'student', 
      description: 'Explore job opportunities', 
      icon: <GraduationCap className="h-8 w-8 text-indigo-600" />, 
      path: '/student/signin'
    },
    { 
      name: 'alumni', 
      description: 'Post and share jobs', 
      icon: <Users className="h-8 w-8 text-indigo-600" />, 
      path: '/alumni/register'
    },
    { 
      name: 'admin', 
      description: 'Manage and approve users', 
      icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />, 
      path: '/admin/login'
    },
  ];

 {/* @ts-ignore */}
  const handleRoleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">CareerConnect</span>
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900">About</button>
            <button className="text-gray-600 hover:text-gray-900">Contact</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-bounce">
            Who are you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to get started with CareerConnect
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.name}
              hoverable
              onClick={() => handleRoleClick(role.path)}
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              style={{ width: 300, textAlign: 'center' }}
            >
              <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                {role.icon}
              </div>
              <Title level={3}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</Title>
              <p>{role.description}</p>
              <div className="text-indigo-600 hover:text-indigo-700">
                <span>Get Started</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Our Story</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Team</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">LinkedIn</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-400">&copy; 2024 CareerConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
