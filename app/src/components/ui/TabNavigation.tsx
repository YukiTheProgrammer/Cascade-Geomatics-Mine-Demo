/**
 * TabNavigation Component
 *
 * Description:
 * A reusable navigation component with tabs for switching between pages in the
 * Mine Demo Dashboard. Supports both controlled (via onTabChange callback) and
 * uncontrolled (via react-router-dom navigation) usage patterns. Designed with
 * an industrial-utilitarian aesthetic that prioritizes clarity and trust for
 * quarry operators monitoring critical geological data.
 *
 * Sample Input:
 * <TabNavigation
 *   tabs={[
 *     { id: 'overview', label: 'Quick Overview', path: '/' },
 *     { id: 'terrain', label: 'Live Terrain', path: '/live-terrain' }
 *   ]}
 *   activeTab="overview"
 *   onTabChange={(tabId) => console.log('Tab changed:', tabId)}
 * />
 *
 * Expected Output:
 * JSX.Element - A horizontal tab navigation bar with:
 *   - Clickable tab items that navigate to specified paths
 *   - Visual indicator (animated underline) for the active tab
 *   - Smooth hover and focus states for accessibility
 *   - Responsive design that adapts to container width
 */

import { Link, useLocation } from 'react-router-dom';

/**
 * Tab configuration object for navigation items
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label shown in the navigation */
  label: string;
  /** Route path for navigation */
  path: string;
}

/**
 * Props for the TabNavigation component
 */
export interface TabNavigationProps {
  /** Array of tab configuration objects */
  tabs: Tab[];
  /** Currently active tab identifier (id or path) */
  activeTab?: string;
  /** Optional callback fired when a tab is clicked (for controlled usage) */
  onTabChange?: (tabId: string) => void;
  /** Optional additional CSS classes for the container */
  className?: string;
}

/**
 * TabNavigation - A navigation component for switching between dashboard pages
 *
 * Features:
 * - Automatic active state detection via react-router-dom useLocation
 * - Support for controlled mode via activeTab prop and onTabChange callback
 * - Animated underline indicator with smooth transitions
 * - Accessible keyboard navigation and focus states
 * - Industrial color palette suited for professional monitoring dashboards
 */
const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabNavigationProps) => {
  const location = useLocation();

  /**
   * Determines if a tab is currently active based on:
   * 1. The activeTab prop (if provided)
   * 2. The current route path matching the tab's path
   */
  const isTabActive = (tab: Tab): boolean => {
    // Check if activeTab matches either the tab's id or path
    if (activeTab) {
      return activeTab === tab.id || activeTab === tab.path;
    }
    // Fall back to route-based detection
    return location.pathname === tab.path;
  };

  /**
   * Handles tab click events
   * Calls the onTabChange callback if provided (controlled mode)
   */
  const handleTabClick = (tab: Tab): void => {
    if (onTabChange) {
      onTabChange(tab.id);
    }
  };

  return (
    <nav
      className={`relative ${className}`}
      role="tablist"
      aria-label="Dashboard navigation"
    >
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);

          return (
            <Link
              key={tab.id}
              to={tab.path}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleTabClick(tab)}
              className={`
                group relative flex flex-col items-center px-4 py-2.5
                text-sm font-medium tracking-wide no-underline
                transition-all duration-200 ease-out rounded-t-md
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
                select-none cursor-pointer
                ${isActive
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <span className="relative z-10 whitespace-nowrap">
                {tab.label}
              </span>

              {/* Animated underline indicator */}
              <span
                className={`
                  absolute bottom-0 left-2 right-2 h-0.5
                  rounded-full transition-all duration-300 ease-out
                  ${isActive
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 scale-x-100 shadow-[0_0_8px_rgba(217,119,6,0.4),0_0_2px_rgba(217,119,6,0.6)]'
                    : 'bg-transparent scale-x-0 group-hover:bg-slate-200 group-hover:scale-x-75 group-focus-visible:bg-slate-300 group-focus-visible:scale-x-100'
                  }
                `}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
