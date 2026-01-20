/**
 * KPICard Component
 *
 * Description:
 * A base KPI (Key Performance Indicator) card component for displaying hardware status
 * and metric information in the Mine Demo Dashboard. Designed with an industrial-utilitarian
 * aesthetic that emphasizes clarity, precision, and trustworthiness for quarry operators
 * conducting critical risk analysis. Features a subtle gradient background with status-
 * colored accent borders and carefully crafted typography hierarchy.
 *
 * Sample Input:
 * <KPICard
 *   data={{
 *     id: 'towers-online',
 *     title: 'Towers Online',
 *     value: '4/5',
 *     status: KPIStatus.WARNING,
 *     icon: 'Radio',
 *     lastUpdated: new Date(),
 *     description: 'Active monitoring towers'
 *   }}
 * />
 *
 * Expected Output:
 * A styled card element displaying:
 *   - Icon and title in the header
 *   - Large, prominent value with optional unit
 *   - Status indicator dot with appropriate color
 *   - Relative timestamp showing last update
 *   - Trend indicator when applicable
 */

import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { type KPICard as KPICardType, KPIStatus, TrendDirection } from '../../types/kpi';

interface KPICardProps {
  /** KPI data object containing all display information */
  data: KPICardType;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional click handler for interactive cards */
  onClick?: () => void;
}

/**
 * Maps KPIStatus enum values to corresponding Tailwind CSS classes
 * for background color indicators (status dots)
 */
const STATUS_DOT_COLORS: Record<KPIStatus, string> = {
  [KPIStatus.SUCCESS]: 'bg-emerald-500',
  [KPIStatus.WARNING]: 'bg-amber-500',
  [KPIStatus.ERROR]: 'bg-red-500',
  [KPIStatus.INFO]: 'bg-sky-500',
  [KPIStatus.UNKNOWN]: 'bg-slate-500',
};

/**
 * Maps KPIStatus enum values to border accent colors
 */
const STATUS_BORDER_COLORS: Record<KPIStatus, string> = {
  [KPIStatus.SUCCESS]: 'border-l-emerald-500',
  [KPIStatus.WARNING]: 'border-l-amber-500',
  [KPIStatus.ERROR]: 'border-l-red-500',
  [KPIStatus.INFO]: 'border-l-sky-500',
  [KPIStatus.UNKNOWN]: 'border-l-slate-500',
};


/**
 * Formats a timestamp into a human-readable relative time string
 * Examples: "Just now", "5 min ago", "2 hours ago", "Jan 18, 10:30"
 */
const formatRelativeTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  // For older timestamps, show date and time
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Dynamically retrieves a Lucide icon component by name
 * Returns a default icon if the specified icon is not found
 */
const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Activity;

  // Handle common icon name formats (PascalCase, kebab-case)
  const normalizedName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[normalizedName];
  return IconComponent || Activity;
};

/**
 * KPICard - Displays a single KPI metric with status indication
 *
 * Features:
 * - Dynamic icon rendering from Lucide icons library
 * - Status-colored accent border and subtle background gradient
 * - Animated status indicator dot with glow effect
 * - Relative timestamp display
 * - Optional trend indicator
 * - Accessible with proper ARIA attributes
 * - Responsive design with hover states
 */
const KPICard = ({ data, className = '', onClick }: KPICardProps) => {
  const {
    title,
    value,
    unit,
    status = KPIStatus.INFO,
    icon,
    lastUpdated,
    description,
    trend,
  } = data;

  const Icon = useMemo(() => getIconComponent(icon), [icon]);
  const formattedTime = useMemo(() => formatRelativeTime(lastUpdated), [lastUpdated]);

  const isInteractive = Boolean(onClick);

  /**
   * Renders the trend indicator arrow based on trend direction
   */
  const renderTrendIndicator = () => {
    if (!trend) return null;

    const trendConfig = {
      [TrendDirection.UP]: {
        Icon: TrendingUp,
        color: 'text-emerald-400',
        label: 'Trending up',
      },
      [TrendDirection.DOWN]: {
        Icon: TrendingDown,
        color: 'text-red-400',
        label: 'Trending down',
      },
      [TrendDirection.STABLE]: {
        Icon: Minus,
        color: 'text-slate-400',
        label: 'Stable',
      },
    };

    const config = trendConfig[trend];
    const TrendIcon = config.Icon;

    return (
      <div
        className={`flex items-center gap-1 ${config.color}`}
        title={config.label}
        aria-label={config.label}
      >
        <TrendIcon size={14} strokeWidth={2.5} aria-hidden="true" />
      </div>
    );
  };

  return (
    <article
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={`${title}: ${value}${unit ? ` ${unit}` : ''}`}
      className={`
        relative
        bg-slate-800/80
        border border-slate-700/50 border-l-2 ${STATUS_BORDER_COLORS[status]}
        rounded-lg overflow-hidden
        ${isInteractive ? 'cursor-pointer hover:bg-slate-800 active:scale-[0.99]' : ''}
        ${className}
      `}
    >

      {/* Card content */}
      <div className="relative p-4 flex flex-col gap-3">
        {/* Header: Icon and Title */}
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-slate-700/50 text-slate-300">
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
            </div>
            <h3 className="text-sm font-medium text-slate-300 tracking-wide truncate uppercase">
              {title}
            </h3>
          </div>

          {/* Status indicator dot */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {renderTrendIndicator()}
            <div
              className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[status]}`}
              title={`Status: ${status}`}
              aria-label={`Status: ${status}`}
            />
          </div>
        </header>

        {/* Value display */}
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-3xl font-bold text-slate-50 tracking-tight font-mono"
            style={{ fontFeatureSettings: '"tnum" 1' }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm font-medium text-slate-400 tracking-wide">
              {unit}
            </span>
          )}
        </div>

        {/* Footer: Description and Timestamp */}
        <footer className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/30">
          {description && (
            <p className="text-xs text-slate-500 truncate" title={description}>
              {description}
            </p>
          )}
          <time
            dateTime={
              typeof lastUpdated === 'string'
                ? lastUpdated
                : lastUpdated.toISOString()
            }
            className="text-xs text-slate-500 font-mono whitespace-nowrap ml-auto"
          >
            {formattedTime}
          </time>
        </footer>
      </div>

    </article>
  );
};

export default KPICard;
export { KPICard };
export type { KPICardProps };
