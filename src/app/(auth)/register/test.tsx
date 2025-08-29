'use client';

import { useActionState, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight,
  Chrome,
  Github,
  XCircle,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { RegisterFormErrorsType } from '@/types/register';
import { registerAction } from '@/app/server/actions/register';


type FormState = {
    errors: RegisterFormErrorsType;
}

const initialState: FormState = {
    errors: {}
}
export default function RegisterPage() {
  const [state,formAction,isPending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<RegisterFormErrorsType>({});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name as keyof RegisterFormErrorsType]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

  

//   const submitAction = async (formData: FormData) => {
//     // const validationErrors = validateForm(formData);
//     // if (Object.keys(validationErrors).length > 0) {
//     //   setErrors(validationErrors);
//     //   // Focus first error field
//     //   const firstError = Object.keys(validationErrors)[0];
//     //   const element = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
//     //   element?.focus();
//     //   return;
//     }
    
//     setErrors({});
    
//     try {
//       const result = await registerAction(formData);
//       if (result.error) {
//         throw new Error(result.error || 'Registration failed');
//       }

//       toast.success('Account created successfully!');

//       // Auto-login after successful registration
//       const signInResult = await signIn('credentials', {
//         email: formData.get("email")?.toString().toLowerCase().trim(),
//         password: formData.get("password"),
//         redirect: false,
//       });

//       if (signInResult?.error) {
//         toast.error('Account created but auto-login failed. Please sign in manually.');
//         return;
//       }

//       // Redirect on success
//       window.location.href = '/dashboard';
      
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'An unexpected error occurred';
//       setErrors({ server: message });
//       toast.error(message);
//     }
//   };

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      toast.error('Social login failed. Please try again.');
    }
  };

  const getPasswordStrength = (formData) => {
    const password = formData.get("password")?.toString();
    if (!password) return null;
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score < 3) return { level: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score < 5) return { level: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { level: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData || new FormData());

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start your 14-day free trial today
        </p>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          className="w-full"
          disabled={isPending}
        >
          <Chrome className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          className="w-full"
          disabled={isPending}
        >
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Server Error Alert */}
      {errors.server && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{errors.server}</AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <form action={formAction} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                className={`pl-9 ${state.errors?.firstName ? 'border-destructive' : ''}`}
                placeholder="John"
                disabled={isPending}
              />
            </div>
            {state.errors?.firstName && (
              <p className="text-sm text-destructive">{state.errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              className={state.errors?.lastName ? 'border-destructive' : ''}
              placeholder="Doe"
              disabled={isPending}
            />
            {state.errors?.lastName && (
              <p className="text-sm text-destructive">{state.errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className={`pl-9 ${state.errors?.email ? 'border-destructive' : ''}`}
              placeholder="john@company.com"
              disabled={isPending}
            />
          </div>
          {state.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="company"
              name="company"
              value={formData.company}
              className="pl-9"
              placeholder="Your company name"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              className={`pl-9 pr-9 ${state.errors?.password ? 'border-destructive' : ''}`}
              placeholder="At least 8 characters"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Password Strength */}
          {passwordStrength && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Password strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.level === 'Strong' ? 'text-green-600' :
                  passwordStrength.level === 'Medium' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {passwordStrength.level}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
            </div>
          )}

          {state.errors?.password && (
            <p className="text-sm text-destructive">{state.errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              className={`pl-9 pr-9 ${state.errors?.confirmPassword ? 'border-destructive' : ''}`}
              placeholder="Confirm your password"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {state.errors?.confirmPassword && (
            <p className="text-sm text-destructive">{state.errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Marketing */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              className={state.errors?.acceptTerms ? 'border-destructive' : ''}
              disabled={isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
          {state.errors?.acceptTerms && (
            <p className="text-sm text-destructive">{state.errors.acceptTerms}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptMarketing"
              name="acceptMarketing"
              checked={formData.acceptMarketing}
              disabled={isPending}
            />
            <Label
              htmlFor="acceptMarketing"
              className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Send me product updates and marketing emails (optional)
            </Label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}