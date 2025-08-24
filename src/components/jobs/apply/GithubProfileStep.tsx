import { ExternalLink } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function GitHubProfileStep({ formData, updateFormData }: {
  formData: any;
  updateFormData: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
        <button onClick={() => {}} className="w-full px-4 py-3 border border-gray-300 rounded-md text-left text-gray-600 hover:bg-gray-50 flex items-center justify-between">
          <span>🔗 Reconnect GitHub</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn profile URL (optional)</label>
        <input
          type="url"
          value={formData.linkedinUrl}
          onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website (optional)</label>
        <input
          type="url"
          value={formData.portfolioUrl}
          onChange={(e) => updateFormData('portfolioUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  );
}
