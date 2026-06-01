import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backButton = false,
  onBack,
  actions,
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {backButton && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-orange-400 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-orange-100 text-sm">{subtitle}</p>}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};
