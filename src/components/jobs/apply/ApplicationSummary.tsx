import { Check } from 'lucide-react';

export default function ApplicationSummary ({ steps = {} }) {
  const sections = [
    {
      id: 'personal',
      title: 'Personal Information',
      status: steps[0].completed ? 'complete' : 'incomplete'
    },
    {
      id: 'github',
      title: 'GitHub Profile',
      status: steps[1].completed ? 'complete' : 'not-linked'
    },
    {
      id: 'hackathon',
      title: 'Hackathon History',
      status: steps[2].completed ? 'complete' : 'not-imported'
    }
  ];

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'complete':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="font-medium">Complete</span>
          </div>
        );
      case "linked":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="font-medium">Linked</span>
          </div>
        );
      case "imported":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="font-medium">Imported</span>
          </div>
        );
      case 'not-linked':
        return (
          <span className="text-orange-500 font-medium">Not Linked</span>
        );
      case 'not-imported':
        return (
          <span className="text-orange-500 font-medium">Not Imported</span>
        );
      case 'incomplete':
        return (
          <span className="text-red-500 font-medium">Incomplete</span>
        );
      default:
        return (
          <span className="text-gray-500 font-medium">Unknown</span>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-900">Application Summary</h3>
      
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={section.id}>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 text-base">{section.title}</span>
              {getStatusDisplay(section.status)}
            </div>
            {index < sections.length - 1 && (
              <div className="border-b border-gray-100"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};