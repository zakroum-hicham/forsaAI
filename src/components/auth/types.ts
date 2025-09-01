
export type NormalInputFieldProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon: React.ElementType;
  error?: string;
};

export type PasswordInputFieldProps = Omit<NormalInputFieldProps, 'type'>