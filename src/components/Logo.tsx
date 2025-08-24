import { Brain } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900">ForsaAI</span>
      </div>
  );

};
export default Logo;
