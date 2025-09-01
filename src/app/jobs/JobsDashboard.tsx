// "use client"

// import React, { useState, useMemo } from 'react';
// import { 
//   Plus, Briefcase, Clock, MapPin, Search, Filter, MoreVertical, Eye, Edit, Trash2, 
//   Users, TrendingUp, Calendar, DollarSign, Building, AlertCircle, Star, Archive 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Job, User } from '@prisma/client';

// const JobsDashboard = ({ jobs: initialJobs }: { jobs: Job[]}) => {
//   const [jobs, setJobs] = useState(initialJobs || []);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [viewMode, setViewMode] = useState('grid'); // grid or list

//   // Mock delete function since we don't have the actual implementation
//   // const deleteJob = async (jobId, setLoadingFn) => {
//     // setLoadingFn(true);
//     // Simulate API call
//     // await new Promise(resolve => setTimeout(resolve, 1000));
//     // setLoadingFn(false);
//   // };

//   const filteredJobs = useMemo(() => {
//     return jobs.filter(job => {
//       const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
//       const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
//       const matchesType = typeFilter === 'all' || job.type === typeFilter;
//       return matchesSearch && matchesStatus && matchesType;
//     });
//   }, [jobs, searchTerm, statusFilter, typeFilter]);

//   const stats = useMemo(() => {
//     const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
//     const draftJobs = jobs.filter(job => job.status === 'DRAFT').length;
//     const archivedJobs = jobs.filter(job => job.status === 'ARCHIVED').length;
//     const totalApplications = jobs.reduce((sum, job) => sum + (job.JobApplication?.length || 0), 0);
//     const recentApplications = jobs.reduce((sum, job) => {
//       const recent = job.JobApplication?.filter(app => {
//         const appDate = new Date(app.createdAt);
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//         return appDate > sevenDaysAgo;
//       }).length || 0;
//       return sum + recent;
//     }, 0);

//     return {
//       total: jobs.length,
//       active: activeJobs,
//       draft: draftJobs,
//       archived: archivedJobs,
//       totalApplications,
//       recentApplications,
//       avgApplicationsPerJob: jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0
//     };
//   }, [jobs]);

