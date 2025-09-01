'use client'
import React, { useState } from 'react';
import { HelpCircle, XCircle, CheckCircle2, Calendar, DollarSign, MapPin, Briefcase, FileText, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Job } from '@prisma/client';


type JobFormProps = {
  mode: 'create' | 'edit';
} & {
  job?: Job;
};
const JobForm = ({ mode = 'create', job }: JobFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Initialize form data based on mode
  const getInitialFormData = () => {
    if (mode === 'edit' && job) {
      return {
        jobTitle: job.title,
        jobType: job.type,
        location: job.location || '',
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        postingDate: job.postingDate ? format(job.postingDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        endPostingDate: job.endPostingDate ? format(job.endPostingDate, 'yyyy-MM-dd') : '',
        startDate: job.startDate ? format(job.startDate, 'yyyy-MM-dd') : '',
        endDate: job.endDate ? format(job.endDate, 'yyyy-MM-dd') : '',
        jobDescription: job.description,
        requirements: job.requirements,
        status: job.status,
      };
    }
    
    // Default data for create mode
    return {
      jobTitle: '',
      jobType: 'INTERNSHIP',
      location: '',
      salaryMin: '',
      salaryMax: '',
      postingDate: format(new Date(), 'yyyy-MM-dd'),
      endPostingDate: '',
      startDate: '',
      endDate: '',
      jobDescription: '',
      requirements: '',
      status: 'ACTIVE',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // Configuration based on mode
  const config = {
    create: {
      title: 'Create New Job Posting',
      subtitle: 'Fill out the details below to create your job posting and start receiving applications',
      submitText: 'Create Job Posting',
      submitingText: 'Creating Job...',
      successMessage: 'Job created successfully! Redirecting to job details...',
      breadcrumbPage: 'Create New Job',
      infoMessage: 'Jobs are created as private by default. Use the "Share" button on your job listing to make it visible to others.'
    },
    edit: {
      title: 'Edit Job Posting',
      subtitle: 'Update your job posting details and requirements',
      submitText: 'Save Changes',
      submitingText: 'Saving Changes...',
      successMessage: 'Job updated successfully! Returning to job details...',
      breadcrumbPage: 'Edit',
      infoMessage: 'Changes will be saved immediately. The job posting will reflect updates based on the current status setting.'
    }
  };

  const currentConfig = config[mode];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const generateTemplate = (type: string) => {
    if (type === 'description') {
      const template = `We are seeking a motivated ${formData.jobType.toLowerCase()} to join our team. This role offers an excellent opportunity to gain hands-on experience in a dynamic environment.

Key Responsibilities:
• Collaborate with cross-functional teams on exciting projects
• Contribute to product development and innovation initiatives
• Participate in team meetings and strategic planning sessions
• Assist with research and analysis tasks

What You'll Gain:
• Practical experience in your field of study
• Mentorship from industry professionals
• Networking opportunities within the organization
• Potential for future full-time opportunities`;
      
      handleInputChange('jobDescription', template);
    } else if (type === 'requirements') {
      const template = `Required Qualifications:
• Currently enrolled in or recent graduate of relevant degree program
• Strong communication and interpersonal skills
• Ability to work independently and as part of a team
• Proficiency in Microsoft Office Suite or Google Workspace

Preferred Qualifications:
• Previous internship or work experience in related field
• Familiarity with industry-standard tools and technologies
• Demonstrated leadership experience through projects or activities
• Strong analytical and problem-solving abilities

Additional Information:
• This is a ${formData.startDate && formData.endDate ? 'fixed-term' : 'flexible'} position
• Remote work options may be available
• Competitive compensation package`;
      
      handleInputChange('requirements', template);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.jobTitle || !formData.jobDescription || !formData.requirements) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare data for API
      const payload = {
        ...formData,
        id: job?.id,
      };

      // Dynamic API endpoint and method based on mode
      const apiEndpoint = mode === 'create' ? '/api/jobs' : `/api/jobs/${job?.id}`;
      const httpMethod = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(apiEndpoint, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error[0]?.message || `Failed to ${mode} job`;
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      const responseJob = await response.json();
      setSuccess(true);
      
      // Redirect based on mode
      setTimeout(() => {
        const redirectPath = mode === 'create' ? `/jobs/${responseJob.id}` : `/jobs/${job?.id}`;
        router.push(redirectPath);
      }, 1500);
    } catch (err:unknown) {
      if (err instanceof Error){
        console.error(`Job ${mode} failed:`, err);
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypeOptions = [
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'FULL_TIME', label: 'Full-time' },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'CONTRACT', label: 'Contract' }
  ];

  const statusOptions = mode === 'create' 
    ? [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'ACTIVE', label: 'Active' }
      ]
    : [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'ARCHIVED', label: 'Archived' }
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {mode === 'edit' && job && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/jobs/${job.id}`} className="text-slate-600 hover:text-slate-900">
                        {job.title}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium">
                  {currentConfig.breadcrumbPage}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="text-center mb-8">
            {mode === 'edit' && (
              <div className="flex items-center justify-center mb-3">
                <Link href={`/jobs/${job?.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-4 text-slate-600 hover:text-slate-900"
                  >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Details Page
                </Button>
                </Link>
                {job && (
                  <Badge variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                )}
              </div>
            )}
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
              {currentConfig.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {currentConfig.subtitle}
            </p>
          </div>
        </div>
        
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Essential details about the job position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Job Title */}
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle" className="text-sm font-medium text-slate-700">
                          Job Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g. Software Engineer Intern"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
        
                      {/* Job Type and Location Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Job Type</Label>
                          <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                            <SelectTrigger className="bg-white/50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium text-slate-700 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Location
                          </Label>
                          <Input
                            id="location"
                            placeholder="e.g. EL JADIDA, CASABLANCA or Remote"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
        
                      {/* Status */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Status
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger className="bg-white/50 border-slate-200 w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    option.value === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}></div>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
        
                  {/* Compensation */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        Compensation
                      </CardTitle>
                      <CardDescription>
                        Salary range and compensation details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="salaryMin" className="text-sm font-medium text-slate-700">
                            Minimum Salary (USD)
                          </Label>
                          <Input
                            id="salaryMin"
                            type="number"
                            placeholder="50,000"
                            value={formData.salaryMin}
                            onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                            className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salaryMax" className="text-sm font-medium text-slate-700">
                            Maximum Salary (USD)
                          </Label>
                          <Input
                            id="salaryMax"
                            type="number"
                            placeholder="80,000"
                            value={formData.salaryMax}
                            onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                            className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-slate-500">Leave blank if negotiable</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
        
                  {/* Timeline */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                        <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                        Timeline & Dates
                      </CardTitle>
                      <CardDescription>
                        Set posting dates and position duration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Posting Dates */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Posting Period
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="postingDate" className="text-sm font-medium text-slate-700">
                              Posting Date
                            </Label>
                            <Input
                              id="postingDate"
                              type="date"
                              value={formData.postingDate}
                              onChange={(e) => handleInputChange('postingDate', e.target.value)}
                              className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="endPostingDate" className="text-sm font-medium text-slate-700">
                              End Posting Date
                            </Label>
                            <Input
                              id="endPostingDate"
                              type="date"
                              value={formData.endPostingDate}
                              onChange={(e) => handleInputChange('endPostingDate', e.target.value)}
                              className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500">Leave blank to keep open</p>
                          </div>
                        </div>
                      </div>
        
                      <Separator />
        
                      {/* Position Dates */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Position Duration
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-sm font-medium text-slate-700">
                              Start Date
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => handleInputChange('startDate', e.target.value)}
                              className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-sm font-medium text-slate-700">
                              End Date
                            </Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={(e) => handleInputChange('endDate', e.target.value)}
                              className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500">For fixed-term positions</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
        
                  {/* Job Content */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                        <FileText className="w-5 h-5 mr-2 text-orange-600" />
                        Job Content
                      </CardTitle>
                      <CardDescription>
                        Detailed description and requirements for the position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Job Description */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="jobDescription" className="text-sm font-medium text-slate-700">
                            Job Description <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => generateTemplate('description')}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Generate Template
                          </Button>
                        </div>
                        <Textarea
                          id="jobDescription"
                          placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                          value={formData.jobDescription}
                          onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                          className="min-h-[160px] bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          required
                        />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Use bullet points and clear sections for better readability</span>
                          <span>{formData.jobDescription.length} characters</span>
                        </div>
                      </div>
        
                      <Separator />
        
                      {/* Requirements */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="requirements" className="text-sm font-medium text-slate-700">
                            Requirements & Qualifications <span className="text-red-500">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => generateTemplate('requirements')}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Generate Template
                          </Button>
                        </div>
                        <Textarea
                          id="requirements"
                          placeholder="List the required and preferred qualifications, skills, and experience..."
                          value={formData.requirements}
                          onChange={(e) => handleInputChange('requirements', e.target.value)}
                          className="min-h-[160px] bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          required
                        />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Separate required and preferred qualifications clearly</span>
                          <span>{formData.requirements.length} characters</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
        
                  
         {/* Success Alert */}
                {success && (
                  <Alert className="mb-8 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Job created successfully! Redirecting to job details...
                    </AlertDescription>
                  </Alert>
                )}
        
                {/* Error Alert */}
                {error && (
                  <Alert className="mb-8 bg-red-50 border-red-200" variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {currentConfig.infoMessage}
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="bg-white/50 border-slate-300 hover:bg-slate-50"
          >
            {mode === 'create' ? 'Cancel' : 'Cancel Changes'}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {currentConfig.submitingText}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {currentConfig.submitText}
              </>
            )}
          </Button>
        </div>
         </form>
      </div>
    </div>
  );
};

export default JobForm;