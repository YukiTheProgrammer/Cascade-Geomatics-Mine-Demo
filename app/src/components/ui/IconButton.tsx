/**
 * IconButton Component
 *
 * Description:
 * A reusable button component that wraps Lucide icons with consistent styling,
 * accessibility features, and multiple visual variants. Designed for the Mine Demo
 * Dashboard's industrial-utilitarian interface, prioritizing clarity and precision
 * for quarry operators conducting risk analysis.
 *
 * Sample Input:
 * <IconButton
 *   icon={Settings}
 *   label="Open settings"
 *   variant="primary"
 *   size="md"
 *   onClick={() => handleSettings()}
 * />
 *
 * Expected Output:
 * A styled button element containing the Settings icon with:
 *   - Primary blue background with white icon
 *   - Medium (40px) clickable area
 *   - Accessible aria-label for screen readers
 *   - Hover/focus states with smooth transitions
 */

import { type LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

/** Available style variants for the IconButton */
type IconButtonVariant = 'default' | 'primary' | 'ghost';

/** Available size options for the IconButton */
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The Lucide icon component to render */
  icon: LucideIcon;
  /** Accessibility label for screen readers (required for icon-only buttons) */
  label: string;
  /** Visual style variant */
  variant?: IconButtonVariant;
  /** Size of the button and icon */
  size?: IconButtonSize;
  /** Additional CSS classes to apply */
  className?: string;
}

/** Size configurations mapping size prop to Tailwind classes */
const sizeConfig: Record<IconButtonSize, { button: string; icon: number }> = {
  sm: {
    button: 'w-8 h-8',
    icon: 16,
  },
  md: {
    button: 'w-10 h-10',
    icon: 20,
  },
  lg: {
    button: 'w-12 h-12',
    icon: 24,
  },
};

/** Variant configurations mapping variant prop to Tailwind classes */
const variantConfig: Record<IconButtonVariant, { base: string; hover: string; focus: string; disabled: string }> = {
  default: {
    base: 'bg-white text-gray-700 border border-gray-300 shadow-sm',
    hover: 'hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none',
  },
  primary: {
    base: 'bg-blue-600 text-white border border-blue-600 shadow-sm',
    hover: 'hover:bg-blue-700 hover:border-blue-700',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    disabled: 'disabled:bg-blue-300 disabled:border-blue-300 disabled:shadow-none',
  },
  ghost: {
    base: 'bg-transparent text-gray-600 border border-transparent',
    hover: 'hover:bg-gray-100 hover:text-gray-900',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    disabled: 'disabled:bg-transparent disabled:text-gray-300',
  },
};

/**
 * IconButton - A reusable button component for icon-only actions
 *
 * @param props - Component props including icon, label, variant, size, and standard button attributes
 * @returns A styled button element containing the specified Lucide icon
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      variant = 'default',
      size = 'md',
      className = '',
      disabled = false,
      ...buttonProps
    },
    ref
  ) => {
    const sizeStyles = sizeConfig[size];
    const variantStyles = variantConfig[variant];

    const baseClasses = [
      // Layout and sizing
      'inline-flex items-center justify-center',
      sizeStyles.button,
      // Shape
      'rounded-lg',
      // Transitions
      'transition-all duration-150 ease-in-out',
      // Variant styles
      variantStyles.base,
      variantStyles.hover,
      variantStyles.focus,
      variantStyles.disabled,
      // Focus outline removal (using ring instead)
      'focus:outline-none',
      // Cursor states
      'cursor-pointer disabled:cursor-not-allowed',
      // Active state press effect
      'active:scale-95 disabled:active:scale-100',
    ].join(' ');

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={disabled}
        className={`${baseClasses} ${className}`.trim()}
        {...buttonProps}
      >
        <Icon
          size={sizeStyles.icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
export { IconButton };
export type { IconButtonProps, IconButtonVariant, IconButtonSize };
