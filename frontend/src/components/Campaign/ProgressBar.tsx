import { calculatePercentage } from '@utils/format';

interface ProgressBarProps {
  current: bigint;
  goal: bigint;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = ({
  current,
  goal,
  showPercentage = true,
  size = 'md',
}: ProgressBarProps) => {
  const percentage = calculatePercentage(current, goal);
  const clampedPercentage = Math.min(percentage, 100);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getColor = () => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-primary-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getColor()} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 mt-1 text-right">{percentage.toFixed(2)}%</p>
      )}
    </div>
  );
};

