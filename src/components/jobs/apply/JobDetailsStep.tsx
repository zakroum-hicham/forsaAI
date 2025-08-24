import ApplicationSummary from "./ApplicationSummary";

export default function JobDetailsStep({ formData, updateFormData ,description, steps }: {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  description: string;
  steps: any[];
}) {
  return (
   <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Why are you interested in this position?</label>
        <textarea
          value={formData.whyInterested}
          onChange={(e) => updateFormData('whyInterested', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Tell us why you're interested in this position and why you would be a good fit..."
        />
      </div>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-800">Job Description</h3>
        {/* Description Section */}
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: description }} 
              />
        {/* <div className="space-y-3 text-sm"> */}
    </div>    
        {/* Application Summary */}

          <ApplicationSummary steps={steps} />
    </div>  
  );
}
