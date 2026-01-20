# Mine Demo Dashboard - Implementation Plan

## Project Overview
A web-based dashboard for mine risk analysis, displaying point cloud data from LAS files with various visualization modes and real-time monitoring capabilities. The dashboard helps quarry operators manage assets around rockfalls and landslides through clear, scientific data presentation.

## Current State Analysis

### Existing Infrastructure
- **React App**: Basic Vite + React 19.2.0 + TypeScript 5.9.3 scaffolding (default template, no features implemented)
- **Custom Pointcloud Renderer**: Fully functional separate library with:
  - Three.js 0.160.0 based WebGL2 renderer
  - LAS/LAZ file loading (laz-perf library)
  - Multiple color modes (RGB, Height, Intensity, Classification)
  - GPU frustum culling & LOD system
  - FPS-based adaptive downsampling
  - Annotation system with CSS2D labels
  - OrbitControls integration
  - Optimizer for performance management

### Missing Dependencies
- Tailwind CSS (required by architecture.md)
- Lucide React icons (required by architecture.md)
- React Router (needed for multi-page navigation)
- Custom Pointcloud Renderer (needs to be integrated as dependency)

### Gap Analysis
1. **No React integration**: Custom Pointcloud Renderer is vanilla JS, needs React wrapper components
2. **No routing**: Need to implement navigation between Quick Overview and Live Terrain pages
3. **No UI components**: Need to build Navbar, KPI cards, Activity log, etc.
4. **No data directory**: Need to create `/public/data` for LAS files
5. **No testing infrastructure**: Need to set up Playwright/Chrome DevTools testing
6. **Missing view modes**: Custom renderer has 4 color modes, but features require 5 view modes (Default, Height, Cracking, Micro Movements, Risk)

## Technology Integration Strategy

### Custom Pointcloud Renderer Integration Approach

**Option A: NPM Link (Recommended for Development)**
- Use `npm link` to connect Custom Pointcloud Renderer during development
- Allows simultaneous development of both projects
- Better for iterating on renderer enhancements

**Option B: Publish to NPM**
- Publish Custom Pointcloud Renderer as private/public package
- Better for production deployment
- Requires version management

**Decision**: Start with Option A (npm link), transition to Option B for production

### Required Enhancements to Custom Pointcloud Renderer

The existing renderer is **90% sufficient** but needs these additions:

1. **Additional Color Modes**:
   - Current: RGB, Height, Intensity, Classification
   - Needed: Cracking, Micro Movements, Risk
   - **Approach**: Extend shader system with custom color mapping functions

2. **Mesh/Truck Overlays**:
   - Add Three.js mesh loading for tracked vehicles
   - Integrate with annotation system

3. **Historical Comparison**:
   - Add side-by-side view capability
   - Point cloud diff visualization

4. **Annotation Click Handlers**:
   - Already has annotation system
   - Need to expose onClick callbacks for React integration

**Recommendation**: These enhancements should be communicated to the user (per project constraints) before proceeding. The renderer can be used immediately for basic features while enhancements are planned.

## Architecture Design

### Folder Structure
```
app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   ├── kpi/
│   │   │   ├── KPICard.tsx
│   │   │   ├── KPIStrip.tsx
│   │   │   └── WeatherKPI.tsx
│   │   ├── activity/
│   │   │   ├── ActivityLog.tsx
│   │   │   └── ActivityRow.tsx
│   │   ├── pointcloud/
│   │   │   ├── PointCloudViewer.tsx        # React wrapper
│   │   │   ├── ViewModeMenu.tsx
│   │   │   ├── InformationMenu.tsx
│   │   │   ├── OnClickDataPanel.tsx
│   │   │   ├── InstallationsPanel.tsx
│   │   │   ├── PastEventsPanel.tsx
│   │   │   └── TrackingPanel.tsx
│   │   └── ui/
│   │       ├── StatusBadge.tsx
│   │       ├── TabNavigation.tsx
│   │       └── IconButton.tsx
│   ├── pages/
│   │   ├── QuickOverview.tsx
│   │   └── LiveTerrain.tsx
│   ├── hooks/
│   │   ├── usePointCloud.ts               # Hook for renderer integration
│   │   └── useAnnotations.ts              # Hook for annotation system
│   ├── types/
│   │   ├── pointcloud.ts
│   │   ├── kpi.ts
│   │   └── activity.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── data/                              # LAS files location
└── tests/                                 # Playwright tests
    ├── navbar.spec.ts
    ├── quick-overview.spec.ts
    └── live-terrain.spec.ts
```

### Component Hierarchy
```
App (Router)
├── Layout
│   ├── Navbar
│   └── <Page Content>
│
├── QuickOverview Page
│   ├── KPIStrip (Hardware)
│   │   └── KPICard × 3
│   ├── KPIStrip (Weather)
│   │   └── WeatherKPI × 6
│   └── ActivityLog
│       └── ActivityRow × N
│
└── LiveTerrain Page
    ├── PointCloudViewer
    ├── ViewModeMenu
    └── InformationMenu
        ├── OnClickDataPanel
        ├── InstallationsPanel
        ├── PastEventsPanel
        └── TrackingPanel
```

## Implementation Phases

### Phase 0: Project Setup (PREREQUISITE) ✅ COMPLETE
- [x] Install dependencies (Tailwind, Lucide, React Router)
- [x] Configure Tailwind CSS
- [x] Set up npm link for Custom Pointcloud Renderer
- [x] Create `/public/data` directory structure
- [x] Configure path aliases in tsconfig
- [ ] Set up test environment (Playwright) - *Deferred to Phase 6*

**Estimated Time**: 2-3 hours
**Status**: ✅ COMPLETE - See [phase0_complete.md](phase0_complete.md) for details

### Phase 1: Core Infrastructure ✅ COMPLETE
- [x] Create Layout component with basic structure
- [x] Implement routing (Quick Overview, Live Terrain)
- [x] Create TypeScript types for all data structures
- [x] Write utility constants (status colors, activity types, etc.)
- [x] Create placeholder data generators for KPIs

**Files to Create**:
- `src/components/layout/Layout.tsx`
- `src/types/*.ts`
- `src/utils/constants.ts`
- `src/App.tsx` (replace default)

**Tests**: Basic routing navigation

**Estimated Time**: 4-5 hours

### Phase 2: Navbar Component ✅ COMPLETE
- [x] Create Navbar component structure
- [x] Implement left section (title, last updated)
- [x] Implement middle section (tab navigation)
- [x] Implement right section (Generate Report button, icons)
- [x] Add responsive design with Tailwind
- [x] Write tests for navigation functionality

**Files Created**:
- `src/components/layout/Navbar.tsx`
- `src/components/ui/TabNavigation.tsx`
- `src/components/ui/IconButton.tsx`
- `src/components/ui/index.ts`
- `tests/navbar.spec.ts`

**Tests**:
- [x] Renders all sections correctly
- [x] Tab switching navigates to correct pages
- [x] Last updated displays timestamp
- [x] Generate Report button is clickable

**Estimated Time**: 3-4 hours

### Phase 3: Quick Overview Page - KPI Components ✅ COMPLETE
- [x] Create base KPICard component
- [x] Create specialized WeatherKPI component
- [x] Create KPIStrip container component
- [x] Implement Hardware KPI strip (Towers, Server, Model)
- [x] Implement Weather KPI strip (6 cards)
- [x] Add proper styling and responsive design
- [x] Write component tests

**Files to Create**:
- `src/components/kpi/KPICard.tsx`
- `src/components/kpi/WeatherKPI.tsx`
- `src/components/kpi/KPIStrip.tsx`
- `tests/kpi-components.spec.ts`

**Tests**:
- [x] KPI cards render with placeholder data
- [x] Last updated timestamp displays
- [x] Responsive layout works
- [x] Icons display correctly

**Status**: ✅ COMPLETE - Components created: KPICard.tsx, WeatherKPI.tsx, KPIStrip.tsx, kpiData.ts

**Estimated Time**: 4-5 hours

### Phase 4: Quick Overview Page - Activity Log ✅ COMPLETE
- [x] Create ActivityRow component with status indicator
- [x] Create ActivityLog container component
- [x] Implement status color coding (Success, Warning, Error, Info)
- [x] Implement activity type tags (Scan, Alert, Sensor, Model, Human)
- [x] Add timestamp formatting
- [x] Create placeholder activity data
- [x] Write component tests

**Files Created**:
- `src/components/activity/ActivityRow.tsx`
- `src/components/activity/ActivityLog.tsx`
- `src/components/activity/index.ts`
- `src/components/ui/StatusBadge.tsx`
- `src/data/activityData.ts`
- `tests/activity-log.spec.ts`

**Tests**:
- [x] Activity rows render with all fields
- [x] Status colors display correctly
- [x] Activity type tags render
- [x] Timestamps format properly

**Estimated Time**: 3-4 hours

### Phase 5: Quick Overview Page - Integration ✅ COMPLETE
- [x] Create QuickOverview page component
- [x] Integrate KPI strips
- [x] Integrate Activity log
- [x] Add page layout and spacing
- [x] Write page-level tests
- [x] Test responsive behavior

**Files Created**:
- `src/pages/QuickOverview.tsx`
- `tests/quick-overview.spec.ts`

**Tests**:
- [x] All sections render on page load
- [x] Page is accessible from navigation
- [x] Placeholder data displays correctly
- [x] Responsive layout works on different screen sizes

**Estimated Time**: 2-3 hours

### Phase 6: Point Cloud React Integration ✅ COMPLETE
- [x] Create usePointCloud hook for renderer lifecycle
- [x] Create PointCloudViewer React component wrapper
- [x] Handle canvas mounting/unmounting
- [x] Handle resize events
- [x] Implement color mode switching
- [x] Expose camera and controls to React
- [x] Add error handling for LAS file loading
- [x] Write integration tests

**Files Created**:
- `src/hooks/usePointCloud.ts` - React hook for renderer lifecycle management
- `src/hooks/index.ts` - Barrel export for hooks
- `src/components/pointcloud/PointCloudViewer.tsx` - React component wrapper
- `src/components/pointcloud/index.ts` - Barrel export for component
- `src/types/custom-pointcloud-renderer.d.ts` - TypeScript declarations for renderer
- `tests/pointcloud-viewer.spec.ts` - Integration tests

**Technical Implementation**:
- Dynamic import of custom-pointcloud-renderer to avoid SSR issues
- Animation loop for rendering, controls updates, and optimizer
- ResizeObserver + window resize for responsive canvas
- Loading/error/empty states with Tailwind styling
- Stats overlay showing point count and FPS

**Tests**:
- [x] Canvas mounts correctly
- [x] LAS file loads successfully
- [x] Renderer cleans up on unmount
- [x] Color mode changes work

**Estimated Time**: 5-6 hours

### Phase 7: Live Terrain - View Mode Menu ✅ COMPLETE
- [x] Create ViewModeMenu component
- [x] Implement 5 view mode options (Default, Height, Cracking, Micro Movements, Risk)
- [x] Connect to point cloud color mode system
- [x] Add visual indicators for active mode
- [x] Style as floating menu
- [x] Write component tests

**Files Created**:
- `src/components/pointcloud/ViewModeMenu.tsx` - View mode menu component with 5 modes
- `src/components/pointcloud/index.ts` - Updated barrel exports
- `src/pages/LiveTerrain.tsx` - Updated to integrate PointCloudViewer and ViewModeMenu
- `tests/view-mode-menu.spec.ts` - 37 Playwright E2E tests

**Color Mode Mapping (implemented)**:
- Default → RGB
- Height → Height
- Cracking → Classification (temporary)
- Micro Movements → Intensity (temporary)
- Risk → Classification (temporary)

**Tests**:
- [x] All 5 modes are selectable
- [x] Active mode is highlighted
- [x] Point cloud updates on mode change
- [x] Menu positions correctly

**Estimated Time**: 3-4 hours

### Phase 8: Live Terrain - Annotation Integration ✅ COMPLETE
- [x] Create useAnnotations hook
- [x] Wrap annotation system for React
- [x] Add 3 predefined annotations to point cloud
- [x] Implement onClick handler for annotations
- [x] Create OnClickDataPanel component
- [x] Display 4 weather KPI cards on annotation click
- [x] Write integration tests

**Files Created**:
- `src/hooks/useAnnotations.ts` - React hook for annotation system integration
- `src/components/pointcloud/OnClickDataPanel.tsx` - Sliding panel with weather KPIs
- `src/components/pointcloud/AnnotationMarker.tsx` - Clickable annotation marker component
- `src/types/custom-pointcloud-renderer.d.ts` - Updated with annotation type declarations
- `tests/annotations.spec.ts` - 37 Playwright E2E tests

**Implementation Details**:
- 3 predefined annotations: North Wall Monitoring, Tower Station Alpha, Pit Floor Sensor Array
- AnnotationMarker components positioned at bottom center of viewer
- OnClickDataPanel slides in from right with 4 weather KPIs (Temperature, Humidity, Wind Speed, Pressure)
- Panel shows annotation name, type, position, and description
- Selection state with visual indicator

**Tests**:
- [x] 3 annotations appear on point cloud
- [x] Clicking annotation opens data panel
- [x] Weather KPIs display in panel
- [x] Panel can be closed

**Estimated Time**: 4-5 hours

### Phase 9: Live Terrain - Installations Panel ✅ COMPLETE
- [x] Create InstallationsPanel component
- [x] Display 5 color-coded tower installations
- [x] List 4 hardware technologies per tower (LIDAR, Thermal, Camera, Probes)
- [x] Implement status indicators for each technology
- [x] Add expand/collapse functionality
- [x] Create placeholder status data
- [x] Write component tests

**Files Created**:
- `src/components/pointcloud/InstallationsPanel.tsx` - Main panel component with tower cards
- `src/data/installationsData.ts` - Placeholder tower installation data with varied statuses
- `tests/installations-panel.spec.ts` - 37 Playwright E2E tests

**Implementation Details**:
- 5 tower installations: North Ridge, East Slope, South Face, West Quarry, Central Hub
- Each tower shows 4 hardware items: LIDAR, Thermal Camera, Camera, Ground Probes
- Status types: Operational (green), Warning (yellow), Error (red), Offline (gray)
- Expand/collapse functionality with "Expand All" / "Collapse All" button
- Status summary footer showing counts by status type
- Dark glassmorphic design matching existing panels
- Integrated toggle button in LiveTerrain page

**Tests**:
- [x] 5 towers render with color coding
- [x] Each tower shows 4 hardware items
- [x] Status indicators display correctly
- [x] Panel expands/collapses

**Estimated Time**: 3-4 hours

### Phase 10: Live Terrain - Past Events Panel ✅ COMPLETE
- [x] Create PastEventsPanel component
- [x] Display 3 past events with event type
- [x] Show similarity percentage to current terrain
- [x] Implement event selection
- [x] Create placeholder comparison view (future: historic point cloud)
- [x] Write component tests

**Files Created**:
- `src/types/kpi.ts` - Added EventType, EventTypeValue, PastEvent types
- `src/data/pastEventsData.ts` - 3 placeholder events with varied types and similarity %
- `src/components/pointcloud/PastEventsPanel.tsx` - Sliding panel component
- `src/components/pointcloud/index.ts` - Updated exports
- `src/pages/LiveTerrain.tsx` - Integrated panel toggle and component
- `tests/past-events-panel.spec.ts` - 48 Playwright E2E tests

**Note**: Historic point cloud comparison will require renderer enhancement (defer to future phase)

**Tests**:
- [x] 3 events render with details
- [x] Similarity percentage displays
- [x] Event selection works
- [x] Comparison placeholder shows

**Estimated Time**: 3-4 hours

### Phase 11: Live Terrain - Tracking Panel ✅ COMPLETE
- [x] Create TrackingPanel component
- [x] Display tracked trucks and machines list
- [x] Create placeholder mesh overlays for vehicles (deferred - using status indicators)
- [x] Position vehicles on point cloud (normalized coordinates stored, visual markers deferred)
- [x] Add legend for vehicle types
- [x] Write component tests

**Files Created**:
- `src/utils/constants.ts` - Added VEHICLE_TYPES, VEHICLE_COLORS, VEHICLE_LABELS
- `src/types/kpi.ts` - Added VehicleType, VehicleStatus, TrackedVehicle interface
- `src/data/trackingData.ts` - 6 placeholder vehicles with varied types/statuses
- `src/components/pointcloud/TrackingPanel.tsx` - Sliding panel component with legend
- `src/components/pointcloud/index.ts` - Updated exports
- `src/pages/LiveTerrain.tsx` - Integrated panel toggle and component
- `tests/tracking-panel.spec.ts` - 50+ Playwright E2E tests

**Note**: Vehicle mesh overlays on point cloud deferred to future phase. Panel displays vehicle list with status, operator, speed, and legend.

**Tests**:
- [x] Vehicle list displays (6 vehicles)
- [x] Vehicle status indicators work (active/idle/offline/maintenance)
- [x] Legend renders correctly (5 vehicle types)
- [x] Panel can be toggled

**Estimated Time**: 4-5 hours

### Phase 12: Live Terrain - Information Menu Integration ✅ COMPLETE
- [x] Create InformationMenu container component
- [x] Implement section switching (On Click Data, Installations, Past Events, Tracking)
- [x] Integrate all panel components
- [x] Add animations and transitions
- [x] Style as floating side panel
- [x] Write integration tests

**Files Created**:
- `src/components/pointcloud/InformationMenu.tsx` - Main container with tab navigation
- `src/components/pointcloud/InformationMenuTabs.tsx` - Tab content components
- `src/components/pointcloud/index.ts` - Updated exports
- `src/pages/LiveTerrain.tsx` - Replaced 3 panel toggles with single Information button
- `tests/information-menu.spec.ts` - 51 Playwright E2E tests

**Implementation Details**:
- Unified tabbed interface with 4 tabs: Data, Towers, Events, Tracking
- Single "Information" toggle button replaces 3 individual panel buttons
- Dark glassmorphic design matching existing panels
- Full keyboard navigation (arrow keys between tabs)
- ARIA accessibility (tablist, tab, tabpanel roles)
- Visual tested in Chrome - no console errors

**Tests**:
- [x] All 4 sections are accessible
- [x] Section switching works smoothly
- [x] Menu positions correctly
- [x] All panels function within menu

**Estimated Time**: 3-4 hours

### Phase 13: Live Terrain - Page Integration ✅ COMPLETE
- [x] Create LiveTerrain page component
- [x] Integrate PointCloudViewer
- [x] Integrate ViewModeMenu
- [x] Integrate InformationMenu
- [x] Handle page layout (full viewport for 3D)
- [x] Add loading states
- [x] Write page-level tests

**Files Created**:
- `src/pages/LiveTerrain.tsx` - Full page integration with all components
- `tests/live-terrain.spec.ts` - 45+ Playwright E2E tests

**Tests**:
- [x] Point cloud loads on page mount
- [x] View mode menu functions (5 modes, optimizer toggle)
- [x] Information menu functions (4 tabs, open/close)
- [x] Page is accessible from navigation
- [x] Performance tests included (>30 FPS verification)

**Estimated Time**: 3-4 hours

### Phase 14: Polish and Testing ✅ COMPLETE
- [x] Add loading spinners for async operations (LoadingSpinner.tsx)
- [x] Implement error boundaries (ErrorBoundary.tsx wrapping App)
- [x] Add error messaging for failed LAS loads (categorized errors with suggestions)
- [x] Refine responsive layouts (tested on 5 breakpoints)
- [x] Accessibility audit (ARIA labels, keyboard navigation)
- [x] Cross-browser testing (Chromium, Firefox, WebKit tests)
- [x] Performance optimization (optimizer controls, FPS monitoring)
- [x] Write end-to-end tests (e2e-flow.spec.ts)

**Files Created**:
- `src/components/ui/LoadingSpinner.tsx` - 3-size spinner component
- `src/components/ui/ErrorBoundary.tsx` - React error boundary with fallback UI
- `tests/live-terrain.spec.ts` - 45+ E2E tests for LiveTerrain page
- `tests/e2e-flow.spec.ts` - 20+ complete user journey tests
- `tests/accessibility.spec.ts` - 20+ accessibility tests
- `tests/cross-browser.spec.ts` - 20+ cross-browser compatibility tests

**Files Modified**:
- `src/components/ui/index.ts` - Added LoadingSpinner, ErrorBoundary exports
- `src/App.tsx` - Wrapped with ErrorBoundary
- `src/components/pointcloud/PointCloudViewer.tsx` - Enhanced error categorization

**Error Categories Implemented**:
- File Not Found (404 errors)
- Invalid File Format (parsing errors)
- Graphics Error (WebGL issues)
- Memory Error (file too large)
- Unknown (fallback with suggestion)

**Tests**:
- [x] Complete user flow: Navigate → View KPIs → Switch to Live Terrain → Interact with point cloud
- [x] Error states display appropriately with categorized messages
- [x] Accessibility standards met (keyboard nav, ARIA, focus management)
- [x] Performance benchmarks met (FPS monitoring, load time checks)

**Estimated Time**: 4-6 hours

### Phase 15: Documentation and Handoff
- [ ] Update README with setup instructions
- [ ] Document component APIs
- [ ] Create developer guide for extending features
- [ ] Document renderer enhancement requirements
- [ ] Create user guide for dashboard features
- [ ] Document testing procedures

**Estimated Time**: 3-4 hours

## Renderer Enhancement Requirements

### Communicate to User (per Project Constraints)
The following enhancements to the Custom Pointcloud Renderer are recommended but not required for initial deployment:

1. **Custom Color Modes**:
   - Add "Cracking" shader mode (analyze geometry for stress patterns)
   - Add "Micro Movements" shader mode (diff between point cloud versions)
   - Add "Risk" shader mode (composite of multiple factors)

2. **Historical Comparison**:
   - Add dual-viewer mode for side-by-side comparison
   - Add point cloud diff visualization (red/green for changes)
   - Add temporal slider for historical data

3. **Vehicle Mesh System**:
   - Add GLTF/OBJ loader integration
   - Add vehicle positioning API
   - Add vehicle tracking update system

4. **Performance Enhancements**:
   - Add WebWorker for LAS parsing (prevent main thread blocking)
   - Add progressive loading for large files
   - Add octree spatial indexing (if not already implemented)

**Timeline**: These can be developed in parallel with dashboard work or after Phase 15.

## Testing Strategy

### Testing Tools
- **Playwright**: Browser automation for E2E tests (via Chrome DevTools MCP)
- **Visual Testing**: Screenshot comparison for UI consistency
- **Manual Testing**: Developer testing during each phase

### Test Coverage Goals
- **Navigation**: All routes accessible
- **Components**: All interactive elements functional
- **Point Cloud**: Loading, rendering, interaction
- **Data Display**: Placeholder data renders correctly
- **Responsive**: Layouts work on desktop/tablet
- **Performance**: Point cloud renders at >30 FPS

### TDD Approach
For each phase:
1. Write test specifications first
2. Implement component to pass tests
3. Refactor for code quality
4. Update tests if behavior changes

## Risk Assessment

### High Risk
- **Point Cloud Integration**: First time integrating vanilla JS library with React
  - **Mitigation**: Create isolated test component, thorough testing
- **Performance**: Large LAS files may cause performance issues
  - **Mitigation**: Use optimizer, test with various file sizes, implement loading states

### Medium Risk
- **Renderer Enhancements**: Custom color modes may be complex
  - **Mitigation**: Start with existing modes, plan enhancements separately
- **Responsive Design**: Complex layouts may break on smaller screens
  - **Mitigation**: Mobile-first approach, progressive enhancement

### Low Risk
- **UI Components**: Standard React patterns
- **Placeholder Data**: Simple to generate and replace later

## Dependencies and Blockers

### External Dependencies
- LAS file(s) must be provided and placed in `/public/data`
- Decision needed on which renderer enhancements to prioritize

### Internal Dependencies
- Phase 6 blocks Phases 7-13 (point cloud required for Live Terrain)
- Phase 0 blocks all other phases (setup required)
- Navbar (Phase 2) should complete before page implementations

## Success Criteria

### Functional Requirements
- [ ] Navigation works between all pages
- [ ] Quick Overview displays all KPIs and activity log
- [ ] Live Terrain displays point cloud from LAS file
- [ ] View modes can be switched
- [ ] Annotations can be clicked to show data
- [ ] All information panels are accessible

### Non-Functional Requirements
- [ ] Point cloud renders at >30 FPS on mid-range hardware
- [ ] Page load time <3 seconds
- [ ] No console errors
- [ ] Responsive design works on >1280px screens
- [ ] Code follows conventions (<300 lines/file, descriptive names)

### Quality Requirements
- [ ] All tests passing
- [ ] TypeScript strict mode enabled with no errors
- [ ] ESLint passing with no warnings
- [ ] Accessibility: keyboard navigation works

## Estimated Timeline

- **Phase 0**: 2-3 hours
- **Phases 1-5** (Quick Overview): 16-21 hours
- **Phases 6-13** (Live Terrain): 28-35 hours
- **Phases 14-15** (Polish & Docs): 7-10 hours

**Total**: 53-69 hours (approximately 7-9 working days)

## Next Steps

1. **Review this plan** with stakeholders
2. **Confirm LAS file availability** and location
3. **Decide on renderer enhancements** priority and timeline
4. **Execute Phase 0** (Project Setup)
5. **Create detailed feature plans** in `/planning/features/` following workflow.md
6. **Begin Phase 1** (Core Infrastructure)

## Critical Files for Reference

- [app/package.json](../app/package.json) - Dependencies configuration
- [app/src/App.tsx](../app/src/App.tsx) - Main application entry point
- [Custom Pointcloud Renderer/src/index.js](../../Custom Pointcloud Renderer/src/index.js) - Renderer API exports
- [app/vite.config.ts](../app/vite.config.ts) - Build configuration
- [agent_docs/workflow.md](../agent_docs/workflow.md) - Development workflow guidelines
