export default function HackathonsStep({ formData, updateFormData }: {
  formData: any;
  updateFormData: (field: string, value: string) => void;
}) {
  return (
   <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Devpost Username</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={formData.devpostUsername}
            onChange={(e) => updateFormData('devpostUsername', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter your Devpost username"
          />
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            Verify
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <strong>Note:</strong> If you don't have a Devpost profile, you can skip this step.
      </div>
    </div>
  );
}
