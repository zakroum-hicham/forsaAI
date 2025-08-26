import { Eye, MapPin, MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Candidates = ({ candidateData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const candidates = candidateData || [];

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
   <div className="space-y-6 pb-6">
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
                                 <Avatar className="h-8 w-8">
                                  <AvatarImage src={candidate.avatarUrl || ""} alt="User" />
                                  <AvatarFallback>{candidate.name?.charAt(0).toUpperCase() + candidate.name?.split(" ")?.pop()?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                               </div>
                               <div className="ml-4">
                                 <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                 <div className="text-sm text-gray-500">{candidate.email}</div>
                                 <div className="text-xs text-gray-400 flex items-center mt-1">
                                   <MapPin className="w-3 h-3 mr-1" />
                                   {candidate.location || 'NO LOCATION'}
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
                                 {Math.round(candidate.githubScore)}
                               </span>
                               <span className="text-xs text-gray-500">{candidate.contributions} contrib</span>
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
