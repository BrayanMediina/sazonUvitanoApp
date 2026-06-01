import React from 'react';
import { Input } from '../ui/Input';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  countryCode?: string;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label = 'Teléfono',
  countryCode = '+57',
  error,
  ...props
}) => {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          label={label}
          type="tel"
          placeholder="3001234567"
          error={error}
          maxLength={10}
          {...props}
        />
      </div>
    </div>
  );
};
