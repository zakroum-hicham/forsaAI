'use client';
import { useState } from 'react';
import { Mail, Lock} from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Header from '@/components/auth/Header';
import PasswordInputField from '@/components/auth/PasswordInputField';
import NormalInputField from '@/components/auth/NormalInputField';
import { SubmitButton, SwitchButton } from '@/components/auth/ui';
import { loginSchema } from '@/lib/validations/auth';
import { validateFormWithZOD } from '@/lib/utils_';

const headerData = {
  title: "Connexion",
  subtitle: "Accédez à votre espace TalentAI",
  googleLabel: "Continuer avec Google",
  githubLabel: "Continuer avec GitHub"
};

export default function LoginPage() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, errors } = validateFormWithZOD(loginSchema, formData);
    setErrors(errors);
    if (!success) return;

    setIsLoading(true);
    
    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: '/dashboard',
    });
    if (result?.error) {
      setErrors({ password: 'Invalid email or password' });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Header data={headerData} />

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <NormalInputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="votre@email.com"
          icon={Mail}
          error={errors.email}
        />

        <PasswordInputField
          label="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          icon={Lock}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center" htmlFor="rememberMe">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Se souvenir de moi</span>
          </label>
          <Link
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <SubmitButton isLoading={isLoading} text="Se connecter" />
      </form>

      {/* Switch to Register */}
      <SwitchButton link="/register" text1="Pas encore de compte ?" text2="Créer un compte" />
    </div>
  );
}
