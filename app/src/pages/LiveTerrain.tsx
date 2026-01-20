/**
 * LiveTerrain Page Component
 *
 * Description:
 * Displays a 3D point cloud visualization of mine terrain with view mode switching,
 * optimizer controls, and a persistent InformationMenu sidebar for accessing tower
 * hardware status, past events, and vehicle tracking. Annotations are rendered
 * directly on the point cloud using the Custom Pointcloud Renderer's annotation system.
 * Annotation visibility is controlled based on the active tab:
 * - Tower annotations are visible when the "Towers" (installations) tab is selected
 * - Data annotations are visible when the "Data" tab is selected
 *
 * Sample Input:
 * - Route navigation to "/live-terrain"
 * - ViewModeMenu interactions for color modes and optimizer control
 * - Click on annotation labels to update InformationMenu Data tab
 * - Tab switching to control annotation visibility
 *
 * Expected Output:
 * - 3D point cloud with 5 view mode options on the left
 * - Tower annotations rendered when "Towers" tab is active (5 tower locations)
 * - Data annotations rendered when "Data" tab is active (3 monitoring points)
 * - InformationMenu sidebar updates to show selected annotation data when clicked
 * - Persistent InformationMenu sidebar on the right with 4 tabs
 */

import type { JSX } from 'react';
import { useState, useCallback, useRef, useMemo } from 'react';
import {
  PointCloudViewer,
  ViewModeMenu,
  viewModeToColorMode,
  InformationMenu,
} from '@/components/pointcloud';
import type { PointCloudViewerRef, TabId } from '@/components/pointcloud';
import type { ViewMode, OptimizerMode } from '@/types/pointcloud';
import { getTowerInstallations } from '@/data/installationsData';
import { getDataAnnotations } from '@/data/dataAnnotationsData';
import { getTrackedVehicles } from '@/data/trackingData';
import { useAnnotations } from '@/hooks/useAnnotations';

function LiveTerrain(): JSX.Element {
  const viewerRef = useRef<PointCloudViewerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // View and optimizer state
  const [viewMode, setViewMode] = useState<ViewMode>('default');
  const [optimizerEnabled, setOptimizerEnabled] = useState(true);
  const [optimizerMode, setOptimizerMode] = useState<OptimizerMode>('fps');

  // Point cloud loading state for annotation initialization
  const [isPointCloudLoaded, setIsPointCloudLoaded] = useState(false);

  // Active tab state - controls which annotation group is visible
  // 'installations' tab shows tower annotations, 'data' tab shows data annotations
  const [activeTab, setActiveTab] = useState<TabId>('data');

  const colorMode = viewModeToColorMode(viewMode);

  // Derive classification filter from view mode
  // 'cracking' mode shows only classification values 0-4
  // 'micro_movements' mode shows only classification values 5-8
  // 'risk' mode shows only classification values 9-12
  const classificationFilter = useMemo(() => {
    if (viewMode === 'cracking') {
      return [0, 1, 2, 3, 4];
    }
    if (viewMode === 'micro_movements') {
      return [5, 6, 7, 8];
    }
    if (viewMode === 'risk') {
      return [9, 10, 11, 12];
    }
    return null; // Show all points for other modes
  }, [viewMode]);

  // Derive classification color range from view mode
  // This ensures coloring is consistent with the filter - only relevant classifications get colored
  const classificationColorRange = useMemo(() => {
    // Default view: force neutral-gray for all points.
    // The renderer colors points *outside* the range as gray, so we pick a range that matches
    // no expected classification values (Uint8 255 is typically unused).
    if (viewMode === 'default') {
      return { min: 255, max: 255 };
    }
    if (viewMode === 'cracking') {
      return { min: 0, max: 4 };
    }
    if (viewMode === 'micro_movements') {
      return { min: 5, max: 8 };
    }
    if (viewMode === 'risk') {
      return { min: 9, max: 12 };
    }
    return null; // Color all classifications for other modes
  }, [viewMode]);

  // Tower data for annotation system
  const towers = useMemo(() => getTowerInstallations(), []);
  // Data annotations for data points of interest
  const dataAnnotations = useMemo(() => getDataAnnotations(), []);
  // Tracked vehicles for annotation system
  const trackedVehicles = useMemo(() => getTrackedVehicles(), []);

  // Initialize annotation system with tower data, data annotations, and tracked vehicles
  // When an annotation is clicked, the InformationMenu will automatically
  // switch to the Data tab and display the selected annotation's information
  // Visibility is controlled based on activeTab:
  // - 'installations' tab: tower annotations visible
  // - 'data' tab: data annotations visible
  // - 'tracking' tab: vehicle annotations visible
  const {
    selectedAnnotation,
    updateAnnotations,
    isInitialized: annotationsInitialized,
  } = useAnnotations({
    isPointCloudLoaded,
    towers,
    dataAnnotations,
    trackedVehicles,
    activeTab,
    containerRef,
  });

  // Handle point cloud loading completion
  const handleLoadingChange = useCallback((isLoading: boolean) => {
    if (!isLoading) {
      // Small delay to ensure renderer is fully ready
      setTimeout(() => {
        setIsPointCloudLoaded(true);
      }, 100);
    }
  }, []);

  // Render frame callback - update annotation positions
  const handleRenderFrame = useCallback(() => {
    if (annotationsInitialized) {
      updateAnnotations();
    }
  }, [annotationsInitialized, updateAnnotations]);

  const handleToggleOptimizer = useCallback(() => {
    const newEnabled = !optimizerEnabled;
    setOptimizerEnabled(newEnabled);

    if (viewerRef.current) {
      if (newEnabled) {
        viewerRef.current.enableOptimizer();
      } else {
        viewerRef.current.disableOptimizer();
      }
    }
  }, [optimizerEnabled]);

  const handleOptimizerModeChange = useCallback((mode: OptimizerMode) => {
    setOptimizerMode(mode);
    viewerRef.current?.setOptimizerMode(mode);
  }, []);

  return (
    <div
      className="flex h-[calc(100vh-64px)] w-full bg-slate-950 overflow-hidden"
      role="main"
      aria-label="Live terrain visualization"
    >
      {/* Point cloud viewer area */}
      <div ref={containerRef} className="relative flex-1 h-full">
        <PointCloudViewer
          ref={viewerRef}
          lasFilePath="/data/crxmine_combined_classifications.las"
          colorMode={colorMode}
          className="h-full w-full"
          enableOptimizer={optimizerEnabled}
          onLoadingChange={handleLoadingChange}
          onRenderFrame={handleRenderFrame}
          classificationFilter={classificationFilter}
          classificationColorRange={classificationColorRange}
        />

        <ViewModeMenu
          currentMode={viewMode}
          onModeChange={setViewMode}
          optimizerEnabled={optimizerEnabled}
          optimizerMode={optimizerMode}
          onToggleOptimizer={handleToggleOptimizer}
          onOptimizerModeChange={handleOptimizerModeChange}
          className="top-4 left-4"
        />

        {/* Hidden color mode indicator for testing */}
        <div data-testid="pointcloud-color-mode" aria-hidden="true" className="sr-only">
          {colorMode}
        </div>
      </div>

      {/* Information sidebar - displays selected annotation data in the Data tab */}
      <InformationMenu
        selectedAnnotation={selectedAnnotation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default LiveTerrain;
