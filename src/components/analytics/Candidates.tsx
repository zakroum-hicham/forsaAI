import React, { useMemo, useState } from "react";
import { 
  Eye, 
  MapPin, 
  MoreHorizontal, 
  Search, 
  Filter,
  Download,
  Plus,
  Github,
  Trophy,
  Mail,
  ExternalLink,
  SortAsc,
  SortDesc
} from "lucide-react";

// shadcn/ui imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";


const Candidates = ({ candidateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortField, setSortField] = useState('overallScore');
  const [sortDirection, setSortDirection] = useState('desc');

  const candidates = candidateData || [];

  const getScoreVariant = (score) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
  };

  const getStatusColor = (status) => {
    const colors = {
      'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Interview': 'bg-green-50 text-green-700 border-green-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Hired': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || candidate.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [candidates, searchTerm, selectedFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2 lg:px-3"
    >
      {children}
      {sortField === field && (
        sortDirection === 'desc' ? <SortDesc className="ml-2 h-4 w-4" /> : <SortAsc className="ml-2 h-4 w-4" />
      )}
    </Button>
  );


  return (
    <TooltipProvider>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Main Content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-xl">Candidate Pipeline</CardTitle>
                <CardDescription>
                  Manage and review candidate applications
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
           {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-[180px] sm:self-end">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center text-sm text-gray-500">
                  Showing {filteredAndSortedCandidates.length} of {candidates.length} candidates
                </div>
              </div>
            </div>


            <Separator />

            {/* Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50/50">
                      <th className="text-left p-4 font-medium text-gray-900">
                        <SortButton field="name">Candidate</SortButton>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        <SortButton field="overallScore">Overall Score</SortButton>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        <SortButton field="githubScore">GitHub</SortButton>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        <SortButton field="hackathonsScore">Hackathons</SortButton>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">Experience</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedCandidates.map((candidate, index) => (
                      <tr 
                        key={candidate.id} 
                        className={`border-b hover:bg-gray-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/25'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.avatarUrl || ""} alt={candidate.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {candidate.name}
                              </p>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{candidate.email}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <MapPin className="h-3 w-3" />
                                <span>{candidate.location}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant={getScoreVariant(candidate.overallScore)} className="font-mono">
                                {candidate.overallScore}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Overall performance score</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col space-y-1">
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant={getScoreVariant(candidate.githubScore)} size="sm">
                                  <Github className="mr-1 h-3 w-3" />
                                  {candidate.githubScore}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>GitHub activity score</p>
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-xs text-gray-500">
                              {candidate.contributions} contributions
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant={getScoreVariant(candidate.hackathonsScore)} size="sm">
                                <Trophy className="mr-1 h-3 w-3" />
                                {candidate.hackathonsScore}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hackathon performance score</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>

                        <td className="p-4">
                          <div className="text-sm text-gray-900">{candidate.experience}</div>
                          <div className="text-xs text-gray-500 truncate max-w-32">
                            {candidate.currentRole}
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(candidate.status)}
                          >
                            {candidate.status}
                          </Badge>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`applications/${candidate.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View profile</p>
                              </TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View GitHub
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Schedule interview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Change status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Remove candidate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAndSortedCandidates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-sm">
                    No candidates found matching your criteria.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Candidates;