import z, { ZodError, ZodType } from "zod";

export const getPasswordStrength = (password:string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength < 3) return { level: 'Faible', color: 'bg-red-400', width: '33%' };
    if (strength < 5) return { level: 'Moyen', color: 'bg-yellow-400', width: '66%' };
    return { level: 'Fort', color: 'bg-green-400', width: '100%' };
  };

  export const getErrorLabelFromZODErrors = (errors: ZodError) => {
    const validationError: { [key: string]: string } = Object.fromEntries(
        Object.entries(errors.flatten().fieldErrors).map(([key, value]) => [key, (value as string[])[0]])
      );
    return validationError;
  };


export const validateFormWithZOD = <T extends ZodType>(shema: T, formData: z.infer<T>) => {
  const validationResult = shema.safeParse(formData);

  if (!validationResult.success) {
    const newErrors = getErrorLabelFromZODErrors(validationResult.error);
    return { success: false, errors: newErrors };
  }
  return { success: true, errors: {} };
};