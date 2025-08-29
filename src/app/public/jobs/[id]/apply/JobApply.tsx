"use client"
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, MapPin, Clock, User, GraduationCap, Globe, FileText, XCircle, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import StepIndicator from '@/components/jobs/apply1/StepIndicator';
import PersonalInfoStep from '@/components/jobs/apply1/PersonalInfoStep';
import EducationExperienceStep from '@/components/jobs/apply1/EducationExperienceStep';
import SkillsPortfolioStep from '@/components/jobs/apply1/SkillsPortfolioStep';
import MotivationStep from '@/components/jobs/apply1/MotivationStep';
import { personalInfoSchema,educationExperienceSchema,skillsPortfolioSchema,motivationSchema } from '@/lib/validations';
import z from 'zod';

type Props = {
  job: any;
  session: any;
};

type StepErrors = {
  [key: number]: string[];
};
export default function JobApplicationForm({ job, session }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    // Personal Info
    firstName: '',
    lastName: '',
    email: session?.user?.email,
    phone: '',
    city: '',
    
    // Education & Experience
    educationLevel: '',
    institution: '',
    fieldOfStudy: '',
    graduationYear: '',
    experience: '',
    
    // Skills & Portfolio
    skills: [],
    linkedin: '',
    portfolio: '',
    resume: null,
    
    // Motivation
    motivation: '',
    availability: '',
    terms: false
  });

  const [steps, setSteps] = useState([
    { id: 1, title: 'Personal Info', description: 'Your basic information', icon: User, completed: false },
    { id: 2, title: 'Education & Experience', description: 'Background details', icon: GraduationCap, completed: false },
    { id: 3, title: 'Skills & Portfolio', description: 'Your abilities and work', icon: Globe, completed: false },
    { id: 4, title: 'Motivation', description: 'Final details', icon: FileText, completed: false }
  ]);

  // Form validation
  
  const validateStep = (stepId: number, formData: any) => {
    try {
      switch (stepId) {
        case 1:
          personalInfoSchema.parse(formData);
          break;
        case 2:
          educationExperienceSchema.parse(formData);
          break;
        case 3:
          skillsPortfolioSchema.parse(formData);
          break;
        case 4:
          motivationSchema.parse(formData);
          break;
      }
      return [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Object.values(error.flatten().fieldErrors);
      }
      return ["Validation failed"];
    }
  };

  const updateFormData = (field: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear errors for this step when user makes changes
    if (stepErrors[currentStep]) {
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
    }
  };

  const checkStepCompletion = (stepId: number) => {
    const errors = validateStep(stepId, formData);
    return errors.length === 0;
  };

  const nextStep = async () => {
    if (currentStep >= 4) return;
    
    setIsNavigating(true);
    
    // Validate current step
    const errors = validateStep(currentStep, formData);
    if (errors.length > 0) {
      setStepErrors(prev => ({ ...prev, [currentStep]: errors as string[] }));
      setIsNavigating(false);
      return;
    }
    
    // Clear errors and proceed
    setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
    
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentStep(currentStep + 1);
    setIsNavigating(false);
  };

  const prevStep = async () => {
    if (currentStep <= 1) return;
    
    setIsNavigating(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setCurrentStep(currentStep - 1);
    setIsNavigating(false);
  };

  useEffect(() => {
    const updatedSteps = steps.map(step => ({
      ...step,
      completed: checkStepCompletion(step.id)
    }));
    setSteps(updatedSteps);
  }, [formData]);

  const handleSubmit = async () => {
    // Final validation of all steps
    let allErrors : any = {};
    let hasErrors = false;

    for (let i = 1; i <= 4; i++) {
      const errors = validateStep(i, formData);
      if (errors.length > 0) {
        allErrors[i] = errors;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setStepErrors(allErrors);
      const errorCount = Object.values(allErrors).length;
      toast.error(
        `Please fix the ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`,
        {
          description: 'Please review all form steps and complete the required fields'
        }
      );

      // Jump to the first error step
      const firstErrorStep = Object.keys(allErrors)[0];
      setCurrentStep(Number(firstErrorStep));
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();
      submitData.append('jobId', job.id);
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'resume' && formData[key]) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });
      const response = await fetch('/api/apply', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = `/public/jobs/${job.id}`;
        }, 3000);
      } else {
        
        if (result.errors && typeof result.errors === 'object') {
          const fieldErrors: Record<number, string[]> = {};
          const errorMessages: string[] = [];

          Object.entries(result.errors).forEach(([field, error]: [any, any]) => {
            errorMessages.push(`${error}`);
            
            // Map API field errors to step errors
            if (['firstName', 'lastName', 'email', 'phone', 'city'].includes(field)) {
              fieldErrors[1] = fieldErrors[1] || [];
              fieldErrors[1].push(error);
            } else if (['educationLevel', 'institution', 'fieldOfStudy', 'graduationYear', 'experience'].includes(field)) {
              fieldErrors[2] = fieldErrors[2] || [];
              fieldErrors[2].push(error);
            } else if (['skills', 'linkedin', 'portfolio', 'resume'].includes(field)) {
              fieldErrors[3] = fieldErrors[3] || [];
              fieldErrors[3].push(error);
            } else if (['motivation', 'availability', 'terms'].includes(field)) {
              fieldErrors[4] = fieldErrors[4] || [];
              fieldErrors[4].push(error);
            }
          });
          
          setStepErrors(fieldErrors);
          toast.error('Application submission failed', {
            description: errorMessages.join(', ')
          });
        } else if (result.message) {
          toast.error('Application submission failed', {
            description: result.message
          });
        } else {
          toast.error('Application submission failed', {
            description: 'An unexpected error occurred. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error occurred', {
        description: 'Unable to connect to the server. Please check your internet connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const isLastStep = currentStep === 4;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for applying to {job.title} at {job.company || 'this company'}. 
            We'll review your application and get back to you soon.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Redirecting you back to the job posting...
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors: stepErrors[currentStep]?.flat() || [],
      isNavigating
    };

    switch (currentStep) {
      case 1: return <PersonalInfoStep {...stepProps} />;
      case 2: return <EducationExperienceStep {...stepProps} />;
      case 3: return <SkillsPortfolioStep {...stepProps} />;
      case 4: return <MotivationStep {...stepProps} job={job} />;
      default: return <PersonalInfoStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
          <p className="text-gray-600">{job.company || 'Company Name'}</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location || "Morocco"}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.type || "Full-time"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Complete your application</h2>
            <p className="text-gray-600">Thank you for your interest in this position!</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Step Navigation */}
            <div className="space-y-2">
              {steps.map((step) => (
                <StepIndicator 
                  key={step.id} 
                  step={step} 
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  hasErrors={stepErrors[step.id]?.length > 0}
                />
              ))}
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3">
              <div className={`transition-all duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
                {renderStep()}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting || isNavigating}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                currentStep === 1 || isSubmitting || isNavigating
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-4">
              {stepErrors[currentStep]?.length > 0 && (
                <div className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {stepErrors[currentStep].length} error{stepErrors[currentStep].length > 1 ? 's' : ''}
                </div>
              )}

              {isLastStep ? (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || isNavigating}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={isNavigating || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Next
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signOut({ callbackUrl: `${window.location.origin}/jobs/${job.id}` })}
            className="px-6 py-2 text-sm text-white bg-red-500 hover:bg-red-600 transition-colors rounded-md shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}