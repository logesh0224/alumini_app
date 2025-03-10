
import { Search, MapPin, Building, Clock, Briefcase, DollarSign, BookmarkPlus, Share2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  featured: boolean;
}

export default function JobListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Example jobs data
  const jobs: Job[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Corp",
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=50&h=50&fit=crop&crop=faces",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120,000 - $180,000",
      posted: "2 days ago",
      description: "Join our team of exceptional engineers building the next generation of cloud infrastructure...",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      featured: true
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Design Studio",
      logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=50&h=50&fit=crop&crop=faces",
      location: "San Francisco, CA",
      type: "Remote",
      salary: "$90,000 - $140,000",
      posted: "1 week ago",
      description: "We're looking for a creative Product Designer to help shape the future of our digital products...",
      skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
      featured: false
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "Cloud Solutions Inc",
      logo: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=50&h=50&fit=crop&crop=faces",
      location: "Remote",
      type: "Full-time",
      salary: "$130,000 - $170,000",
      posted: "3 days ago",
      description: "Help us build and maintain robust cloud infrastructure and deployment pipelines...",
      skills: ["Kubernetes", "Docker", "AWS", "CI/CD"],
      featured: true
    },
    {
      id: 4,
      title: "Frontend Developer",
      company: "Web Innovators",
      logo: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=50&h=50&fit=crop&crop=faces",
      location: "Austin, TX",
      type: "Hybrid",
      salary: "$85,000 - $130,000",
      posted: "5 days ago",
      description: "Create beautiful and responsive web applications using modern frontend technologies...",
      skills: ["React", "Vue.js", "CSS", "JavaScript"],
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-600">Discover opportunities that match your skills and aspirations</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Briefcase className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="relative">
              <MapPin className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
              >
                <option value="all">All Locations</option>
                <option value="new-york">New York</option>
                <option value="san-francisco">San Francisco</option>
                <option value="austin">Austin</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:scale-[1.02] ${
                job.featured ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {job.featured && (
                <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 text-center">
                  Featured Position
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                      <BookmarkPlus className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="h-4 w-4 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.posted}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    {job.type}
                  </span>
                  <button className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}