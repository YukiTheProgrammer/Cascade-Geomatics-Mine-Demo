/**
 * PointCloudViewer Component
 *
 * Description:
 * A React component that renders a 3D point cloud visualization using the Custom
 * Pointcloud Renderer. Displays LAS/LAZ files with support for multiple color modes,
 * loading states, and error handling. Designed for the Mine Demo Dashboard with
 * an industrial-utilitarian aesthetic.
 *
 * Sample Input:
 * <PointCloudViewer
 *   lasFilePath="/data/quarry.las"
 *   colorMode="Height"
 *   onStatsUpdate={(stats) => console.log('Points:', stats.totalPoints)}
 *   className="h-full w-full"
 * />
 *
 * Expected Output:
 * - A full-container canvas displaying the 3D point cloud
 * - Loading overlay with spinner while file loads
 * - Error overlay with message if loading fails
 * - Responsive sizing that fills the container
 */

import type { JSX } from 'react';
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Loader2, AlertTriangle, Box, RefreshCw } from 'lucide-react';
import { usePointCloud } from '@/hooks/usePointCloud';
import type { ColorMode, PointCloudStats, OptimizerMode, ClassificationColorRange } from '@/types/pointcloud';

/**
 * Props for the PointCloudViewer component
 */
interface PointCloudViewerProps {
  /** Path to the LAS/LAZ file (relative to /public) */
  lasFilePath: string;
  /** Color mode for rendering the point cloud */
  colorMode?: ColorMode;
  /** Callback fired when point cloud stats are updated */
  onStatsUpdate?: (stats: PointCloudStats) => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Whether to enable the optimizer (default: true) */
  enableOptimizer?: boolean;
  /** Callback when loading state changes */
  onLoadingChange?: (isLoading: boolean) => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
  /** Callback fired on each render frame (for external updates like annotations) */
  onRenderFrame?: () => void;
  /** Classification values to show (null = show all points) */
  classificationFilter?: number[] | null;
  /** Classification color range for filtered coloring (null = color all classifications) */
  classificationColorRange?: ClassificationColorRange | null;
}

/**
 * Ref handle for controlling the PointCloudViewer imperatively
 */
interface PointCloudViewerRef {
  /** Set the optimizer downsampling mode */
  setOptimizerMode: (mode: OptimizerMode) => void;
  /** Get the current optimizer downsampling mode */
  getOptimizerMode: () => OptimizerMode;
  /** Enable the optimizer */
  enableOptimizer: () => void;
  /** Disable the optimizer */
  disableOptimizer: () => void;
  /** Check if the optimizer is enabled */
  isOptimizerEnabled: () => boolean;
}

/**
 * Categorized error information for user-friendly display
 */
interface CategorizedError {
  /** Error category identifier */
  category: 'file-not-found' | 'invalid-format' | 'graphics-error' | 'memory-error' | 'unknown';
  /** Short, descriptive title for the error */
  title: string;
  /** Detailed explanation of what went wrong */
  message: string;
  /** Actionable suggestion for resolution */
  suggestion: string;
}

/**
 * Analyzes an error string and returns categorized error information
 * with user-friendly messaging and actionable suggestions.
 */
function getErrorMessage(error: string): CategorizedError {
  const errorLower = error.toLowerCase();

  if (errorLower.includes('404') || errorLower.includes('not found') || errorLower.includes('failed to fetch')) {
    return {
      category: 'file-not-found',
      title: 'File Not Found',
      message: 'The requested LAS file could not be located on the server.',
      suggestion: 'Verify the file exists at /public/data/ and the path is correct.',
    };
  }

  if (errorLower.includes('parse') || errorLower.includes('invalid') || errorLower.includes('format') || errorLower.includes('header')) {
    return {
      category: 'invalid-format',
      title: 'Invalid File Format',
      message: 'The file could not be parsed as a valid LAS/LAZ format.',
      suggestion: 'Ensure the file is a valid LAS 1.2-1.4 or LAZ compressed format.',
    };
  }

  if (errorLower.includes('webgl') || errorLower.includes('gpu') || errorLower.includes('context') || errorLower.includes('shader')) {
    return {
      category: 'graphics-error',
      title: 'Graphics Error',
      message: 'WebGL rendering failed to initialize or encountered a critical error.',
      suggestion: 'Try updating your graphics drivers or using a different browser.',
    };
  }

  if (errorLower.includes('memory') || errorLower.includes('size') || errorLower.includes('allocation') || errorLower.includes('overflow')) {
    return {
      category: 'memory-error',
      title: 'File Too Large',
      message: 'The point cloud file exceeds available memory limits.',
      suggestion: 'Try using a downsampled version of the file or close other applications.',
    };
  }

  return {
    category: 'unknown',
    title: 'Failed to Load Point Cloud',
    message: error,
    suggestion: 'Try refreshing the page or contact support if the issue persists.',
  };
}

function LoadingOverlay(): JSX.Element {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/95"
      role="status"
      aria-label="Loading point cloud"
    >
      <div className="flex items-center gap-3">
        <Loader2
          className="h-8 w-8 text-sky-500 animate-spin"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-slate-200">Loading Point Cloud</p>
      </div>
    </div>
  );
}

interface ErrorOverlayProps {
  message: string;
  onRetry?: () => void;
}

function ErrorOverlay({ message, onRetry }: ErrorOverlayProps): JSX.Element {
  const categorizedError = getErrorMessage(message);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/95"
      role="alert"
      aria-label={`Error: ${categorizedError.title}`}
    >
      <div className="flex flex-col items-center gap-4 p-6 max-w-sm text-center">
        <AlertTriangle className="h-10 w-10 text-red-500" strokeWidth={1.5} aria-hidden="true" />

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-100">
            {categorizedError.title}
          </h3>
          <p className="text-sm text-slate-400">
            {categorizedError.message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600/50 rounded text-sm font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            type="button"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState(): JSX.Element {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90"
      role="status"
      aria-label="No point cloud loaded"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Box className="h-10 w-10 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm text-slate-400">No Point Cloud Selected</p>
      </div>
    </div>
  );
}

/**
 * PointCloudViewer - 3D point cloud visualization component
 *
 * Features:
 * - WebGL-based point cloud rendering via Three.js
 * - Support for LAS/LAZ file formats
 * - Multiple color modes (RGB, Height, Intensity, Classification)
 * - Automatic performance optimization
 * - Responsive container sizing
 * - Loading and error state handling
 * - Orbit controls for camera manipulation
 * - Imperative ref for optimizer control
 */
const PointCloudViewer = forwardRef<PointCloudViewerRef, PointCloudViewerProps>(
  (
    {
      lasFilePath,
      colorMode = 'RGB',
      onStatsUpdate,
      className = '',
      enableOptimizer: enableOptimizerProp = true,
      onLoadingChange,
      onError,
      onRenderFrame,
      classificationFilter = null,
      classificationColorRange = null,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasFilePath = Boolean(lasFilePath && lasFilePath.trim());

    const {
      isLoading,
      error,
      stats,
      setOptimizerMode,
      getOptimizerMode,
      enableOptimizer,
      disableOptimizer,
      isOptimizerEnabled,
    } = usePointCloud({
      containerRef,
      lasFilePath: hasFilePath ? lasFilePath : '',
      colorMode,
      onStatsUpdate,
      enableOptimizer: enableOptimizerProp,
      onRenderFrame,
      classificationFilter,
      classificationColorRange,
    });

    useImperativeHandle(ref, () => ({
      setOptimizerMode,
      getOptimizerMode,
      enableOptimizer,
      disableOptimizer,
      isOptimizerEnabled,
    }));

    const prevLoadingRef = useRef(isLoading);

    useEffect(() => {
      if (prevLoadingRef.current !== isLoading) {
        prevLoadingRef.current = isLoading;
        onLoadingChange?.(isLoading);
      }
    }, [isLoading, onLoadingChange]);

    useEffect(() => {
      if (error) {
        onError?.(error);
      }
    }, [error, onError]);

    function handleRetry(): void {
      window.location.reload();
    }

    const showStats = hasFilePath && !isLoading && !error && stats;

    return (
      <div
        className={`relative bg-slate-950 overflow-hidden ${className}`}
        data-testid="pointcloud-viewer"
      >
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
        />

        {!hasFilePath && <EmptyState />}
        {hasFilePath && isLoading && <LoadingOverlay />}
        {hasFilePath && error && !isLoading && (
          <ErrorOverlay message={error} onRetry={handleRetry} />
        )}

        {showStats && (
          <div
            className="absolute bottom-3 left-3 z-10 px-3 py-2 bg-slate-900/95 border border-slate-700/50 rounded text-xs font-mono text-slate-400 pointer-events-none select-none"
            aria-label="Point cloud statistics"
          >
            <span className="text-slate-500">Points:</span>{' '}
            <span className="text-slate-300">{stats.totalPoints.toLocaleString()}</span>
            <span className="mx-2 text-slate-600">|</span>
            <span className="text-slate-500">FPS:</span>{' '}
            <span className={stats.fps < 30 ? 'text-amber-400' : 'text-emerald-400'}>{stats.fps}</span>
          </div>
        )}
      </div>
    );
  }
);

PointCloudViewer.displayName = 'PointCloudViewer';

export default PointCloudViewer;
export { PointCloudViewer };
export type { PointCloudViewerProps, PointCloudViewerRef };
