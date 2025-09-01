'use client';
import Header from '@/components/auth/Header';
import NormalInputField from '@/components/auth/NormalInputField';
import PasswordInputField from '@/components/auth/PasswordInputField';
import { SubmitButton, SwitchButton } from '@/components/auth/ui';
import { getErrorLabelFromZODErrors, getPasswordStrength, validateFormWithZOD } from '@/lib/utils_';
import { registerSchema } from '@/lib/validations/auth';
import { Mail, Lock, User, Building, } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import z from 'zod';

type errorType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  acceptMarketing?: string;
  server?: string;
}

const headerData = {
  title: "Créer un compte",
  subtitle: "Rejoignez la communauté TalentAI",
  googleLabel: "Continuer avec Google",
  githubLabel: "Continuer avec GitHub"
}

export default function RegisterPage() {
  const [errors, setErrors] = useState<errorType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
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
    e.preventDefault()
    const { success, errors } = validateFormWithZOD(registerSchema, formData);
    setErrors(errors);
   if (!success) {

      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (element as HTMLElement).focus();
          }
        }
      }
      return
    }
    
  setIsLoading(true)
   try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company: formData.company,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrors({ server: data.error || 'Registration failed' })
      setIsLoading(false)
      return
    }

    // Auto-login after successful registration
    const signInRes = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: '/dashboard',
    })

    if (signInRes?.error) {
      setErrors({
        server:
          "Impossible de vous connecter automatiquement, veuillez essayer manuellement.",
      })
      setIsLoading(false)
      return
    }

    // Redirect on successful sign-in
    if (signInRes?.ok && signInRes.url) {
      window.location.href = signInRes.url
    }
  } catch (error:unknown) {
    if (error instanceof z.ZodError ) {
    setErrors(getErrorLabelFromZODErrors(error));
  } else {
    setErrors({ server: (error as { error?: string }).error ?? "Une erreur est survenue" });
  }
  setIsLoading(false);
  }
  }

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="space-y-8">
      <Header data={headerData} />

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NormalInputField
            label="Prénom"
            name="firstName"
            type='text'
            placeholder='first name'
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            icon={User}
          />

          <NormalInputField
            label="Nom"
            name="lastName"
            type='text'
            placeholder='last name'
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            icon={User}
          />
        </div>

        <div>
          <NormalInputField
            label="Email professionnel"
            name="email"
            type="email"
            placeholder="jean@entreprise.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            icon={Mail}
          />
        </div>

        <NormalInputField
          label="Entreprise (optionnel)"
          name="company"
          type="text"
          placeholder="Nom de votre entreprise"
          value={formData.company}
          onChange={handleInputChange}
          icon={Building}
        />

        <div>

          <PasswordInputField
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={Lock}
          />

          {/* Password Strength Indicator */}
          {passwordStrength && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Force du mot de passe</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.level === 'Fort' ? 'text-green-600 dark:text-green-400' :
                  passwordStrength.level === 'Moyen' ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-red-600 dark:text-red-400'
                }`}>
                  {passwordStrength.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <PasswordInputField
          label="Confirmer le mot de passe"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          icon={Lock}
        />

        {/* Terms and Marketing */}
        <div className="space-y-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              J&apos;accepte les{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                conditions d&apos;utilisation
              </Link>{' '}
              et la{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                politique de confidentialité
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
          )}

          <label className="flex items-start">
            <input
              type="checkbox"
              name="acceptMarketing"
              checked={formData.acceptMarketing}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Je souhaite recevoir des actualités et conseils par email (optionnel)
            </span>
          </label>
        </div>

        <SubmitButton isLoading={isLoading} text="Créer mon compte" />
        {errors.server && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.server}</p>
            )}
      </form>

      {/* Switch to Login */}
      <SwitchButton link="/login" text1="Déjà un compte ?" text2="Se connecter" />
    </div>
  );
}