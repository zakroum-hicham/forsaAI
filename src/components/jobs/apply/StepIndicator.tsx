import { Check } from 'lucide-react';

export default function StepIndicator({ step, currentStep }: { step: any; currentStep: number }) {
  const Icon = step.icon;
  const isActive = currentStep === step.id;
  const isCompleted = step.completed;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-black text-white' : 'bg-gray-50 text-gray-600'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isActive ? 'bg-white text-black' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
      }`}>
        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
      </div>
      <span className="font-medium">{step.title}</span>
    </div>
  );
}
