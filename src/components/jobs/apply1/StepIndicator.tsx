type Props = {
  step: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  };
  currentStep: number;
  hasErrors: boolean;
  setCurrentStep: (step: number) => void;
};

const StepIndicator = ({ step, currentStep, hasErrors,setCurrentStep }: Props) => {
  const isCompleted = step.completed && !hasErrors;
  const isCurrent = currentStep === step.id;
  
  return (
    <button
      onClick={() => !isCurrent  && setCurrentStep(step.id)}
      className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
        isCurrent ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
      } ${hasErrors ? 'border border-red-200 bg-red-50' : ''}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isCompleted ? 'bg-green-100 text-green-600' : 
        isCurrent ? 'bg-blue-100 text-blue-600' : 
        hasErrors ? 'bg-red-100 text-red-600' :
        'bg-gray-100 text-gray-400'
      }`}>
        {hasErrors ? '!' : isCompleted ? '✓' : step.id}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${
          isCurrent ? 'text-blue-900' : 
          hasErrors ? 'text-red-800' :
          isCompleted ? 'text-green-800' : 'text-gray-600'
        }`}>
          {step.title}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {step.description}
        </div>
      </div>
    </button>
  );
};
export default StepIndicator;