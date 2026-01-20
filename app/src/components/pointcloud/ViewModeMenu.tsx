/**
 * ViewModeMenu Component
 *
 * Description:
 * A floating menu for switching point cloud view modes and controlling optimizer settings.
 * Each view mode maps to a specific color mode in the renderer for different analysis views.
 *
 * Sample Input:
 * <ViewModeMenu currentMode="default" onModeChange={(mode) => setViewMode(mode)} />
 *
 * Expected Output:
 * - A floating menu panel with view mode buttons and optional optimizer controls
 * - Visual highlight on the currently active mode
 */

import {
  Activity,
  AlertTriangle,
  Eye,
  Scan,
  Target,
  TrendingUp,
  Zap,
  ZapOff,
  ZoomIn,
} from 'lucide-react';

import type { ColorMode, OptimizerMode, ViewMode } from '@/types/pointcloud';

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

interface ViewModeMenuProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  optimizerEnabled?: boolean;
  optimizerMode?: OptimizerMode;
  onToggleOptimizer?: () => void;
  onOptimizerModeChange?: (mode: OptimizerMode) => void;
  className?: string;
}

interface ModeConfig<T extends string> {
  mode: T;
  label: string;
  description: string;
  icon: IconComponent;
}

const VIEW_MODE_CONFIGS: ModeConfig<ViewMode>[] = [
  { mode: 'default', label: 'Default', description: 'Original RGB colors', icon: Eye },
  { mode: 'height', label: 'Height', description: 'Elevation gradient', icon: TrendingUp },
  { mode: 'cracking', label: 'Cracking', description: 'Crack detection analysis', icon: Scan },
  { mode: 'micro_movements', label: 'Micro Movements', description: 'Movement detection', icon: Activity },
  { mode: 'risk', label: 'Risk', description: 'Risk assessment zones', icon: AlertTriangle },
];

const OPTIMIZER_MODE_CONFIGS: ModeConfig<OptimizerMode>[] = [
  { mode: 'fps', label: 'FPS', description: 'Target frame rate', icon: Target },
  { mode: 'zoom', label: 'Zoom', description: 'Camera distance', icon: ZoomIn },
];

const VIEW_MODE_TO_COLOR_MODE: Record<ViewMode, ColorMode> = {
  default: 'RGB',
  height: 'Height',
  cracking: 'Cracking',
  micro_movements: 'Classification',
  risk: 'Classification',
};

/** Maps ViewMode to the corresponding ColorMode for the renderer */
export function viewModeToColorMode(viewMode: ViewMode): ColorMode {
  return VIEW_MODE_TO_COLOR_MODE[viewMode];
}

function ViewModeMenu({
  currentMode,
  onModeChange,
  optimizerEnabled = true,
  optimizerMode = 'fps',
  onToggleOptimizer,
  onOptimizerModeChange,
  className = '',
}: ViewModeMenuProps): React.JSX.Element {
  const showOptimizer = onToggleOptimizer !== undefined;

  return (
    <div
      className={`absolute z-20 flex flex-col gap-0.5 p-2 bg-slate-900/95 border border-slate-700/50 rounded-lg ${className}`}
      data-testid="view-mode-menu"
      role="group"
      aria-label="View mode selection"
    >
      <div className="px-2 py-1.5 mb-1 border-b border-slate-700/50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          View Mode
        </span>
      </div>

      {VIEW_MODE_CONFIGS.map(({ mode, label, icon: Icon }) => {
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
              isActive
                ? 'bg-sky-600/20 text-sky-100'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
            data-testid={`view-mode-${mode}`}
            aria-pressed={isActive}
            aria-label={`${label} view mode`}
            type="button"
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} strokeWidth={2} aria-hidden="true" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}

      {showOptimizer && (
        <>
          <div className="my-1 border-t border-slate-700/50" />

          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <span className="text-xs font-medium text-slate-400">Optimizer</span>
            <button
              onClick={onToggleOptimizer}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                optimizerEnabled
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
              data-testid="optimizer-toggle"
              aria-pressed={optimizerEnabled}
              aria-label={optimizerEnabled ? 'Disable optimizer' : 'Enable optimizer'}
              type="button"
            >
              {optimizerEnabled ? (
                <Zap className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              ) : (
                <ZapOff className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              )}
              <span>{optimizerEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {optimizerEnabled && onOptimizerModeChange && (
            <div className="flex gap-1 px-2 pb-1">
              {OPTIMIZER_MODE_CONFIGS.map(({ mode, label, icon: Icon }) => {
                const isActive = optimizerMode === mode;

                return (
                  <button
                    key={mode}
                    onClick={() => onOptimizerModeChange(mode)}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${
                      isActive
                        ? 'bg-sky-600/30 text-sky-300'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                    data-testid={`optimizer-mode-${mode}`}
                    aria-pressed={isActive}
                    aria-label={`${label} optimizer mode`}
                    type="button"
                  >
                    <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewModeMenu;
export { ViewModeMenu };
export type { ViewModeMenuProps };