//   const getStatusVariant = (status) => {
//     switch (status) {
//       case 'ACTIVE': return 'default';
//       case 'ARCHIVED': return 'secondary';
//       case 'DRAFT': return 'outline';
//       default: return 'outline';
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'FULL_TIME': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'PART_TIME': return 'bg-green-100 text-green-800 border-green-200';
//       case 'CONTRACT': return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'INTERNSHIP': return 'bg-orange-100 text-orange-800 border-orange-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const formatSalary = (job) => {
//     if (job.salaryMin && job.salaryMax) {
//       return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
//     } else if (job.salaryMin) {
//       return `From $${job.salaryMin.toLocaleString()}`;
//     } else if (job.salaryMax) {
//       return `Up to $${job.salaryMax.toLocaleString()}`;
//     }
//     return null;
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const isJobExpiring = (job) => {
//     if (!job.endPostingDate) return false;
//     const endDate = new Date(job.endPostingDate);
//     const threeDaysFromNow = new Date();
//     threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
//     return endDate <= threeDaysFromNow && endDate > new Date();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header Section */}
//         <header className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
//                   Job Dashboard
//                 </h1>
//                 {user?.company && (
//                   <Badge variant="outline" className="bg-white/80">
//                     <Building className="w-3 h-3 mr-1" />
//                     {user.company}
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-xl text-slate-600 max-w-2xl">
//                 Welcome back, {user?.firstName || 'there'}! Here&apos;s your recruitment overview.
//               </p>
//             </div>
//             <div className="mt-6 lg:mt-0 flex gap-3">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
//                 className="bg-white/80"
//               >
//                 {viewMode === 'grid' ? 'List View' : 'Grid View'}
//               </Button>
//               <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//                 <Plus className="w-5 h-5 mr-2" />
//                 Create New Job
//               </Button>
//             </div>
//           </div>
          
//           {/* Enhanced Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
//                     <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
//                     <p className="text-xs text-green-600 mt-1">
//                       {stats.active} active • {stats.draft} draft
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <Briefcase className="w-6 h-6 text-blue-600" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-600 mb-1">Applications</p>
//                     <p className="text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
//                     <p className="text-xs text-blue-600 mt-1">
//                       {stats.recentApplications} this week
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                     <Users className="w-6 h-6 text-green-600" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-600 mb-1">Avg per Job</p>
//                     <p className="text-3xl font-bold text-slate-900">{stats.avgApplicationsPerJob}</p>
//                     <p className="text-xs text-purple-600 mt-1">applications</p>
//                   </div>
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <TrendingUp className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-600 mb-1">Response Rate</p>
//                     <p className="text-3xl font-bold text-slate-900">87%</p>
//                     <p className="text-xs text-green-600 mt-1">+5% this month</p>
//                   </div>
//                   <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                     <Star className="w-6 h-6 text-orange-600" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </header>

//         {/* Enhanced Filters Section */}
//         {jobs.length > 0 && (
//           <div className="mb-8">
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
//               <CardContent className="p-6">
//                 <div className="flex flex-col lg:flex-row gap-4">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                     <Input
//                       placeholder="Search jobs by title, description, or location..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="flex gap-3">
//                     <Select value={statusFilter} onValueChange={setStatusFilter}>
//                       <SelectTrigger className="w-48 bg-white/50 border-slate-200">
//                         <Filter className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder="Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Statuses</SelectItem>
//                         <SelectItem value="ACTIVE">Active</SelectItem>
//                         <SelectItem value="DRAFT">Draft</SelectItem>
//                         <SelectItem value="ARCHIVED">Archived</SelectItem>
//                       </SelectContent>
//                     </Select>
                    
//                     <Select value={typeFilter} onValueChange={setTypeFilter}>
//                       <SelectTrigger className="w-48 bg-white/50 border-slate-200">
//                         <Briefcase className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder="Job Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Types</SelectItem>
//                         <SelectItem value="FULL_TIME">Full Time</SelectItem>
//                         <SelectItem value="PART_TIME">Part Time</SelectItem>
//                         <SelectItem value="CONTRACT">Contract</SelectItem>
//                         <SelectItem value="INTERNSHIP">Internship</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Jobs Section */}
//         <div className="mb-8">
//           {filteredJobs.length > 0 ? (
//             <>
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-slate-900">
//                   {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? 'Filtered Results' : 'Your Job Postings'}
//                 </h2>
//                 <Badge variant="outline" className="bg-white/50">
//                   {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
//                 </Badge>
//               </div>
              
//               <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
//                 {filteredJobs.map((job) => (
//                   <Card key={job.id} className={`group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${viewMode === 'list' ? 'flex-row' : ''}`}>
//                     {isJobExpiring(job) && (
//                       <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 text-xs text-yellow-700 flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" />
//                         Expires {formatDate(job.endPostingDate)}
//                       </div>
//                     )}
                    
//                     <CardHeader className="pb-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2">
//                             <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
//                               {job.title}
//                             </CardTitle>
//                             {job.public && (
//                               <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
//                                 Public
//                               </Badge>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-2 mb-3">
//                             <Badge variant={getStatusVariant(job.status)}>
//                               {job.status}
//                             </Badge>
//                             <Badge className={`text-xs ${getTypeColor(job.type)}`}>
//                               {job.type.replace('_', ' ')}
//                             </Badge>
//                           </div>
//                         </div>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
//                               <MoreVertical className="w-4 h-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end" className="w-48">
//                             <DropdownMenuItem>
//                               <Eye className="w-4 h-4 mr-2" />
//                               View Details
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                               <Edit className="w-4 h-4 mr-2" />
//                               Edit Job
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                               <Users className="w-4 h-4 mr-2" />
//                               View Applications ({job.JobApplication?.length || 0})
//                             </DropdownMenuItem>
//                             {job.status === 'ACTIVE' && (
//                               <DropdownMenuItem>
//                                 <Archive className="w-4 h-4 mr-2" />
//                                 Archive Job
//                               </DropdownMenuItem>
//                             )}
//                             <DropdownMenuSeparator />
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <DropdownMenuItem
//                                   className="text-red-600 focus:text-red-600 cursor-pointer"
//                                   onSelect={(e) => e.preventDefault()}
//                                 >
//                                   <Trash2 className="w-4 h-4 mr-2" />
//                                   Delete Job
//                                 </DropdownMenuItem>
//                               </DialogTrigger>
//                               <DialogContent>
//                                 <DialogHeader>
//                                   <DialogTitle>Delete Job Posting?</DialogTitle>
//                                 </DialogHeader>
//                                 <p className="text-sm text-muted-foreground">
//                                   This will permanently delete &quot;{job.title}&quot; and all associated applications. This action cannot be undone.
//                                 </p>
//                                 <DialogFooter className="pt-4">
//                                   <Button variant="outline" disabled={loading}>
//                                     Cancel
//                                   </Button>
//                                   <Button 
//                                     variant="destructive" 
//                                     onClick={() => {
//                                       deleteJob(job.id, setLoading);
//                                       setJobs(jobs.filter(jb => jb.id !== job.id));
//                                     }} 
//                                     disabled={loading}
//                                   >
//                                     {loading ? 'Deleting...' : 'Delete Job'}
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </CardHeader>
                    
//                     <CardContent className="pt-0">
//                       <CardDescription className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
//                         {job.description}
//                       </CardDescription>
                      
//                       <div className="space-y-2 mb-6">
//                         {job.location && (
//                           <div className="flex items-center text-sm text-slate-600">
//                             <MapPin className="w-4 h-4 mr-2 text-slate-400" />
//                             {job.location}
//                           </div>
//                         )}
//                         {formatSalary(job) && (
//                           <div className="flex items-center text-sm text-slate-600">
//                             <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
//                             {formatSalary(job)}
//                           </div>
//                         )}
//                         <div className="flex items-center text-sm text-slate-500">
//                           <Calendar className="w-4 h-4 mr-2 text-slate-400" />
//                           Posted {formatDate(job.postingDate)}
//                         </div>
//                         {job.endPostingDate && (
//                           <div className="flex items-center text-sm text-slate-500">
//                             <Clock className="w-4 h-4 mr-2 text-slate-400" />
//                             Closes {formatDate(job.endPostingDate)}
//                           </div>
//                         )}
//                       </div>
                      
//                       <Separator className="mb-4" />
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                             <Users className="w-3 h-3 mr-1" />
//                             {job.JobApplication?.length || 0} applicant{job.JobApplication?.length !== 1 ? 's' : ''}
//                           </Badge>
//                         </div>
//                         <Button 
//                           size="sm"
//                           className="bg-slate-900 hover:bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
//                         >
//                           Manage Job
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           ) : jobs.length === 0 ? (
//             /* Empty State */
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
//               <CardContent className="p-12 text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Briefcase className="w-10 h-10 text-blue-600" />
//                 </div>
//                 <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
//                   Welcome to your recruitment hub
//                 </CardTitle>
//                 <CardDescription className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
//                   Start by creating your first job posting. Track applications, manage candidates, and grow your team all in one place.
//                 </CardDescription>
//                 <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
//                   <Plus className="w-5 h-5 mr-2" />
//                   Create Your First Job
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             /* No Results State */
//             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
//               <CardContent className="p-12 text-center">
//                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Search className="w-8 h-8 text-slate-400" />
//                 </div>
//                 <CardTitle className="text-xl font-semibold text-slate-900 mb-2">No jobs match your criteria</CardTitle>
//                 <CardDescription className="text-slate-600 mb-6">
//                   Try adjusting your search terms or filters to find what you&apos;re looking for.
//                 </CardDescription>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => {
//                     setSearchTerm('');
//                     setStatusFilter('all');
//                     setTypeFilter('all');
//                   }}
//                   className="bg-white/50"
//                 >
//                   Clear All Filters
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Enhanced Quick Actions */}
//         {jobs.length > 0 && (
//           <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
//               <CardDescription>Streamline your recruitment workflow</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
//                   <div className="text-center">
//                     <Plus className="w-6 h-6 mx-auto mb-2 text-blue-600" />
//                     <div className="font-medium text-slate-900">New Job</div>
//                     <div className="text-xs text-slate-500">Create posting</div>
//                   </div>
//                 </Button>
                
//                 <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-green-50 hover:border-green-300 transition-all duration-300">
//                   <div className="text-center">
//                     <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
//                     <div className="font-medium text-slate-900">Applications</div>
//                     <div className="text-xs text-slate-500">{stats.recentApplications} pending review</div>
//                   </div>
//                 </Button>
                
//                 <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
//                   <div className="text-center">
//                     <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
//                     <div className="font-medium text-slate-900">Analytics</div>
//                     <div className="text-xs text-slate-500">View insights</div>
//                   </div>
//                 </Button>
                
//                 <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300">
//                   <div className="text-center">
//                     <Briefcase className="w-6 h-6 mx-auto mb-2 text-orange-600" />
//                     <div className="font-medium text-slate-900">Templates</div>
//                     <div className="text-xs text-slate-500">Job templates</div>
//                   </div>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobsDashboard;