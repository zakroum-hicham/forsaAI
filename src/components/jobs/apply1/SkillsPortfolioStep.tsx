import { StepPropsType } from "@/app/public/jobs/[id]/apply/JobApply";
import { FileText, Globe, Linkedin } from "lucide-react";


const SkillsPortfolioStep = ({ formData, updateFormData, errors, isNavigating } : StepPropsType) => {
  const skillsList = [
    "JavaScript", "Python", "Java", "PHP", "React", "Angular", "Vue.js", 
    "Node.js", "Express", "Django", "Flask", "HTML/CSS", "SQL", "MongoDB", 
    "PostgreSQL", "AWS", "Docker", "Git", "REST APIs", "GraphQL", "UI/UX Design",
    "Project Management", "Digital Marketing", "Sales", "Customer Service"
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Skills & Portfolio</h3>
        <p className="text-sm text-gray-600">Showcase your skills and online presence</p>
      </div>
      
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
          Skills & Technologies *
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills.map((skill:string, index:number) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {skill}
              <button
                type="button"
                onClick={() => {
                  const newSkills = [...formData.skills];
                  newSkills.splice(index, 1);
                  updateFormData('skills', newSkills);
                }}
                className="ml-1.5 rounded-full flex-shrink-0 flex items-center justify-center text-blue-500 hover:bg-blue-200 hover:text-blue-900"
              >
                <span className="sr-only">Remove {skill}</span>
                ×
              </button>
            </span>
          ))}
        </div>
        <select
          id="skills"
          onChange={(e) => {
            if (e.target.value && !formData.skills.includes(e.target.value)) {
              updateFormData('skills', [...formData.skills, e.target.value]);
            }
            e.target.value = "";
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isNavigating}
        >
          <option value="">Select a skill to add</option>
          {skillsList.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        {errors.includes('At least one skill is required') && (
          <p className="mt-1 text-sm text-red-600">At least one skill is required</p>
        )}
      </div>
      
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Profile
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Linkedin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={(e) => updateFormData('linkedin', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/yourprofile"
            disabled={isNavigating}
          />
        </div>
        {errors.includes('Please enter a valid LinkedIn URL') && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid LinkedIn URL</p>
        )}
      </div>
      
      <div>
        <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio Website/GitHub
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="portfolio"
            type="url"
            value={formData.portfolio}
            onChange={(e) => updateFormData('portfolio', e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://github.com/yourusername or your portfolio website"
            disabled={isNavigating}
          />
        </div>
        {errors.includes('Please enter a valid URL') && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
        )}
      </div>
      
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Resume (PDF) *
        </label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="resume" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                {formData.resume ? formData.resume.name : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
            </div>
            <input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => updateFormData('resume', e.target.files?.[0] ?? "")}
              className="hidden"
              disabled={isNavigating}
            />
          </label>
        </div>
        {errors.includes('Resume is required') && (
          <p className="mt-1 text-sm text-red-600">Resume is required</p>
        )}
      </div>
    </div>
  );
};

export default SkillsPortfolioStep;