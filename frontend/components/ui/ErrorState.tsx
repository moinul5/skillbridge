import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-200 dark:border-red-950/30 rounded-3xl bg-red-50/50 dark:bg-red-950/5 max-w-md mx-auto my-8">
      <div className="p-4 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full mb-4">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">{title}</h3>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
