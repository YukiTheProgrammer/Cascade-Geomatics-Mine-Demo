# Phase 10: Past Events Panel - Agent Assignment Plan

## Overview

Phase 10 implements a Past Events Panel for the Live Terrain page, displaying historical geological events (rockfalls, landslides, subsidence) with similarity analysis to the current terrain state. The panel follows the established sliding panel pattern from InstallationsPanel.

## Task Analysis

### Complexity Assessment
- **Overall Complexity**: Medium
- **Estimated Total Effort**: 3-4 hours
- **Risk Level**: Low (follows established patterns)

### Task Decomposition

| Task ID | Description | Complexity | Est. Time |
|---------|-------------|------------|-----------|
| T1 | Create pastEventsData.ts with placeholder event data | Low | 30 min |
| T2 | Add PastEvent types to kpi.ts | Low | 15 min |
| T3 | Create PastEventsPanel component | Medium | 90 min |
| T4 | Integrate panel toggle button into LiveTerrain.tsx | Low | 20 min |
| T5 | Export PastEventsPanel from index.ts | Low | 5 min |
| T6 | Write Playwright E2E tests | Medium | 60 min |

### Dependency Graph

```
T2 (Types) ─────┬──► T1 (Data) ─────┬──► T3 (Component) ──► T4 (Integration)
                │                    │                              │
                └────────────────────┴──────────────────────────────┴──► T5 (Export)
                                                                           │
                                                                           ▼
                                                                    T6 (Tests)
```

## Agent Assignments

### Agent 1: Data Layer Agent (Opus)

**Purpose**: Create the foundation data types and placeholder data for past events.

**Tasks**:
- T2: Add PastEvent interface and EventType enum to `app/src/types/kpi.ts`
- T1: Create `app/src/data/pastEventsData.ts` with 3 placeholder events

**Files to Create/Modify**:
- `app/src/types/kpi.ts` (modify - add types)
- `app/src/data/pastEventsData.ts` (create)

**Type Definitions Required**:
```typescript
// EventType enum
export const EventType = {
  ROCKFALL: "rockfall",
  LANDSLIDE: "landslide",
  SUBSIDENCE: "subsidence",
  EROSION: "erosion",
} as const;

// PastEvent interface
export interface PastEvent {
  id: string;
  name: string;
  eventType: EventType;
  date: Date | string;
  location: string;
  similarityPercentage: number; // 0-100
  description?: string;
  affectedArea?: number; // square meters
  severity?: KPIStatus;
}
```

**Data Requirements**:
- 3 past events with varied event types
- Similarity percentages ranging from 45-89%
- Realistic dates (past 6 months to 2 years)
- Example locations matching tower regions

**Reference Patterns**:
- Follow `app/src/data/installationsData.ts` structure
- Use caching pattern with getter functions
- Include helper functions for filtering/sorting

**Acceptance Criteria**:
- [ ] EventType enum exported from kpi.ts
- [ ] PastEvent interface exported from kpi.ts
- [ ] pastEventsData.ts exports getPastEvents() function
- [ ] pastEventsData.ts exports getPastEventById() function
- [ ] 3 placeholder events with complete data

---

### Agent 2: Component Development Agent (Opus)

**Purpose**: Build the PastEventsPanel component following established UI patterns.

**Tasks**:
- T3: Create `app/src/components/pointcloud/PastEventsPanel.tsx`

**Files to Create**:
- `app/src/components/pointcloud/PastEventsPanel.tsx`

**Component Requirements**:

1. **Panel Structure** (mirror InstallationsPanel):
   - Fixed position right-side sliding panel (w-[340px])
   - Dark glassmorphic design (bg-slate-900/95, backdrop-blur-xl)
   - Slide-in animation (transform transition-transform)
   - Header with title "Past Events" and close button
   - Scrollable event list area

2. **Props Interface**:
   ```typescript
   interface PastEventsPanelProps {
     isOpen: boolean;
     onClose: () => void;
     onEventSelect?: (event: PastEvent) => void;
     className?: string;
   }
   ```

3. **Event Card Design**:
   - Event name and date
   - Color-coded event type badge (similar to status badges)
   - Location indicator
   - Similarity percentage with visual bar
   - Selection state with visual highlight

4. **Event Type Color Mapping**:
   ```typescript
   const EVENT_TYPE_COLORS = {
     rockfall: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
     landslide: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
     subsidence: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
     erosion: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
   };
   ```

5. **Comparison Placeholder Section**:
   - Appears when an event is selected
   - Shows placeholder message: "Historic point cloud comparison will be available in a future update"
   - Subtle dashed border box with informational styling

6. **Accessibility Requirements**:
   - role="dialog" with aria-modal="true"
   - aria-label for panel
   - data-testid attributes for all interactive elements
   - Keyboard accessible event selection

**Data Test IDs Required**:
- `past-events-panel`
- `past-events-panel-title`
- `past-events-panel-close`
- `past-event-card-{id}`
- `event-type-badge-{id}`
- `similarity-indicator-{id}`
- `comparison-placeholder`

**Reference Files**:
- `app/src/components/pointcloud/InstallationsPanel.tsx` (primary pattern)
- `app/src/components/pointcloud/OnClickDataPanel.tsx` (secondary reference)

**Acceptance Criteria**:
- [ ] Panel slides in from right edge
- [ ] 3 event cards render with complete details
- [ ] Event type badges are color-coded
- [ ] Similarity percentages display with visual indicator
- [ ] Event selection highlights selected card
- [ ] Comparison placeholder shows when event selected
- [ ] Close button works
- [ ] All accessibility attributes present

---

### Agent 3: Integration Agent (Opus)

**Purpose**: Integrate the PastEventsPanel into LiveTerrain and update exports.

**Tasks**:
- T4: Integrate panel toggle button into LiveTerrain.tsx
- T5: Export PastEventsPanel from index.ts

**Files to Modify**:
- `app/src/pages/LiveTerrain.tsx`
- `app/src/components/pointcloud/index.ts`

**LiveTerrain.tsx Integration Requirements**:

1. **Import Statement**:
   ```typescript
   import { PastEventsPanel } from '@/components/pointcloud';
   ```

2. **State Addition**:
   ```typescript
   const [isPastEventsPanelOpen, setIsPastEventsPanelOpen] = useState(false);
   const [selectedPastEvent, setSelectedPastEvent] = useState<PastEvent | null>(null);
   ```

3. **Handler Functions**:
   ```typescript
   const handleTogglePastEventsPanel = useCallback(() => {
     setIsPastEventsPanelOpen((prev) => !prev);
   }, []);

   const handleClosePastEventsPanel = useCallback(() => {
     setIsPastEventsPanelOpen(false);
   }, []);

   const handlePastEventSelect = useCallback((event: PastEvent) => {
     setSelectedPastEvent(event);
   }, []);
   ```

4. **Toggle Button** (position below Installations button):
   - Icon: `History` from lucide-react
   - Label: "Past Events"
   - Position: `top-[520px] left-4` (60px below Installations)
   - Same styling as Installations button
   - data-testid="past-events-toggle"

5. **Panel Placement**:
   - Add after InstallationsPanel component
   - Pass appropriate props

**index.ts Export Requirements**:
```typescript
export { PastEventsPanel } from './PastEventsPanel';
export type { PastEventsPanelProps } from './PastEventsPanel';
```

**Acceptance Criteria**:
- [ ] Toggle button visible on LiveTerrain page
- [ ] Button toggles panel open/closed
- [ ] Panel renders in correct position
- [ ] Panel close button works
- [ ] Event selection propagates correctly
- [ ] Exports available from index.ts

---

### Agent 4: Testing Agent (Opus)

**Purpose**: Write comprehensive Playwright E2E tests for the PastEventsPanel.

**Tasks**:
- T6: Create `app/tests/past-events-panel.spec.ts`

**Files to Create**:
- `app/tests/past-events-panel.spec.ts`

**Test Structure** (follow installations-panel.spec.ts pattern):

```typescript
test.describe('PastEventsPanel Component', () => {
  // Setup
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/live-terrain`);
    await page.waitForSelector('[data-testid="pointcloud-viewer"]');
    // Open past events panel
    await page.click('[data-testid="past-events-toggle"]');
    await page.waitForTimeout(500);
  });

  test.describe('Panel Rendering', () => {
    // Panel visibility and title tests
  });

  test.describe('Event Display', () => {
    // 3 events render with details tests
  });

  test.describe('Similarity Display', () => {
    // Similarity percentage tests
  });

  test.describe('Event Selection', () => {
    // Selection interaction tests
  });

  test.describe('Comparison Placeholder', () => {
    // Placeholder visibility tests
  });

  test.describe('Accessibility', () => {
    // ARIA and keyboard tests
  });
});
```

**Required Test Cases**:

1. **Panel Rendering**:
   - [ ] Panel renders with "Past Events" title
   - [ ] Panel is visible when toggle clicked
   - [ ] Panel has proper ARIA attributes

2. **Event Display**:
   - [ ] 3 events render in the list
   - [ ] Each event shows name/date
   - [ ] Each event shows event type badge
   - [ ] Each event shows location
   - [ ] Event type badges have correct colors

3. **Similarity Display**:
   - [ ] Similarity percentage displays for each event
   - [ ] Similarity visual indicator renders
   - [ ] Percentages are within valid range (0-100)

4. **Event Selection**:
   - [ ] Clicking event card selects it
   - [ ] Selected event has visual highlight
   - [ ] Only one event selected at a time
   - [ ] Clicking selected event maintains selection

5. **Comparison Placeholder**:
   - [ ] Placeholder hidden when no event selected
   - [ ] Placeholder shows when event selected
   - [ ] Placeholder contains future feature message

6. **Accessibility**:
   - [ ] Panel has role="dialog"
   - [ ] Event cards are keyboard accessible
   - [ ] Focus management works correctly

**Reference Files**:
- `app/tests/installations-panel.spec.ts` (primary test pattern)

**Acceptance Criteria**:
- [ ] All specified test cases implemented
- [ ] Tests follow existing file header pattern
- [ ] Tests use consistent data-testid selectors
- [ ] Tests handle animation timing appropriately

---

## Execution Plan

### Parallel Execution Groups

```
Group 1 (Can run in parallel):
├── Agent 1: Data Layer Agent
└── (Start first - provides foundation)

Group 2 (Depends on Group 1):
└── Agent 2: Component Development Agent
    (Requires types and data from Agent 1)

Group 3 (Depends on Group 2):
├── Agent 3: Integration Agent
└── (Requires component from Agent 2)

Group 4 (Depends on Group 3):
└── Agent 4: Testing Agent
    (Requires full integration to test)
```

### Recommended Execution Order

| Order | Agent | Est. Duration | Dependencies |
|-------|-------|---------------|--------------|
| 1 | Agent 1: Data Layer | 45 min | None |
| 2 | Agent 2: Component Development | 90 min | Agent 1 complete |
| 3 | Agent 3: Integration | 25 min | Agent 2 complete |
| 4 | Agent 4: Testing | 60 min | Agent 3 complete |

**Total Sequential Time**: ~3.5 hours
**Critical Path**: Agent 1 -> Agent 2 -> Agent 3 -> Agent 4

### Alternative: Partial Parallelization

If Agent 4 (Testing) has access to the component interface specification early, they can begin writing test shells while Agent 2 develops the component:

```
Time 0:00 - 0:45: Agent 1 (Data Layer)
Time 0:45 - 2:15: Agent 2 (Component) + Agent 4 begins test shells
Time 2:15 - 2:40: Agent 3 (Integration)
Time 2:40 - 3:15: Agent 4 completes tests

Parallel Total: ~3.25 hours
```

---

## Success Criteria

### Phase 10 Completion Checklist

- [ ] `app/src/types/kpi.ts` updated with EventType and PastEvent
- [ ] `app/src/data/pastEventsData.ts` created with 3 events
- [ ] `app/src/components/pointcloud/PastEventsPanel.tsx` created
- [ ] `app/src/components/pointcloud/index.ts` exports updated
- [ ] `app/src/pages/LiveTerrain.tsx` integrates panel and toggle
- [ ] `app/tests/past-events-panel.spec.ts` created
- [ ] All tests pass: `npm run test:e2e -- past-events-panel`
- [ ] Visual verification: Panel matches design requirements
- [ ] Code conventions followed (file headers, <500 lines, descriptive names)

### Quality Gates

| Metric | Target |
|--------|--------|
| Test Pass Rate | 100% |
| Component Lines | <400 |
| Data File Lines | <200 |
| Test Coverage | All specified cases |
| Accessibility | ARIA compliance |

---

## Notes for Agents

1. **File Headers**: All new files must include the standard header comment with Description, Sample Input, and Expected Output.

2. **Type Safety**: Use strict TypeScript - no `any` types unless absolutely necessary.

3. **Design Consistency**: Match the dark glassmorphic design of InstallationsPanel exactly.

4. **Test IDs**: Use consistent `data-testid` naming: `{component}-{element}` or `{component}-{element}-{id}`.

5. **Future Extensibility**: The comparison placeholder should be designed to be easily replaced with actual historic point cloud comparison in a future phase.

6. **Defer**: Historic point cloud comparison rendering is explicitly deferred to a future phase per the implementation plan. Do not attempt to implement this functionality.
