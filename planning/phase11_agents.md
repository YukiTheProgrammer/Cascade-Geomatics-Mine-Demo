# Phase 11: Live Terrain - Tracking Panel
## Agent Assignment Plan

**Phase Goal**: Create a TrackingPanel component for vehicle tracking on the mine terrain, including tracked vehicles list, placeholder mesh overlays, and legend for vehicle types.

**Date**: 2026-01-18
**Model Assignment**: Opus 4.5 (claude-opus-4-5-20251101)

---

## Task Analysis Summary

### Components to Create
1. **Data Layer**: `trackingData.ts` - Vehicle tracking data with types, positions, statuses
2. **Type Extensions**: Add vehicle tracking types to `kpi.ts`
3. **Constants**: Add vehicle type constants to `constants.ts`
4. **Component**: `TrackingPanel.tsx` - Main panel component with vehicle list and legend
5. **Integration**: Update `LiveTerrain.tsx` with toggle button and panel
6. **Export**: Update `pointcloud/index.ts` barrel export
7. **Tests**: `tracking-panel.spec.ts` - E2E tests for the panel

### Dependencies Analysis
```
constants.ts (vehicle types) ---> kpi.ts (vehicle interfaces)
                                       |
                                       v
                               trackingData.ts (mock data)
                                       |
                                       v
                               TrackingPanel.tsx (component)
                                       |
                                       v
                        LiveTerrain.tsx (integration) + index.ts (export)
                                       |
                                       v
                               tracking-panel.spec.ts (tests)
```

---

## Agent Assignments

### Agent 1: Data Foundation Agent
**Model**: Opus 4.5
**Priority**: HIGH (blocks Agent 2)
**Estimated Time**: 20-30 minutes

**Task Description**:
Create the foundational data layer for vehicle tracking, including type definitions and mock data.

**Files to Create/Modify**:
1. **MODIFY** `app/src/utils/constants.ts`
   - Add `VEHICLE_TYPES` constant (Truck, Excavator, Dozer, Loader, Water Truck)
   - Add `VEHICLE_COLORS` constant mapping for visualization
   - Add `VEHICLE_STATUS` constant (active, idle, offline)

2. **MODIFY** `app/src/types/kpi.ts`
   - Add `VehicleType` enum/const
   - Add `VehicleStatus` enum/const
   - Add `TrackedVehicle` interface:
     ```typescript
     interface TrackedVehicle {
       id: string;
       name: string;
       vehicleType: VehicleType;
       status: VehicleStatus;
       lastUpdate: Date | string;
       worldPosition: WorldPosition;
       color: string;
       metadata?: {
         operator?: string;
         speed?: number;
         fuelLevel?: number;
       };
     }
     ```

3. **CREATE** `app/src/data/trackingData.ts`
   - Follow pattern from `installationsData.ts` and `pastEventsData.ts`
   - Create 5-7 mock vehicles with varied types, statuses, and positions
   - Include:
     - `getTrackedVehicles()` - returns all vehicles
     - `getTrackedVehicleById(id)` - get single vehicle
     - `getVehiclesByType(type)` - filter by type
     - `getVehiclesByStatus(status)` - filter by status
     - `getVehicleStatusCounts()` - counts per status
     - `clearVehicleCache()` - for testing

**Acceptance Criteria**:
- [ ] All type definitions compile without errors
- [ ] Constants follow existing naming patterns
- [ ] Mock data includes vehicles at different positions across point cloud
- [ ] All helper functions are exported and documented
- [ ] File headers follow project convention (Description, Sample Input, Expected Output)

**Reference Files**:
- `app/src/utils/constants.ts` - for constant patterns
- `app/src/types/kpi.ts` - for type patterns
- `app/src/data/installationsData.ts` - for data module pattern

---

### Agent 2: Component Agent
**Model**: Opus 4.5
**Priority**: HIGH (depends on Agent 1)
**Estimated Time**: 40-60 minutes

**Task Description**:
Create the TrackingPanel component following the established panel pattern from InstallationsPanel and PastEventsPanel.

**Files to Create**:
1. **CREATE** `app/src/components/pointcloud/TrackingPanel.tsx`

**Component Requirements**:

**Structure** (following InstallationsPanel pattern):
```
TrackingPanel
  - Header Section
    - Icon (Truck from lucide-react)
    - Title "Vehicle Tracking"
    - Subtitle showing vehicle count
    - Close button
  - Vehicle List (scrollable)
    - VehicleCard for each tracked vehicle
      - Color indicator (vehicle type color)
      - Vehicle name/ID
      - Type badge
      - Status indicator (active/idle/offline)
      - Last update time
  - Legend Section (footer)
    - Vehicle type icons with colors
    - Status indicators explanation
  - Footer note
```

**Design Requirements**:
- Dark glassmorphic design: `bg-slate-900/95 backdrop-blur-xl`
- Panel width: 340px (same as other panels)
- Sliding from right edge with transform animation
- Status colors:
  - Active: emerald
  - Idle: amber
  - Offline: slate/gray
- Vehicle type colors (from constants)
- Proper data-testid attributes for testing

**Props Interface**:
```typescript
interface TrackingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleSelect?: (vehicle: TrackedVehicle) => void;
  className?: string;
}
```

**Sub-components to create within file**:
- `StatusBadge` - shows vehicle status with icon
- `VehicleTypeBadge` - shows vehicle type with color
- `VehicleCard` - individual vehicle display
- `VehicleLegend` - legend component for vehicle types
- `StatusLegend` - legend for status indicators

**Accessibility**:
- `role="dialog"` and `aria-modal="true"`
- `aria-label` on panel
- Focusable vehicle cards with aria-labels
- Keyboard accessible close button

**Test IDs Required**:
- `tracking-panel` - main panel container
- `tracking-panel-title` - title element
- `tracking-panel-close` - close button
- `vehicle-card-{id}` - individual vehicle cards
- `vehicle-type-badge-{id}` - type badges
- `vehicle-status-{id}` - status indicators
- `vehicle-legend` - legend section
- `status-legend` - status legend section

**Acceptance Criteria**:
- [ ] Panel slides in/out with animation
- [ ] All tracked vehicles display correctly
- [ ] Status indicators show correct colors
- [ ] Legend displays all vehicle types with colors
- [ ] Close button works
- [ ] Follows existing component patterns exactly
- [ ] Full accessibility support
- [ ] File header with documentation

**Reference Files**:
- `app/src/components/pointcloud/InstallationsPanel.tsx` - primary pattern
- `app/src/components/pointcloud/PastEventsPanel.tsx` - secondary pattern

---

### Agent 3: Integration Agent
**Model**: Opus 4.5
**Priority**: MEDIUM (depends on Agent 2)
**Estimated Time**: 15-20 minutes

**Task Description**:
Integrate the TrackingPanel into the LiveTerrain page and update barrel exports.

**Files to Modify**:
1. **MODIFY** `app/src/components/pointcloud/index.ts`
   - Add export for TrackingPanel component
   - Add export for TrackingPanelProps type

2. **MODIFY** `app/src/pages/LiveTerrain.tsx`
   - Import TrackingPanel from pointcloud components
   - Import Truck icon from lucide-react
   - Add state: `isTrackingPanelOpen`
   - Add toggle handler: `handleToggleTrackingPanel`
   - Add close handler: `handleCloseTrackingPanel`
   - Add vehicle select handler (optional, for future use)
   - Add toggle button below "Past Events" button (at ~top-[572px])
   - Render TrackingPanel component

**Toggle Button Requirements**:
- Position: `top-[572px] left-4` (below Past Events button)
- Icon: Truck from lucide-react
- Label: "Vehicle Tracking"
- Same styling as Installations and Past Events buttons
- `data-testid="tracking-toggle"`
- `aria-expanded` attribute bound to panel state
- `aria-label` for open/close state

**Panel Integration**:
```tsx
<TrackingPanel
  isOpen={isTrackingPanelOpen}
  onClose={handleCloseTrackingPanel}
/>
```

**Acceptance Criteria**:
- [ ] Toggle button visible on LiveTerrain page
- [ ] Toggle button opens/closes panel
- [ ] Panel renders correctly when open
- [ ] Panel closes via close button
- [ ] No console errors
- [ ] Toggle button has proper accessibility attributes
- [ ] Export works from pointcloud index

**Reference Files**:
- `app/src/pages/LiveTerrain.tsx` - current integration pattern
- `app/src/components/pointcloud/index.ts` - export pattern

---

### Agent 4: Testing Agent
**Model**: Opus 4.5
**Priority**: MEDIUM (depends on Agents 2 & 3)
**Estimated Time**: 45-60 minutes

**Task Description**:
Create comprehensive E2E tests for the TrackingPanel component following the established test patterns.

**Files to Create**:
1. **CREATE** `app/tests/tracking-panel.spec.ts`

**Test Structure** (following past-events-panel.spec.ts pattern):

```typescript
test.describe('TrackingPanel Component', () => {
  // Setup: Navigate to /live-terrain, open panel via toggle

  test.describe('Panel Rendering', () => {
    // - Panel visible when toggle clicked
    // - Correct title "Vehicle Tracking"
    // - Proper ARIA attributes (role="dialog", aria-modal)
    // - Close button closes panel
    // - Vehicle count displayed
  });

  test.describe('Vehicle Display', () => {
    // - Displays all tracked vehicles (5-7)
    // - Each vehicle shows name/ID
    // - Each vehicle shows type badge
    // - Each vehicle shows status indicator
    // - Each vehicle shows last update time
    // - Type badges have correct colors
  });

  test.describe('Legend Display', () => {
    // - Vehicle type legend is visible
    // - All vehicle types shown with colors
    // - Status legend is visible
    // - All status types shown (active, idle, offline)
  });

  test.describe('Vehicle Selection', () => {
    // - Clicking vehicle card triggers selection (if implemented)
    // - Selected vehicle has visual highlight
  });

  test.describe('Accessibility', () => {
    // - Panel has role="dialog"
    // - Vehicle cards are focusable
    // - Close button has aria-label
    // - Keyboard navigation works (Tab, Enter, Space)
  });

  test.describe('Toggle Button', () => {
    // - Toggle visible on LiveTerrain page
    // - Opens panel when clicked
    // - Closes panel when clicked again
    // - Has aria-expanded attribute
    // - Has proper label
  });

  test.describe('Responsive Behavior', () => {
    // - Works on tablet viewport
    // - Works on mobile viewport
  });

  test.describe('Integration', () => {
    // - Panel state persists after viewer interaction
    // - Panel remains visible after view mode change
    // - No console errors during interactions
  });

  test.describe('Edge Cases', () => {
    // - Rapid open/close cycles work correctly
    // - Navigation away and back resets state
  });
});
```

**Test Data Expectations**:
- 5-7 vehicles with different types and statuses
- At least one of each status type (active, idle, offline)
- Multiple vehicle types represented

**Testing Conventions**:
- Use `data-testid` selectors
- Wait for animations (300-500ms)
- Filter expected console errors (WebGL, LAS, 404)
- Test names should complete "It should..."
- One assertion concept per test

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] Vehicle list displays correctly
- [ ] Vehicles appear in panel
- [ ] Legend renders correctly
- [ ] Panel can be toggled
- [ ] No flaky tests
- [ ] Follows existing test patterns exactly

**Reference Files**:
- `app/tests/past-events-panel.spec.ts` - primary pattern
- `app/tests/installations-panel.spec.ts` - secondary pattern

---

## Execution Order

```
Phase 1 (Sequential - Foundation):
  Agent 1: Data Foundation Agent
    |
    v
Phase 2 (Sequential - Component):
  Agent 2: Component Agent
    |
    v
Phase 3 (Parallel - Integration & Testing):
  Agent 3: Integration Agent  |  Agent 4: Testing Agent (can start tests)
                              |
                              v
Phase 4 (Final):
  Agent 4: Complete and run all tests
```

### Dependency Matrix

| Agent | Depends On | Blocks |
|-------|------------|--------|
| Agent 1 (Data) | None | Agent 2, Agent 4 |
| Agent 2 (Component) | Agent 1 | Agent 3, Agent 4 |
| Agent 3 (Integration) | Agent 2 | Agent 4 (partially) |
| Agent 4 (Testing) | Agent 2, Agent 3 | None |

---

## Parallel Execution Opportunities

1. **Limited parallelism due to dependencies**:
   - Agent 1 must complete first (foundational types and data)
   - Agent 2 depends on Agent 1 (needs types and data)
   - Agent 3 depends on Agent 2 (needs component to integrate)
   - Agent 4 can start scaffolding tests while Agent 3 works

2. **Recommended Execution**:
   - **Step 1**: Agent 1 completes data foundation
   - **Step 2**: Agent 2 creates component
   - **Step 3**: Agent 3 and Agent 4 work in parallel
     - Agent 3: Integration
     - Agent 4: Write test scaffolding and basic tests

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Type mismatches | Low | Medium | Agent 1 follows established patterns |
| Component doesn't match design | Medium | Medium | Agent 2 uses reference components |
| Test flakiness | Medium | Low | Use established wait patterns |
| z-index conflicts with other panels | Low | Medium | Use same z-index as other panels |

---

## Success Criteria

Phase 11 is complete when:
- [ ] `trackingData.ts` created with mock vehicle data
- [ ] Types added to `kpi.ts` for vehicles
- [ ] Constants added to `constants.ts` for vehicle types
- [ ] `TrackingPanel.tsx` component created and working
- [ ] Panel integrated into LiveTerrain page
- [ ] Toggle button functional
- [ ] Legend displays all vehicle types
- [ ] All E2E tests pass
- [ ] No console errors during normal operation
- [ ] Visual design matches existing panels (glassmorphic dark theme)

---

## Notes for Implementation

1. **Vehicle Positions**: Use normalized coordinates (0-1 range) like tower installations
2. **Initially skip 3D meshes**: Use simple markers initially; 3D meshes are future enhancement
3. **Panel z-index**: Use z-30 (same as other panels) to avoid conflicts
4. **Status updates**: Data is static/mock for now; real-time updates are future feature
5. **File size**: Keep TrackingPanel.tsx under 500 lines per code conventions

---

## Agent Communication Protocol

When agents complete their tasks, they should:
1. Verify all acceptance criteria are met
2. Ensure no TypeScript/ESLint errors
3. Report completion status with any notes
4. List any deviations from the plan with justification
