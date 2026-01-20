/**
 * InformationMenu Component
 *
 * Description:
 * A unified tabbed interface panel that provides access to 4 information categories:
 * Data (weather KPIs for selected annotation), Installations (tower hardware status),
 * Events (historical geological events), and Tracking (vehicle tracking). Displays
 * as a persistent sidebar panel on the right side of the viewport.
 *
 * Sample Input:
 * <InformationMenu
 *   selectedAnnotation={selectedAnnotation}
 *   onEventSelect={(event) => console.log('Selected:', event)}
 *   onVehicleSelect={(vehicle) => console.log('Selected:', vehicle)}
 * />
 *
 * Expected Output:
 * A persistent right-side panel containing:
 *   - Header with "Information" title
 *   - 4 horizontal tabs (Data, Installations, Events, Tracking)
 *   - Tab content area with respective panel content
 *   - Keyboard accessible tab navigation
 */

import { type FC, useState, useCallback, useRef, useEffect } from 'react';
import { Info, MousePointer, RadioTower, History, Truck } from 'lucide-react';
import { type PastEvent, type TrackedVehicle } from '@/types/kpi';
import {
  DataTabContent,
  InstallationsTabContent,
  EventsTabContent,
  TrackingTabContent,
  type AnnotationInput,
} from './InformationMenuTabs';

/** Tab identifiers for the information menu */
type TabId = 'data' | 'installations' | 'events' | 'tracking';

/** Props for the InformationMenu component */
interface InformationMenuProps {
  selectedAnnotation?: AnnotationInput | null;
  onAnnotationPanelClose?: () => void;
  onEventSelect?: (event: PastEvent) => void;
  onVehicleSelect?: (vehicle: TrackedVehicle) => void;
  /** Optional controlled active tab - if provided, component becomes controlled */
  activeTab?: TabId;
  /** Callback when tab changes - required when activeTab is provided for controlled mode */
  onTabChange?: (tab: TabId) => void;
  className?: string;
}

/** Tab configuration */
const TABS: { id: TabId; label: string; icon: typeof Info }[] = [
  { id: 'data', label: 'Data', icon: MousePointer },
  { id: 'installations', label: 'Towers', icon: RadioTower },
  { id: 'events', label: 'Events', icon: History },
  { id: 'tracking', label: 'Tracking', icon: Truck },
];

/**
 * InformationMenu - Unified tabbed interface for all information panels
 *
 * Features:
 * - Persistent sidebar panel on the right side
 * - 4 tabs: Data, Installations, Events, Tracking
 * - Keyboard accessible tab navigation (arrow keys)
 * - Dark design matching the terrain viewer
 * - Full accessibility with ARIA attributes
 */
const InformationMenu: FC<InformationMenuProps> = ({
  selectedAnnotation,
  onEventSelect,
  onVehicleSelect,
  activeTab: controlledActiveTab,
  onTabChange,
  className = '',
}) => {
  // Support both controlled and uncontrolled modes
  const [internalActiveTab, setInternalActiveTab] = useState<TabId>('data');
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());
  // Track previous annotation to detect new selections
  const prevAnnotationRef = useRef<AnnotationInput | null | undefined>(undefined);

  // Use controlled value if provided, otherwise use internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;

  // Handle tab change - update internal state and call callback
  const handleTabChange = useCallback(
    (newTab: TabId) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(newTab);
      }
      onTabChange?.(newTab);
    },
    [controlledActiveTab, onTabChange]
  );

  /**
   * Auto-switch to appropriate tab when a NEW annotation is selected
   * This provides a seamless experience where clicking an annotation
   * immediately shows its data in the sidebar, but allows users to
   * freely switch tabs after the initial auto-switch.
   *
   * - Tower annotations (type: 'installation') do NOT trigger auto-switch
   * - Vehicle annotations (type: 'vehicle') switch to 'tracking' tab
   * - Data annotations switch to 'data' tab
   */
  useEffect(() => {
    const prevAnnotation = prevAnnotationRef.current;
    const isNewSelection =
      selectedAnnotation &&
      (!prevAnnotation || prevAnnotation.id !== selectedAnnotation.id);

    // Only auto-switch for non-tower annotations
    const isTowerAnnotation = selectedAnnotation?.type === 'installation';
    const isVehicleAnnotation = selectedAnnotation?.type === 'vehicle';

    if (isNewSelection && !isTowerAnnotation) {
      if (isVehicleAnnotation) {
        handleTabChange('tracking');
      } else {
        handleTabChange('data');
      }
    }

    prevAnnotationRef.current = selectedAnnotation;
  }, [selectedAnnotation, handleTabChange]);

  /** Handle keyboard navigation between tabs */
  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, currentTabId: TabId) => {
      const currentIndex = TABS.findIndex((tab) => tab.id === currentTabId);
      let newIndex = currentIndex;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = (currentIndex + 1) % TABS.length;
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      } else if (event.key === 'Home') {
        event.preventDefault();
        newIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        newIndex = TABS.length - 1;
      }

      if (newIndex !== currentIndex) {
        const newTabId = TABS[newIndex].id;
        handleTabChange(newTabId);
        tabRefs.current.get(newTabId)?.focus();
      }
    },
    [handleTabChange]
  );


  return (
    <div
      className={`h-full w-[340px] flex-shrink-0 bg-slate-900/95 border-l border-slate-700/40 ${className}`}
      role="region"
      aria-label="Information panel"
      data-testid="information-menu"
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <Info size={16} strokeWidth={1.5} className="text-sky-400" aria-hidden="true" />
            <h2
              className="text-sm font-semibold text-slate-100 tracking-wide"
              data-testid="information-menu-title"
            >
              Information
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Information categories"
          className="flex-shrink-0 flex border-b border-slate-700/50"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 text-[10px] font-medium uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-inset ${
                  isActive
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-slate-500 border-b-2 border-transparent hover:text-slate-300'
                }`}
                type="button"
                data-testid={`info-tab-${tab.id}`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <div
            role="tabpanel"
            id="tabpanel-data"
            aria-labelledby="tab-data"
            hidden={activeTab !== 'data'}
            className="p-4"
            data-testid="info-content-data"
          >
            {activeTab === 'data' && <DataTabContent annotation={selectedAnnotation ?? null} />}
          </div>

          <div
            role="tabpanel"
            id="tabpanel-installations"
            aria-labelledby="tab-installations"
            hidden={activeTab !== 'installations'}
            className="p-4"
            data-testid="info-content-installations"
          >
            {activeTab === 'installations' && <InstallationsTabContent selectedAnnotation={selectedAnnotation} />}
          </div>

          <div
            role="tabpanel"
            id="tabpanel-events"
            aria-labelledby="tab-events"
            hidden={activeTab !== 'events'}
            className="p-4"
            data-testid="info-content-events"
          >
            {activeTab === 'events' && <EventsTabContent onEventSelect={onEventSelect} />}
          </div>

          <div
            role="tabpanel"
            id="tabpanel-tracking"
            aria-labelledby="tab-tracking"
            hidden={activeTab !== 'tracking'}
            className="p-4"
            data-testid="info-content-tracking"
          >
            {activeTab === 'tracking' && <TrackingTabContent selectedAnnotation={selectedAnnotation} onVehicleSelect={onVehicleSelect} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationMenu;
export { InformationMenu };
export type { InformationMenuProps, AnnotationInput, TabId };
