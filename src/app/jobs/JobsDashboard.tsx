"use client"

import React, {  useState } from 'react';
import { Plus, Briefcase, Clock, MapPin, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteJob } from '@/lib/jobs/delete-job';

const JobsDashboard = ({ jobs: initialJobs }) => {
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  


  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'CLOSED': return 'destructive';
      case 'DRAFT': return 'secondary';
      default: return 'outline';
    }
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //         {/* Loading Header */}
  //         <div className="mb-8">
  //           <Skeleton className="h-10 w-64 mb-2" />
  //           <Skeleton className="h-6 w-96" />
  //         </div>
          
  //         {/* Loading Stats */}
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  //           {[1, 2, 3].map((i) => (
  //             <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
  //               <CardContent className="p-6">
  //                 <Skeleton className="h-8 w-8 rounded-full mb-4 mx-auto" />
  //                 <Skeleton className="h-8 w-16 mb-2 mx-auto" />
  //                 <Skeleton className="h-4 w-20 mx-auto" />
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
          
  //         {/* Loading Grid */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  //           {[1, 2, 3, 4, 5, 6].map((i) => (
  //             <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
  //               <CardContent className="p-6">
  //                 <Skeleton className="h-6 w-3/4 mb-4" />
  //                 <Skeleton className="h-4 w-full mb-2" />
  //                 <Skeleton className="h-4 w-2/3 mb-4" />
  //                 <Skeleton className="h-10 w-full" />
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                Job Dashboard
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl">
                Manage your job postings and track applications in one place
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <Link href="/jobs/create">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Job
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                    <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-slate-900">{jobs.filter(job => job.status === 'ACTIVE').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Applications</p>
                    <p className="text-3xl font-bold text-slate-900">{jobs.reduce((sum, job) => sum + (job.applications || 0), 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-purple-600 text-xs">AP</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Filters Section */}
        {jobs.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search jobs by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50 border-slate-200">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="mb-8">
          {filteredJobs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {searchTerm || statusFilter !== 'all' ? 'Filtered Results' : 'Your Job Postings'}
                </h2>
                <Badge variant="outline" className="bg-white/50">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job: any) => (
                  <Card key={job.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                            {job.title}
                          </CardTitle>
                          {job.status && (
                            <Badge variant={getStatusVariant(job.status)} className="mb-2">
                              {job.status}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/jobs/${job.id}`} className="flex items-center w-full">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/jobs/${job.id}/edit`} className="flex items-center w-full">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Dialog open={selectedJob} onOpenChange={setSelectedJob}>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                  onSelect={(e) => e.preventDefault()} // prevent dropdown from closing automatically
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Job
                                </DropdownMenuItem>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                </DialogHeader>

                                <p className="text-sm text-muted-foreground">
                                  This action cannot be undone. This will permanently delete the job.
                                </p>

                                <DialogFooter className="pt-4">
                                  <Button variant="outline" onClick={() => setSelectedJob(null)} disabled={loading}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => {deleteJob(job.id, setLoading);setJobs(jobs.filter(jb => jb.id !== job.id));}} disabled={loading}>
                                    {loading ? 'Deleting...' : 'Delete'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                        {job.description}
                      </CardDescription>
                      
                      <div className="space-y-3 mb-6">
                        {job.location && (
                          <div className="flex items-center text-sm text-slate-500">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            {job.location}
                          </div>
                        )}
                        {job.type && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                            {job.type}
                          </div>
                        )}
                        {job.createdAt && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Separator className="mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {job.applications && job.applications > 0 && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {job.applications} applicant{job.applications !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {job.salary && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {job.salary}
                            </Badge>
                          )}
                        </div>
                        <Link href={`/jobs/${job.id}`}>
                          <Button 
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : jobs.length === 0 ? (
            /* Empty State - No Jobs */
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-3">Welcome to your dashboard</CardTitle>
                <CardDescription className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  Get started by creating your first job posting. You'll be able to manage applications and track candidates all in one place.
                </CardDescription>
                <Link href="/jobs/create">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            /* No Results State */
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 mb-2">No jobs found</CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </CardDescription>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="bg-white/50"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        {jobs.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
              <CardDescription>Common tasks to manage your job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/jobs/create">
                  <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium text-slate-900">New Job</div>
                      <div className="text-xs text-slate-500">Create posting</div>
                    </div>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                  <div className="text-center">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="font-medium text-slate-900">Applications</div>
                    <div className="text-xs text-slate-500">Review candidates</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                  <div className="text-center">
                    <Filter className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium text-slate-900">Analytics</div>
                    <div className="text-xs text-slate-500">View insights</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full h-auto p-4 bg-white/50 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300">
                  <div className="text-center">
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="font-medium text-slate-900">Templates</div>
                    <div className="text-xs text-slate-500">Job templates</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobsDashboard;