# Phase 12: Live Terrain - Information Menu Integration
## Agent Assignment Plan

**Phase Goal**: Create a unified InformationMenu container component that provides a tabbed interface for accessing all 4 existing panels (OnClickData, Installations, PastEvents, Tracking) with smooth transitions, replacing the individual toggle buttons with a cleaner, more integrated UI.

**Date**: 2026-01-18
**Model Assignment**: Opus 4.5 (claude-opus-4-5-20251101)

---

## Current State Analysis

### What Already Exists
The LiveTerrain page (`app/src/pages/LiveTerrain.tsx`) currently has:
- 4 fully functional panel components:
  1. `OnClickDataPanel` - Weather KPIs when annotation clicked
  2. `InstallationsPanel` - Tower hardware monitoring (5 towers, 4 hardware types each)
  3. `PastEventsPanel` - Historical geological events (3 events)
  4. `TrackingPanel` - Vehicle tracking (6 vehicles)
- 3 individual toggle buttons on the left side (Installations, Past Events, Tracking)
- OnClickDataPanel opens via annotation clicks

### What Phase 12 Will Change
1. Create a unified `InformationMenu` component with tabbed navigation
2. Integrate all 4 panels into this single container
3. Replace individual toggle buttons with a single menu toggle
4. Add smooth transitions between sections
5. Keep OnClickDataPanel openable via annotation clicks (dual trigger)

---

## Task Analysis Summary

### Components to Create
1. **InformationMenu.tsx** - Main container component with:
   - Tab navigation (Data, Installations, Events, Tracking)
   - Section switching logic
   - Animation/transitions between sections
   - Single toggle button for opening/closing

### Components to Modify
1. **LiveTerrain.tsx** - Replace individual panel toggles with InformationMenu
2. **pointcloud/index.ts** - Add InformationMenu export

### Files to Create
1. `app/src/components/pointcloud/InformationMenu.tsx` - Container component
2. `app/tests/information-menu.spec.ts` - E2E tests

### Dependencies Analysis
```
Existing Panels (already complete)
     |
     v
InformationMenu.tsx (integrates panels)
     |
     v
LiveTerrain.tsx (integration) + index.ts (export)
     |
     v
information-menu.spec.ts (tests)
```

---

## Agent Assignments

### Agent 1: InformationMenu Component Agent
**Model**: Opus 4.5
**Priority**: HIGH (blocks Agent 2)
**Estimated Time**: 45-60 minutes

**Task Description**:
Create the InformationMenu container component that provides a unified tabbed interface for all 4 panels.

**Files to Create**:
1. **CREATE** `app/src/components/pointcloud/InformationMenu.tsx`

**Component Structure**:
```
InformationMenu
  - Toggle Button (positioned on left side when closed)
    - Menu icon (hamburger/panel icon)
    - Opens/closes the entire menu
  - Menu Panel (floating on right side)
    - Header Section
      - Title: "Information"
      - Close button (X)
    - Tab Navigation
      - 4 tabs: "Data", "Installations", "Events", "Tracking"
      - Active tab highlighted with sky-500 color
      - Icons for each tab
    - Content Area (animated transitions)
      - Renders selected panel content
      - Only one panel visible at a time
      - Smooth fade/slide transitions
```

**Props Interface**:
```typescript
interface InformationMenuProps {
  /** Currently selected annotation (for OnClickDataPanel) */
  selectedAnnotation: AnnotationInput | null;
  /** Callback when OnClickData panel closes */
  onDataPanelClose: () => void;
  /** Callback when a past event is selected */
  onPastEventSelect?: (event: PastEvent) => void;
  /** Callback when a vehicle is selected */
  onVehicleSelect?: (vehicle: TrackedVehicle) => void;
  /** Optional additional className */
  className?: string;
}
```

**Internal State**:
- `isOpen: boolean` - Controls menu visibility
- `activeSection: 'data' | 'installations' | 'events' | 'tracking'` - Current active tab

**Design Requirements**:
- Dark glassmorphic design: `bg-slate-900/95 backdrop-blur-xl`
- Panel width: 380px (slightly wider to accommodate tab nav)
- Sliding from right edge with transform animation
- Tab navigation uses icons + labels:
  - Data: `MousePointer2` icon
  - Installations: `RadioTower` icon
  - Events: `History` icon
  - Tracking: `Truck` icon
- Tab bar styling:
  - Horizontal tabs at top of panel
  - Active tab: `bg-sky-500/20 text-sky-400 border-b-2 border-sky-500`
  - Inactive tab: `text-slate-400 hover:text-slate-200`
- Content transitions: CSS transition on opacity and transform
- Toggle button on left side (matches existing button style)

**Panel Content Rendering**:
The InformationMenu should render panel CONTENT (not the panel container) for each tab:
- Extract the inner content from each panel
- OR render panels with `isOpen={true}` always but control visibility via parent

**Recommended Approach**: Create wrapper that conditionally renders panels:
```tsx
{activeSection === 'data' && (
  <OnClickDataPanelContent annotation={selectedAnnotation} />
)}
{activeSection === 'installations' && (
  <InstallationsPanelContent />
)}
// etc.
```

**Alternative Approach** (simpler, recommended):
Since panels already exist and work, render all 4 panels but:
- Only show the active panel's content area
- Hide others with CSS (`hidden` class or `opacity-0 pointer-events-none`)
- This avoids refactoring existing panels

**Test IDs Required**:
- `information-menu-toggle` - Toggle button to open/close menu
- `information-menu` - Main menu container
- `information-menu-close` - Close button
- `information-menu-tab-data` - Data tab
- `information-menu-tab-installations` - Installations tab
- `information-menu-tab-events` - Events tab
- `information-menu-tab-tracking` - Tracking tab
- `information-menu-content` - Content area container

**Accessibility Requirements**:
- `role="dialog"` and `aria-modal="true"` on menu panel
- `aria-label="Information menu"` on menu
- `role="tablist"` on tab navigation
- `role="tab"` on each tab button with `aria-selected`
- `role="tabpanel"` on content area
- `aria-expanded` on toggle button
- Keyboard navigation: Tab between tabs, Enter/Space to select

**Acceptance Criteria**:
- [ ] Toggle button shows on left side when menu is closed
- [ ] Clicking toggle opens menu on right side
- [ ] 4 tabs are visible and clickable
- [ ] Tab switching shows different content
- [ ] Content transitions are smooth (not jarring)
- [ ] Close button closes the menu
- [ ] Dark glassmorphic styling matches existing panels
- [ ] All test IDs are present
- [ ] Full accessibility support
- [ ] File header with documentation (Description, Sample Input, Expected Output)
- [ ] File under 500 lines

**Reference Files**:
- `app/src/components/pointcloud/InstallationsPanel.tsx` - Panel styling pattern
- `app/src/components/pointcloud/PastEventsPanel.tsx` - Panel structure
- `app/src/components/pointcloud/TrackingPanel.tsx` - Panel pattern
- `app/src/components/pointcloud/OnClickDataPanel.tsx` - Data panel pattern

---

### Agent 2: Integration Agent
**Model**: Opus 4.5
**Priority**: MEDIUM (depends on Agent 1)
**Estimated Time**: 20-30 minutes

**Task Description**:
Integrate the InformationMenu into the LiveTerrain page, replacing the individual panel toggles, and update barrel exports.

**Files to Modify**:
1. **MODIFY** `app/src/components/pointcloud/index.ts`
   - Add export for InformationMenu component
   - Add export for InformationMenuProps type

2. **MODIFY** `app/src/pages/LiveTerrain.tsx`

**LiveTerrain Changes**:

**Remove**:
- Individual toggle buttons for Installations, Past Events, Tracking (lines ~178-233)
- Individual panel renders for InstallationsPanel, PastEventsPanel, TrackingPanel (keep OnClickDataPanel for annotation clicks)
- State variables: `isInstallationsPanelOpen`, `isPastEventsPanelOpen`, `isTrackingPanelOpen`
- Handler functions: `handleToggleInstallationsPanel`, `handleCloseInstallationsPanel`, etc.

**Keep/Modify**:
- `selectedAnnotation` state - pass to InformationMenu
- `isPanelOpen` state for OnClickDataPanel - keep for annotation click trigger
- `handlePanelClose` - pass to InformationMenu
- `handlePastEventSelect`, `handleVehicleSelect` - pass to InformationMenu

**Add**:
- Import InformationMenu from pointcloud components
- Render InformationMenu component with props

**Updated Component Structure**:
```tsx
<div ref={containerRef} className="...">
  <PointCloudViewer ... />
  <ViewModeMenu ... />

  {/* Keep OnClickDataPanel for annotation click trigger */}
  <OnClickDataPanel
    annotation={selectedAnnotation}
    isOpen={isPanelOpen}
    onClose={handlePanelClose}
  />

  {/* New unified menu */}
  <InformationMenu
    selectedAnnotation={selectedAnnotation}
    onDataPanelClose={handlePanelClose}
    onPastEventSelect={handlePastEventSelect}
    onVehicleSelect={handleVehicleSelect}
  />

  {/* Keep hidden color mode indicator */}
  <div data-testid="pointcloud-color-mode" ...>...</div>
</div>
```

**Design Decision**:
The OnClickDataPanel should remain separately for annotation click triggers (opens automatically when annotation clicked). The InformationMenu provides a second way to access the same data via its "Data" tab.

**Alternative Design** (simpler):
Remove standalone OnClickDataPanel entirely and only access it through InformationMenu. When annotation is clicked:
1. Open InformationMenu
2. Switch to "Data" tab
3. Display annotation data

This is cleaner but changes the current UX. Recommend discussing with user.

**Acceptance Criteria**:
- [ ] InformationMenu toggle visible on LiveTerrain page
- [ ] Toggle button opens InformationMenu
- [ ] Individual panel toggle buttons removed
- [ ] All 4 sections accessible via tabs
- [ ] Annotation clicks still work (either opens Data tab or separate panel)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Export works from pointcloud index

**Reference Files**:
- `app/src/pages/LiveTerrain.tsx` - Current implementation
- `app/src/components/pointcloud/index.ts` - Export pattern

---

### Agent 3: Testing Agent
**Model**: Opus 4.5
**Priority**: MEDIUM (depends on Agents 1 & 2)
**Estimated Time**: 45-60 minutes

**Task Description**:
Create comprehensive E2E tests for the InformationMenu component following established test patterns.

**Files to Create**:
1. **CREATE** `app/tests/information-menu.spec.ts`

**Test Structure**:
```typescript
/**
 * InformationMenu Component Test Specifications
 *
 * Description:
 * Playwright end-to-end tests for the InformationMenu component that provides
 * a unified tabbed interface for all information panels (Data, Installations,
 * Events, Tracking) in the Mine Demo Dashboard.
 *
 * Sample Input:
 * - Page load at "/live-terrain"
 * - User clicks toggle to open menu
 * - User clicks tabs to switch sections
 * - User interacts with panel content
 *
 * Expected Output:
 * - Menu opens/closes with animation
 * - All 4 tabs are accessible
 * - Tab switching shows correct content
 * - Content functions correctly within tabs
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('InformationMenu Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/live-terrain`);
    await page.waitForSelector('[data-testid="pointcloud-viewer"]', { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  test.describe('Menu Toggle', () => {
    // - Toggle button is visible on page load
    // - Clicking toggle opens menu
    // - Clicking toggle again closes menu
    // - Toggle has aria-expanded attribute
    // - Toggle button has correct icon/label
  });

  test.describe('Menu Rendering', () => {
    // - Menu has correct title
    // - Menu has close button
    // - Close button closes menu
    // - Menu has proper ARIA attributes (role="dialog")
    // - Menu has glassmorphic styling
  });

  test.describe('Tab Navigation', () => {
    // - All 4 tabs are visible
    // - Data tab is accessible
    // - Installations tab is accessible
    // - Events tab is accessible
    // - Tracking tab is accessible
    // - Active tab is highlighted
    // - Clicking tab switches content
    // - Tabs have proper ARIA attributes (role="tab", aria-selected)
  });

  test.describe('Data Section', () => {
    // - Data section shows when Data tab clicked
    // - Shows placeholder/empty state when no annotation selected
    // - Shows annotation data when annotation available
    // - Weather KPIs display correctly
  });

  test.describe('Installations Section', () => {
    // - Installations section shows when tab clicked
    // - Shows 5 tower installations
    // - Tower expansion works
    // - Hardware items display
  });

  test.describe('Events Section', () => {
    // - Events section shows when tab clicked
    // - Shows 3 past events
    // - Event details display correctly
    // - Similarity percentages show
  });

  test.describe('Tracking Section', () => {
    // - Tracking section shows when tab clicked
    // - Shows 6 tracked vehicles
    // - Vehicle status indicators work
    // - Legend displays
  });

  test.describe('Section Switching', () => {
    // - Switching from Data to Installations works
    // - Switching from Installations to Events works
    // - Switching from Events to Tracking works
    // - Switching back to Data works
    // - Content transitions smoothly
    // - Previous section content hidden
  });

  test.describe('Accessibility', () => {
    // - Menu has role="dialog"
    // - Tabs have role="tablist" container
    // - Individual tabs have role="tab"
    // - Content has role="tabpanel"
    // - Close button has aria-label
    // - Keyboard navigation works (Tab, Enter, Space)
    // - Arrow keys navigate between tabs
  });

  test.describe('Responsive Behavior', () => {
    // - Menu works on tablet viewport
    // - Menu works on smaller desktop viewport
    // - Menu doesn't overflow viewport
  });

  test.describe('Integration', () => {
    // - Menu state persists after viewer interaction
    // - Tab state persists after viewer interaction
    // - No console errors during interactions
    // - View mode changes don't affect menu
  });

  test.describe('Edge Cases', () => {
    // - Rapid tab switching works correctly
    // - Rapid open/close works correctly
    // - Navigation away and back resets state
    // - Multiple open/close cycles work
  });
});
```

**Test Data Expectations**:
- Data tab: Shows annotation data or empty state
- Installations: 5 towers, each with 4 hardware items
- Events: 3 past events with similarity percentages
- Tracking: 6 vehicles with varied statuses

**Testing Conventions**:
- Use `data-testid` selectors
- Wait for animations (300-500ms)
- Filter expected console errors (WebGL, LAS, 404)
- Test names should complete "It should..."
- One assertion concept per test
- Follow patterns from existing tests

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] Menu toggle works
- [ ] All 4 tabs accessible
- [ ] Tab switching works smoothly
- [ ] Content displays correctly in each tab
- [ ] No flaky tests
- [ ] Follows existing test patterns exactly
- [ ] File header with documentation

**Reference Files**:
- `app/tests/tracking-panel.spec.ts` - Primary test pattern
- `app/tests/installations-panel.spec.ts` - Secondary test pattern
- `app/tests/past-events-panel.spec.ts` - Additional reference

---

## Execution Order

```
Phase 1 (Sequential - Component):
  Agent 1: InformationMenu Component Agent
    |
    v
Phase 2 (Sequential - Integration):
  Agent 2: Integration Agent
    |
    v
Phase 3 (Sequential - Testing):
  Agent 3: Testing Agent (run all tests)
```

### Dependency Matrix

| Agent | Depends On | Blocks |
|-------|------------|--------|
| Agent 1 (Component) | None (uses existing panels) | Agent 2, Agent 3 |
| Agent 2 (Integration) | Agent 1 | Agent 3 |
| Agent 3 (Testing) | Agent 1, Agent 2 | None |

---

## Parallel Execution Opportunities

**Limited parallelism** - This phase is mostly sequential:

1. **Agent 1 must complete first**: The component must exist before integration
2. **Agent 2 depends on Agent 1**: Cannot integrate what doesn't exist
3. **Agent 3 depends on both**: Tests require working component + integration

**Potential parallel work**:
- Agent 3 can scaffold test file structure while Agent 2 works
- Agent 3 can write test descriptions/setup while waiting

**Recommended Execution**:
- **Step 1**: Agent 1 creates InformationMenu component
- **Step 2**: Agent 2 integrates into LiveTerrain
- **Step 3**: Agent 3 writes and runs tests

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tab content overflow | Medium | Low | Use flex/overflow-auto patterns from existing panels |
| Animation jank | Low | Medium | Use CSS transitions, not JS animations |
| Z-index conflicts | Low | Medium | Use z-30 like other panels |
| Panel content styling issues | Medium | Medium | Keep panel internals unchanged, only wrap |
| Test flakiness | Low | Low | Use established wait patterns |

---

## Design Decision Points

### Decision 1: OnClickDataPanel Behavior
**Options**:
A) Keep OnClickDataPanel separate - Opens via annotation click, also accessible via menu
B) Remove OnClickDataPanel - Only accessible via InformationMenu Data tab

**Recommendation**: Option A (keep separate)
- Preserves existing UX for annotation interactions
- Users can still click annotations to see data immediately
- Menu provides alternative access path
- Less refactoring required

### Decision 2: Panel Content Integration
**Options**:
A) Extract panel content into separate components, reuse in menu
B) Render full panels with CSS show/hide
C) Create new simplified content components for menu

**Recommendation**: Option B (render with CSS show/hide)
- Simplest implementation
- No refactoring of existing working panels
- Maintains all existing functionality
- Only needs wrapper/visibility logic

### Decision 3: Default Active Tab
**Options**:
A) Data tab (most commonly used)
B) Installations tab (hardware monitoring primary use case)
C) Remember last used tab

**Recommendation**: Option B (Installations)
- Hardware monitoring is primary dashboard use case
- Data tab may be empty if no annotation selected
- Tracking and Events are secondary features

---

## Success Criteria

Phase 12 is complete when:
- [ ] `InformationMenu.tsx` component created and working
- [ ] Component integrated into LiveTerrain page
- [ ] Individual panel toggle buttons removed
- [ ] Single toggle button opens unified menu
- [ ] All 4 tabs (Data, Installations, Events, Tracking) accessible
- [ ] Tab switching works with smooth transitions
- [ ] Content displays correctly in each tab
- [ ] All existing panel functionality preserved
- [ ] Dark glassmorphic styling consistent with existing panels
- [ ] Full accessibility support (ARIA, keyboard navigation)
- [ ] All E2E tests pass
- [ ] No console errors during normal operation
- [ ] File sizes under 500 lines

---

## Implementation Notes

1. **Keep existing panels**: The InformationMenu wraps/contains existing panels, doesn't replace their code
2. **CSS transitions**: Use `transition-opacity duration-300` and similar for smooth tab switching
3. **Tab state**: Store active tab in component state, not external
4. **Panel z-index**: Menu should use z-30 (same as existing panels)
5. **Toggle button position**: Left side, similar position to current buttons (~top-[460px])
6. **File organization**: Keep InformationMenu in `components/pointcloud/` with other panels

---

## Agent Communication Protocol

When agents complete their tasks, they should:
1. Verify all acceptance criteria are met
2. Ensure no TypeScript/ESLint errors
3. Run related tests to verify functionality
4. Report completion status with any notes
5. List any deviations from the plan with justification
6. Document any decisions made during implementation

---

## Files Summary

### Files to Create
| File | Agent | Description |
|------|-------|-------------|
| `app/src/components/pointcloud/InformationMenu.tsx` | Agent 1 | Main container component |
| `app/tests/information-menu.spec.ts` | Agent 3 | E2E tests |

### Files to Modify
| File | Agent | Changes |
|------|-------|---------|
| `app/src/components/pointcloud/index.ts` | Agent 2 | Add InformationMenu export |
| `app/src/pages/LiveTerrain.tsx` | Agent 2 | Replace panel toggles with InformationMenu |

### Reference Files (Read Only)
- `app/src/components/pointcloud/InstallationsPanel.tsx`
- `app/src/components/pointcloud/PastEventsPanel.tsx`
- `app/src/components/pointcloud/TrackingPanel.tsx`
- `app/src/components/pointcloud/OnClickDataPanel.tsx`
- `app/tests/tracking-panel.spec.ts`
- `app/tests/installations-panel.spec.ts`
