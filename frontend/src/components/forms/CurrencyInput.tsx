import React from 'react';
import { Input } from '../ui/Input';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  currency?: string;
  error?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label = 'Monto',
  currency = 'COP',
  error,
  value,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    const event = { ...e, target: { ...e.target, value: numericValue } };
    onChange?.(event as any);
  };

  return (
    <div className="relative">
      <Input
        label={label}
        type="text"
        value={value}
        onChange={handleChange}
        error={error}
        placeholder="0"
        {...props}
      />
      <span className="absolute right-3 top-10 text-gray-500 text-sm">
        {currency}
      </span>
    </div>
  );
};
