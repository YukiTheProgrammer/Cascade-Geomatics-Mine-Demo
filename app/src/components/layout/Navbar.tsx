/**
 * Navbar Component
 *
 * Description:
 * Main navigation bar for the Mine Demo Dashboard application. Features a three-section
 * layout with title/timestamp on the left, tab navigation in the center, and action
 * buttons on the right. Designed with an industrial-utilitarian aesthetic that
 * prioritizes clarity, trust, and scientific precision for quarry operators
 * conducting critical risk analysis.
 *
 * Sample Input:
 * <Navbar />
 *
 * Expected Output:
 * JSX.Element - A fixed header navigation bar containing:
 *   - Left: Dashboard title and last updated timestamp
 *   - Center: TabNavigation with Quick Overview and Live Terrain tabs
 *   - Right: Generate Report button, Settings and Notifications icon buttons
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Settings, Bell } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

/** Navigation tab configuration */
interface NavTab {
  id: string;
  label: string;
  path: string;
}

/** Default navigation tabs for the dashboard */
const NAVIGATION_TABS: NavTab[] = [
  { id: 'overview', label: 'Quick Overview', path: '/' },
  { id: 'terrain', label: 'Live Terrain', path: '/live-terrain' },
];

/**
 * Formats a date object to a readable timestamp string
 * Format: "Jan 18, 2026 10:30 AM"
 */
const formatTimestamp = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Navbar - Main navigation component for the Mine Demo Dashboard
 *
 * Features:
 * - Three-section layout (left, center, right)
 * - Real-time "last updated" timestamp
 * - Integrated tab navigation with active state
 * - Action buttons for report generation and settings
 * - Industrial design aesthetic with amber accent color
 */
const Navbar = () => {
  const location = useLocation();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update timestamp periodically (simulating data refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  /**
   * Determines if a tab path matches the current route
   */
  const isActiveTab = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Handler for Generate Report button
   * Currently logs to console - to be implemented with actual report generation
   */
  const handleGenerateReport = (): void => {
    console.log('Generate Report clicked');
    // TODO: Implement report generation modal/flow
  };

  /**
   * Handler for Settings button
   */
  const handleSettings = (): void => {
    console.log('Settings clicked');
    // TODO: Implement settings panel/modal
  };

  /**
   * Handler for Notifications button
   */
  const handleNotifications = (): void => {
    console.log('Notifications clicked');
    // TODO: Implement notifications panel
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-700/50 shadow-lg shadow-slate-900/20">
      <div className="w-full px-4 lg:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left Section: Title and Last Updated */}
          <div
            data-testid="navbar-left-section"
            className="flex items-center gap-4 min-w-0 flex-shrink-0"
          >
            {/* Dashboard Title */}
            <div className="flex items-center gap-3">
              {/* Status indicator - static */}
              <div
                className="w-2 h-2 rounded-full bg-emerald-500"
                aria-hidden="true"
                title="System online"
              />
              <span className="sr-only">System status: online</span>
              <h1 className="text-lg font-semibold text-slate-100 tracking-tight whitespace-nowrap">
                Mine Demo Dashboard
              </h1>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-700" />

            {/* Last Updated Timestamp */}
            <div
              data-testid="last-updated"
              className="hidden sm:flex items-center gap-2 text-xs text-slate-400"
            >
              <span className="uppercase tracking-wider font-medium text-slate-500">
                Last updated:
              </span>
              <span className="font-mono text-slate-300">
                {formatTimestamp(lastUpdated)}
              </span>
            </div>
          </div>

          {/* Center Section: Tab Navigation */}
          <nav
            className="flex items-center"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
              {NAVIGATION_TABS.map((tab) => {
                const isActive = isActiveTab(tab.path);

                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-md
                      transition-all duration-200 ease-out
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                      ${isActive
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }
                    `}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Section: Action Buttons */}
          <div
            data-testid="navbar-right-section"
            className="flex items-center gap-2 flex-shrink-0"
          >
            {/* Generate Report Button */}
            <button
              type="button"
              onClick={handleGenerateReport}
              className="
                hidden sm:inline-flex items-center gap-2 px-4 py-2
                bg-amber-600 hover:bg-amber-500 active:bg-amber-700
                text-slate-900 font-semibold text-sm
                rounded-lg shadow-md shadow-amber-900/30
                transition-all duration-150 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                active:scale-[0.98]
              "
              aria-label="Generate Report"
            >
              <FileText size={16} strokeWidth={2.5} aria-hidden="true" />
              <span>Generate Report</span>
            </button>

            {/* Mobile Report Button (icon only) */}
            <IconButton
              icon={FileText}
              label="Generate Report"
              variant="primary"
              size="md"
              onClick={handleGenerateReport}
              className="sm:hidden bg-amber-600 hover:bg-amber-500 border-amber-600 hover:border-amber-500"
            />

            {/* Vertical Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-700 mx-1" />

            {/* Settings Button */}
            <IconButton
              icon={Settings}
              label="Settings"
              variant="ghost"
              size="md"
              onClick={handleSettings}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            />

            {/* Notifications Button */}
            <IconButton
              icon={Bell}
              label="Notifications"
              variant="ghost"
              size="md"
              onClick={handleNotifications}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
export { Navbar };
