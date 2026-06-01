import React from 'react';
import { Input } from '../ui/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  ...props
}) => {
  return (
    <div className="mb-4">
      <Input
        label={label}
        error={error}
        helperText={hint}
        {...props}
      />
    </div>
  );
};
