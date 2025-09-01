import { StepPropsType } from "@/app/public/jobs/[id]/apply/JobApply";
import { Calendar, GraduationCap } from "lucide-react";


const EducationExperienceStep = ({ formData, updateFormData, errors, isNavigating } : StepPropsType) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 2 - i);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Education & Experience</h3>
        <p className="text-sm text-gray-600">Tell us about your educational background and work experience</p>
      </div>
      
      <div>
        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Highest Education Level *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="educationLevel"
            value={formData.educationLevel}
            onChange={(e) => updateFormData('educationLevel', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            disabled={isNavigating}
          >
            <option value="">Select your education level</option>
            <option value="HIGH_SCHOOL">High School Diploma</option>
            <option value="ASSOCIATE">Associate Degree</option>
            <option value="BACHELOR">Bachelor&apos;s Degree</option>
            <option value="MASTER">Master&apos;s Degree</option>
            <option value="PHD">PhD</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        {errors.includes('Education level is required') && (
          <p className="mt-1 text-sm text-red-600">Education level is required</p>
        )}
      </div>
      
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
          Institution Name
        </label>
        <input
          id="institution"
          type="text"
          value={formData.institution}
          onChange={(e) => updateFormData('institution', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="University or School name"
          disabled={isNavigating}
        />
      </div>
      
      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
          Field of Study
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          value={formData.fieldOfStudy}
          onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. Computer Science, Business Administration"
          disabled={isNavigating}
        />
      </div>
      
      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
          Graduation Year
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="graduationYear"
            value={formData.graduationYear}
            onChange={(e) => updateFormData('graduationYear', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            disabled={isNavigating}
          >
            <option value="">Select graduation year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Professional Experience *
        </label>
        <select
          id="experience"
          value={formData.experience}
          onChange={(e) => updateFormData('experience', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isNavigating}
        >
          <option value="">Select years of experience</option>
          <option value="ZERO">No experience (Student)</option>
          <option value="ONE_TWO">1-2 years</option>
          <option value="THREE_FIVE">3-5 years</option>
          <option value="SIX_TEN">6-10 years</option>
          <option value="TEN_PLUS">10+ years</option>
        </select>
        {errors.includes('Experience level is required') && (
          <p className="mt-1 text-sm text-red-600">Experience level is required</p>
        )}
      </div>
    </div>
  );
};
export default EducationExperienceStep;