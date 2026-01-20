/**
 * UI Components Index
 *
 * Description:
 * Barrel export file for all reusable UI components in the Mine Demo Dashboard.
 * Provides clean import paths for consuming components.
 *
 * Sample Input:
 * import { IconButton } from '@/components/ui';
 *
 * Expected Output:
 * Access to all exported UI components and their associated types
 */

export { IconButton, default as IconButtonDefault } from './IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton';

export { default as TabNavigation } from './TabNavigation';
export type { Tab, TabNavigationProps } from './TabNavigation';

export { StatusBadge, default as StatusBadgeDefault } from './StatusBadge';
export type { StatusBadgeProps, StatusBadgeSize, StatusBadgeVariant } from './StatusBadge';

export { LoadingSpinner, default as LoadingSpinnerDefault } from './LoadingSpinner';
export type { LoadingSpinnerProps, LoadingSpinnerSize } from './LoadingSpinner';

export { ErrorBoundary, DefaultErrorFallback, default as ErrorBoundaryDefault } from './ErrorBoundary';
export type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary';
