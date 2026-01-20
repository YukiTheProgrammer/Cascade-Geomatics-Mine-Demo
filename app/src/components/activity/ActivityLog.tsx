/**
 * ActivityLog Component
 *
 * Description:
 * Displays a scrollable list of activity entries in the Mine Demo Dashboard.
 * Shows system events, alerts, scans, and user actions with status indicators
 * and timestamps. Supports filtering by status or type.
 *
 * Sample Input:
 * <ActivityLog
 *   activities={[
 *     { id: 'act-1', timestamp: '2026-01-18T10:30:00Z', type: 'scan',
 *       status: 'success', message: 'Daily terrain scan completed', user: 'System' },
 *     { id: 'act-2', timestamp: '2026-01-18T10:25:00Z', type: 'alert',
 *       status: 'warning', message: 'Slope instability detected in Zone A', user: 'System' }
 *   ]}
 *   title="Recent Activity"
 *   maxItems={10}
 *   showViewAll={true}
 *   onViewAll={() => navigate('/activities')}
 * />
 *
 * Expected Output:
 * A section containing header with title, scrollable activity list, and empty state.
 */

import { useMemo, useState } from 'react';
import { Clock, ChevronRight, Filter, X } from 'lucide-react';

import type { ActivityRow as ActivityRowType, ActivityStatus, ActivityType } from '../../types/activity.js';
import { ActivityRow } from './ActivityRow.js';

interface ActivityLogProps {
  activities: ActivityRowType[];
  maxItems?: number;
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
  filterByStatus?: ActivityStatus;
  filterByType?: ActivityType;
  showFilterControls?: boolean;
}

type FilterOption<T> = { value: T | 'all'; label: string };

const STATUS_FILTER_OPTIONS: FilterOption<ActivityStatus>[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
];

const TYPE_FILTER_OPTIONS: FilterOption<ActivityType>[] = [
  { value: 'all', label: 'All Types' },
  { value: 'scan', label: 'Scan' },
  { value: 'alert', label: 'Alert' },
  { value: 'sensor', label: 'Sensor' },
  { value: 'model', label: 'Model' },
  { value: 'human', label: 'Human' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'system', label: 'System' },
];

function formatHeaderTimestamp(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getTimestamp(value: Date | string): number {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.getTime();
}

function countActiveFilters(status: ActivityStatus | 'all', type: ActivityType | 'all'): number {
  let count = 0;
  if (status !== 'all') count += 1;
  if (type !== 'all') count += 1;
  return count;
}

interface FilterSelectProps<T extends string> {
  id: string;
  label: string;
  value: T | 'all';
  options: FilterOption<T>[];
  onChange: (value: string) => void;
  testId: string;
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  testId,
}: FilterSelectProps<T>): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs font-medium text-slate-400">
        {label}:
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2.5 py-1.5 text-xs bg-slate-800/50 border border-slate-700/50 rounded-md text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        data-testid={testId}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActivityLog({
  activities,
  maxItems = 10,
  title = 'Recent Activity',
  showViewAll = false,
  onViewAll,
  className = '',
  filterByStatus,
  filterByType,
  showFilterControls = false,
}: ActivityLogProps): React.ReactElement {
  const [selectedStatus, setSelectedStatus] = useState<ActivityStatus | 'all'>(
    filterByStatus ?? 'all'
  );
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>(
    filterByType ?? 'all'
  );
  const [showFilters, setShowFilters] = useState(false);

  const displayedActivities = useMemo(() => {
    const statusFilter = filterByStatus ?? (selectedStatus !== 'all' ? selectedStatus : null);
    const typeFilter = filterByType ?? (selectedType !== 'all' ? selectedType : null);

    return activities
      .filter((activity) => {
        if (statusFilter && activity.status !== statusFilter) return false;
        if (typeFilter && activity.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => getTimestamp(b.timestamp) - getTimestamp(a.timestamp))
      .slice(0, maxItems);
  }, [activities, maxItems, filterByStatus, filterByType, selectedStatus, selectedType]);

  const hasActiveFilters = selectedStatus !== 'all' || selectedType !== 'all';
  const activeFilterCount = countActiveFilters(selectedStatus, selectedType);

  function clearFilters(): void {
    setSelectedStatus('all');
    setSelectedType('all');
  }

  return (
    <section
      aria-labelledby="activity-log-title"
      data-testid="activity-log"
      className={`
        bg-slate-800/50
        rounded-lg
        border border-slate-700/30 border-l-2 border-l-slate-500
        overflow-hidden
        ${className}
      `}
    >

      <header className="px-4 py-3 border-b border-slate-700/30">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <h2
              id="activity-log-title"
              data-testid="activity-log-title"
              className="text-base font-semibold text-slate-200 tracking-wide"
            >
              {title}
            </h2>
            <span className="text-slate-600" aria-hidden="true">
              /
            </span>
            <p className="text-sm text-slate-500" data-testid="activity-log-count">
              {displayedActivities.length} of {activities.length} entries
            </p>
          </div>

          <div className="flex items-center gap-4">
            {showFilterControls && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
                  transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                  ${hasActiveFilters
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                  }
                `}
                aria-expanded={showFilters}
                aria-controls="activity-log-filters"
                aria-label={showFilters ? 'Hide activity filters' : 'Show activity filters'}
                data-testid="activity-log-filter-toggle"
              >
                <Filter size={14} strokeWidth={2} aria-hidden="true" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 bg-indigo-500/30 rounded text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {showViewAll && onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded"
                data-testid="activity-log-view-all"
                aria-label="View all activities"
              >
                <span>View All</span>
                <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={14} strokeWidth={2} aria-hidden="true" className="text-slate-600" />
              <time className="font-mono" data-testid="activity-log-timestamp">
                Updated: {formatHeaderTimestamp()}
              </time>
            </div>
          </div>
        </div>

        {showFilterControls && showFilters && (
          <div
            id="activity-log-filters"
            className="mt-4 pt-4 border-t border-slate-700/30 flex items-center gap-4 flex-wrap"
            data-testid="activity-log-filters"
          >
            <FilterSelect
              id="status-filter"
              label="Status"
              value={selectedStatus}
              options={STATUS_FILTER_OPTIONS}
              onChange={(value) => setSelectedStatus(value as ActivityStatus | 'all')}
              testId="activity-log-status-filter"
            />

            <FilterSelect
              id="type-filter"
              label="Type"
              value={selectedType}
              options={TYPE_FILTER_OPTIONS}
              onChange={(value) => setSelectedType(value as ActivityType | 'all')}
              testId="activity-log-type-filter"
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded"
                data-testid="activity-log-clear-filters"
                aria-label="Clear all filters"
              >
                <X size={12} strokeWidth={2} aria-hidden="true" />
                <span>Clear</span>
              </button>
            )}
          </div>
        )}
      </header>

      <div className="relative p-5" data-testid="activity-log-content">
        {displayedActivities.length > 0 ? (
          <div
            className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
            role="list"
            aria-label={`${title} list`}
            data-testid="activity-log-list"
          >
            <div className="space-y-2">
              {displayedActivities.map((activity) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  data-testid={`activity-row-${activity.id}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className="py-12 text-center"
            data-testid="activity-log-empty"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/30 mb-4">
              <Clock size={24} className="text-slate-500" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">
              No activities found
            </p>
            <p className="text-xs text-slate-500">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results.'
                : 'Activity entries will appear here as they occur.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export { ActivityLog };
export type { ActivityLogProps };
