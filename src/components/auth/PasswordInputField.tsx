import { useState } from "react";
import { PasswordInputFieldProps } from "./types";
import { Label } from "./ui";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const PasswordInputField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  error,
  ...props
}: PasswordInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300'
          }`}
          placeholder="Votre mot de passe"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInputField;