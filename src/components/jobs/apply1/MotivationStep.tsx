import { StepPropsType } from "@/app/public/jobs/[id]/apply/JobApply";
import { Job } from "@prisma/client";


const MotivationStep = ({ formData, updateFormData, errors, isNavigating, job } :StepPropsType &{job: Job}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Final Steps</h3>
        <p className="text-sm text-gray-600">Tell us why you&apos;re interested in this position</p>
      </div>
      
      <div>
        <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
          Why are you interested in this position at {"this Company"}? *
        </label>
        <textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => updateFormData('motivation', e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Explain why you're a good fit for the ${job.title} role...`}
          disabled={isNavigating}
        />
        <div className="mt-1 text-sm text-gray-500">
          {formData.motivation.length}/500 characters
        </div>
        {errors.includes('Motivation statement is required') && (
          <p className="mt-1 text-sm text-red-600">Motivation statement is required</p>
        )}
        {errors.includes('Please provide at least 50 characters') && (
          <p className="mt-1 text-sm text-red-600">Please provide at least 50 characters explaining your interest</p>
        )}
      </div>
      
      <div>
        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
          Availability *
        </label>
        <select
          id="availability"
          value={formData.availability}
          onChange={(e) => updateFormData('availability', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isNavigating}
        >
          <option value="">Select your availability</option>
          <option value="immediate">Immediately</option>
          <option value="1_week">Within 1 week</option>
          <option value="2_weeks">Within 2 weeks</option>
          <option value="1_month">Within 1 month</option>
          <option value="2_months">Within 2 months</option>
          <option value="more_2_months">More than 2 months</option>
        </select>
        {errors.includes('Availability is required') && (
          <p className="mt-1 text-sm text-red-600">Availability is required</p>
        )}
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={(e) => updateFormData('terms', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isNavigating}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I confirm that the information provided is accurate and complete *
          </label>
          {errors.includes('You must accept the terms') && (
            <p className="mt-1 text-red-600">You must accept the terms</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotivationStep;