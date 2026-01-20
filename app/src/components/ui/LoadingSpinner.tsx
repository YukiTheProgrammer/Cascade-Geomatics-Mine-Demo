/**
 * LoadingSpinner Component
 *
 * Description:
 * A reusable loading spinner component for async operations throughout the
 * Mine Demo Dashboard. Provides visual feedback during data loading, API calls,
 * and processing states. Uses an industrial-utilitarian design with sky-500
 * color to match the application theme.
 *
 * Sample Input:
 * <LoadingSpinner size="md" text="Loading terrain data..." />
 * <LoadingSpinner size="lg" />
 * <LoadingSpinner size="sm" className="ml-2" />
 *
 * Expected Output:
 * An animated spinning loader icon with optional descriptive text below,
 * accessible with role="status" and proper aria-label for screen readers.
 */

import { Loader2 } from 'lucide-react';

/** Available size options for the LoadingSpinner */
type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  /** Size of the spinner: sm=16px, md=24px, lg=48px */
  size?: LoadingSpinnerSize;
  /** Optional loading text displayed below the spinner */
  text?: string;
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/** Size configurations mapping size prop to pixel values and text styles */
const sizeConfig: Record<LoadingSpinnerSize, { icon: number; text: string }> = {
  sm: {
    icon: 16,
    text: 'text-xs',
  },
  md: {
    icon: 24,
    text: 'text-sm',
  },
  lg: {
    icon: 48,
    text: 'text-base',
  },
};

/**
 * LoadingSpinner - A reusable component for indicating loading states
 *
 * @param props - Component props including size, text, and className
 * @returns A styled spinner element with optional loading text
 */
const LoadingSpinner = ({
  size = 'md',
  text,
  className = '',
}: LoadingSpinnerProps) => {
  const { icon: iconSize, text: textSize } = sizeConfig[size];

  const containerClasses = [
    'inline-flex flex-col items-center justify-center gap-2',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      role="status"
      aria-label={text || 'Loading'}
    >
      <Loader2
        size={iconSize}
        className="animate-spin text-sky-500"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {text && (
        <span className={`${textSize} text-slate-400 font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
export { LoadingSpinner };
export type { LoadingSpinnerProps, LoadingSpinnerSize };
