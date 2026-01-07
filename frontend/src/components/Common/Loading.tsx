import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading = ({ message = 'Loading...', size = 'md' }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" message="Loading..." />
    </div>
  );
};

