/**
 * StatusBadge Component
 *
 * Description:
 * A reusable badge component for displaying status indicators throughout the
 * Mine Demo Dashboard. Renders a colored circle indicator with optional label
 * text, designed for visual status communication in activity logs, alerts, and
 * system monitoring displays. Uses centralized status color constants for
 * consistent styling across the application.
 *
 * Sample Input:
 * <StatusBadge status="Success" />
 * <StatusBadge status="Warning" showLabel />
 * <StatusBadge status="Error" showLabel size="lg" />
 * <StatusBadge status="Info" customLabel="Processing" />
 *
 * Expected Output:
 * A badge element containing:
 *   - A colored circle indicator matching the status type
 *   - Optional label text (status name or custom label)
 *   - Accessible aria attributes for screen readers
 *   - Size variants for different UI contexts
 */

import {
  STATUS_COLORS,
  STATUS_TEXT_COLORS,
  STATUS_LABELS,
  type StatusType,
} from '../../utils/constants';

/** Available size options for the StatusBadge */
type StatusBadgeSize = 'sm' | 'md' | 'lg';

/** Display variant options for the StatusBadge */
type StatusBadgeVariant = 'default' | 'outlined' | 'subtle';

interface StatusBadgeProps {
  /** The status type determining the badge color */
  status: StatusType;
  /** Whether to display the status label text */
  showLabel?: boolean;
  /** Custom label text to override the default status label */
  customLabel?: string;
  /** Size of the badge indicator and text */
  size?: StatusBadgeSize;
  /** Visual style variant */
  variant?: StatusBadgeVariant;
  /** Whether to show a pulsing animation for active/live statuses */
  pulse?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
}

/** Size configurations for the indicator circle */
const indicatorSizeConfig: Record<StatusBadgeSize, string> = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

/** Size configurations for the label text */
const labelSizeConfig: Record<StatusBadgeSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/** Size configurations for the container padding */
const containerSizeConfig: Record<StatusBadgeSize, string> = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2 py-1',
  lg: 'px-2.5 py-1.5',
};

/** Variant configurations for container styling */
const variantConfig: Record<StatusBadgeVariant, (status: StatusType) => string> = {
  default: () => 'bg-transparent',
  outlined: (status) => {
    const borderColors: Record<StatusType, string> = {
      Success: 'border border-green-300 bg-green-50/50',
      Warning: 'border border-yellow-300 bg-yellow-50/50',
      Error: 'border border-red-300 bg-red-50/50',
      Info: 'border border-blue-300 bg-blue-50/50',
    };
    return borderColors[status];
  },
  subtle: (status) => {
    const bgColors: Record<StatusType, string> = {
      Success: 'bg-green-100/60',
      Warning: 'bg-yellow-100/60',
      Error: 'bg-red-100/60',
      Info: 'bg-blue-100/60',
    };
    return bgColors[status];
  },
};

/**
 * StatusBadge - A reusable component for displaying status indicators
 *
 * @param props - Component props including status, showLabel, size, variant, and styling options
 * @returns A styled badge element with a status indicator and optional label
 */
const StatusBadge = ({
  status,
  showLabel = false,
  customLabel,
  size = 'md',
  variant = 'default',
  pulse = false,
  className = '',
}: StatusBadgeProps) => {
  const indicatorColor = STATUS_COLORS[status];
  const textColor = STATUS_TEXT_COLORS[status];
  const label = customLabel ?? STATUS_LABELS[status];

  const indicatorSize = indicatorSizeConfig[size];
  const labelSize = labelSizeConfig[size];
  const containerSize = showLabel || customLabel ? containerSizeConfig[size] : '';
  const variantStyles = variantConfig[variant](status);

  const containerClasses = [
    'inline-flex items-center gap-1.5',
    containerSize,
    variantStyles,
    'rounded-full',
    className,
  ].filter(Boolean).join(' ');

  const indicatorClasses = [
    indicatorSize,
    indicatorColor,
    'rounded-full',
    'flex-shrink-0',
    pulse ? 'animate-pulse' : '',
  ].filter(Boolean).join(' ');

  const labelClasses = [
    labelSize,
    textColor,
    'font-medium',
    'leading-none',
  ].join(' ');

  return (
    <span
      className={containerClasses}
      role="status"
      aria-label={`Status: ${label}`}
    >
      <span
        className={indicatorClasses}
        aria-hidden="true"
      />
      {(showLabel || customLabel) && (
        <span className={labelClasses}>
          {label}
        </span>
      )}
    </span>
  );
};

export default StatusBadge;
export { StatusBadge };
export type { StatusBadgeProps, StatusBadgeSize, StatusBadgeVariant };
