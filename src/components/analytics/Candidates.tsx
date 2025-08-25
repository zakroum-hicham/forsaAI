import { Eye, MapPin, MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";

const Candidates = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

     const candidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'SC',
      overallScore: 94,
      githubScore: 92,
      hackathonsScore: 88,
      devsportScore: 96,
      status: 'Interview',
      appliedDate: '2024-08-20',
      github: 'sarahchen',
      linkedin: 'sarah-chen-dev',
      portfolio: 'sarahchen.dev',
      experience: '5 years',
      currentRole: 'Senior Frontend Developer',
      company: 'TechCorp',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      githubStats: {
        repos: 87,
        followers: 1234,
        contributions: 2847
      }
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      email: 'marcus.johnson@example.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      avatar: 'MJ',
      overallScore: 91,
      githubScore: 89,
      hackathonsScore: 95,
      devsportScore: 89,
      status: 'Under Review',
      appliedDate: '2024-08-18',
      github: 'marcusj',
      linkedin: 'marcus-johnson',
      portfolio: 'marcuscode.io',
      experience: '4 years',
      currentRole: 'Full Stack Developer',
      company: 'StartupXYZ',
      skills: ['Python', 'Django', 'React', 'PostgreSQL'],
      githubStats: {
        repos: 62,
        followers: 892,
        contributions: 1923
      }
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      avatar: 'ER',
      overallScore: 87,
      githubScore: 85,
      hackathonsScore: 91,
      devsportScore: 85,
      status: 'Interview',
      appliedDate: '2024-08-22',
      github: 'elenarodriguez',
      linkedin: 'elena-rodriguez-dev',
      portfolio: 'elenadev.com',
      experience: '3 years',
      currentRole: 'Backend Developer',
      company: 'CloudTech',
      skills: ['Go', 'Kubernetes', 'Docker', 'MongoDB'],
      githubStats: {
        repos: 45,
        followers: 567,
        contributions: 1456
      }
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1 (555) 321-0987',
      location: 'Seattle, WA',
      avatar: 'DK',
      overallScore: 82,
      githubScore: 80,
      hackathonsScore: 78,
      devsportScore: 88,
      status: 'Under Review',
      appliedDate: '2024-08-19',
      github: 'davidkim',
      linkedin: 'david-kim-engineer',
      portfolio: 'davidkim.tech',
      experience: '6 years',
      currentRole: 'DevOps Engineer',
      company: 'MegaCorp',
      skills: ['AWS', 'Terraform', 'Python', 'Jenkins'],
      githubStats: {
        repos: 73,
        followers: 445,
        contributions: 1287
      }
    }
  ];

    const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };
    const getStatusColor = (status: string) => {
    const colors = {
      'Under Review': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
    const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = selectedFilter === 'all' || candidate.status === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });
    }, [searchTerm, selectedFilter]);

  return (
   <div className="space-y-6">
               {/* Search and Filter Bar */}
               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                   <div className="flex-1 max-w-lg">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input
                         type="text"
                         placeholder="Search candidates..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                       />
                     </div>
                   </div>
                   <div className="flex items-center space-x-4">
                     <select
                       value={selectedFilter}
                       onChange={(e) => setSelectedFilter(e.target.value)}
                       className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                     >
                       <option value="all">All Status</option>
                       <option value="Under Review">Under Review</option>
                       <option value="Interview">Interview</option>
                       <option value="Rejected">Rejected</option>
                       <option value="Hired">Hired</option>
                     </select>
                     <span className="text-sm text-gray-500">
                       {filteredCandidates.length} of {candidates.length} candidates
                     </span>
                   </div>
                 </div>
               </div>
               {/* Candidates List */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Top Performing Candidates</h3>
                   <p className="text-sm text-gray-500">Candidates ranked by their overall performance score</p>
                 </div>
   
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GitHub</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hackathons</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {filteredCandidates.map((candidate) => (
                         <tr key={candidate.id} className="hover:bg-gray-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="flex-shrink-0 h-12 w-12">
                                 <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                   {candidate.avatar}
                                 </div>
                               </div>
                               <div className="ml-4">
                                 <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                 <div className="text-sm text-gray-500">{candidate.email}</div>
                                 <div className="text-xs text-gray-400 flex items-center mt-1">
                                   <MapPin className="w-3 h-3 mr-1" />
                                   {candidate.location}
                                 </div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.overallScore)}`}>
                               {candidate.overallScore}
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex flex-col">
                               <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getScoreColor(candidate.githubScore)} mb-1`}>
                                 {candidate.githubScore}
                               </span>
                               <span className="text-xs text-gray-500">{candidate.githubStats.contributions} contrib</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getScoreColor(candidate.hackathonsScore)}`}>
                               {candidate.hackathonsScore}
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm text-gray-900">{candidate.experience}</div>
                             <div className="text-xs text-gray-500">{candidate.currentRole}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                               {candidate.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                             <div className="flex items-center space-x-2">
                               <button className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50">
                                 <Eye className="w-4 h-4" />
                               </button>
                               <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50">
                                 <MoreHorizontal className="w-4 h-4" />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
               </div>
  );
};

export default Candidates;
