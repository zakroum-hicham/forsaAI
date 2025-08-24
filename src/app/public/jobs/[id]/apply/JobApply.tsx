"use client"
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import StepIndicator from '@/components/jobs/apply/StepIndicator';
import PersonalInfoStep from '@/components/jobs/apply/PersonalInfoStep';
import GitHubProfileStep from '@/components/jobs/apply/GithubProfileStep';
import HackathonsStep from '@/components/jobs/apply/HackathonsStep';
import JobDetailsStep from '@/components/jobs/apply/JobDetailsStep';
import { signOut } from 'next-auth/react';

// Toast notification component
const Toast = ({ message, errors, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`}>
    <div className="flex items-start gap-2 px-4 py-3">
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <XCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{message}</div>
        {errors && errors.length > 0 && (
          <div className="mt-2 space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-xs text-white/90 flex items-start gap-1">
                <span className="text-white/70 mt-0.5">•</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  </div>
);

// Form validation
const validateStep = (stepId, formData) => {
  const errors = [];
  
  switch (stepId) {
    case 1:
      if (!formData.firstName?.trim()) errors.push('First name is required');
      if (!formData.lastName?.trim()) errors.push('Last name is required');
      if (!formData.email?.trim()) errors.push('Email is required');
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Please enter a valid email address');
      }
      if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        errors.push('Please enter a valid phone number');
      }
      break;
    case 2:
      if (!formData.githubConnected) errors.push('GitHub connection is required');
      if (formData.linkedinUrl && !/^https:\/\/(www\.)?linkedin\.com\/in\//.test(formData.linkedinUrl)) {
        errors.push('Please enter a valid LinkedIn URL');
      }
      if (formData.portfolioUrl && !/^https?:\/\/.+/.test(formData.portfolioUrl)) {
        errors.push('Please enter a valid portfolio URL');
      }
      break;
    case 3:
      if (!formData.devpostUsername?.trim()) errors.push('Devpost username is required');
      break;
    case 4:
      if (!formData.whyInterested?.trim()) errors.push('Please explain why you\'re interested in this position');
      if (formData.whyInterested && formData.whyInterested.length < 50) {
        errors.push('Please provide at least 50 characters explaining your interest');
      }
      break;
  }
  
  return errors;
};

export default function JobApplicationForm({ job, session }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [toast, setToast] = useState(null);
  const [stepErrors, setStepErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    university: '',
    major: '',
    graduationYear: '',
    
    // GitHub Profile
    githubConnected: true,
    linkedinUrl: '',
    portfolioUrl: '',
    
    // Hackathons
    devpostUsername: '',
    
    // Job Details
    whyInterested: ''
  });

  const [steps, setSteps] = useState([
    { id: 1, title: 'Personal Info', icon: 'User', completed: false },
    { id: 2, title: 'GitHub Profile', icon: 'Github', completed: false },
    { id: 3, title: 'Hackathons', icon: 'Trophy', completed: false },
    { id: 4, title: 'Job Details', icon: 'FileText', completed: false }
  ]);

  const showToast = (message, type = 'info', errors = null) => {
    setToast({ message, type, errors });
    setTimeout(() => setToast(null), type === 'error' ? 8000 : 5000); // Show error toasts longer
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors for this step when user makes changes
    if (stepErrors[currentStep]) {
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
    }
  };

  const checkStepCompletion = (stepId) => {
    const errors = validateStep(stepId, formData);
    return errors.length === 0;
  };

  const nextStep = async () => {
    if (currentStep >= 4) return;
    
    setIsNavigating(true);
    
    // Validate current step
    const errors = validateStep(currentStep, formData);
    if (errors.length > 0) {
      setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
      showToast(
        `Please fix the following errors:`,
        'error',
        errors
      );
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

  const handleCheckCompletion = () => {
    const updatedSteps = steps.map(step => ({
      ...step,
      completed: checkStepCompletion(step.id)
    }));
    setSteps(updatedSteps);
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors: stepErrors[currentStep] || [],
      isNavigating
    };

    switch (currentStep) {
      case 1: return <PersonalInfoStep {...stepProps} />;
      case 2: return <GitHubProfileStep {...stepProps} />;
      case 3: return <HackathonsStep {...stepProps} handleCheckCompletion={handleCheckCompletion} />;
      case 4: return <JobDetailsStep {...stepProps} description={job.description} steps={steps} />;
      default: return <PersonalInfoStep {...stepProps} />;
    }
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
    let allErrors = {};
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
      const allErrorMessages = Object.values(allErrors).flat();
      showToast(
        `Please fix the following errors before submitting:`,
        'error',
        allErrorMessages
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: job.id,
          ...formData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        showToast('Application submitted successfully! 🎉', 'success');
        
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = `/jobs/${job.id}?applied=true`;
        }, 2000);
      } else {
        console.error('Submission failed:', result);
        
        // Handle different types of API errors
        if (result.errors && typeof result.errors === 'object') {
          // Handle field-specific errors
          const fieldErrors = {};
          const errorMessages = [];
          
          Object.entries(result.errors).forEach(([field, error]) => {
            errorMessages.push(`${field}: ${error}`);
            
            // Map API field errors to step errors
            if (['firstName', 'lastName', 'email', 'phone', 'university', 'major', 'graduationYear'].includes(field)) {
              fieldErrors[1] = fieldErrors[1] || [];
              fieldErrors[1].push(error);
            } else if (['githubConnected', 'linkedinUrl', 'portfolioUrl'].includes(field)) {
              fieldErrors[2] = fieldErrors[2] || [];
              fieldErrors[2].push(error);
            } else if (['devpostUsername'].includes(field)) {
              fieldErrors[3] = fieldErrors[3] || [];
              fieldErrors[3].push(error);
            } else if (['whyInterested'].includes(field)) {
              fieldErrors[4] = fieldErrors[4] || [];
              fieldErrors[4].push(error);
            }
          });
          
          setStepErrors(fieldErrors);
          showToast(
            'Application submission failed:',
            'error',
            errorMessages
          );
        } else if (result.message) {
          // Single error message
          showToast(
            'Application submission failed:',
            'error',
            [result.message]
          );
        } else {
          // Generic error
          showToast(
            'Failed to submit application:',
            'error',
            ['An unexpected error occurred. Please try again.']
          );
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      showToast(
        'Network error occurred:',
        'error',
        [
          'Unable to connect to the server',
          'Please check your internet connection and try again',
          error.message || 'Unknown network error'
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = currentStep === 4 ? true : checkStepCompletion(currentStep);
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
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting you back to the job posting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type}
            errors={toast.errors}
            onClose={() => setToast(null)} 
          />
        )}

        <button
          onClick={() => signOut({ callbackUrl: window.location.origin + "/public/jobs/" + job.id })}
          className="mb-8 px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-gray-800 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800"
          aria-label="Sign out"
          disabled={isSubmitting}
        >
          Sign out
        </button>
     
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
          <p className="text-gray-600">{job.company || 'company name'}</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{job.type}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{job.location || "No Location"}</span>
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
              className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
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
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
      </div>
    </div>
  );
}