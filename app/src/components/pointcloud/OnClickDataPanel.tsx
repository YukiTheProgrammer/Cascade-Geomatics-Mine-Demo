/**
 * OnClickDataPanel Component
 *
 * Description:
 * A sliding panel component that displays weather KPI data when an annotation
 * is clicked on the 3D point cloud visualization. Shows location-specific
 * environmental data including Temperature, Humidity, Wind Speed, and Pressure
 * in a 2x2 grid layout with smooth slide-in animation from the right.
 *
 * Sample Input:
 * <OnClickDataPanel
 *   annotation={{
 *     id: "ann-001",
 *     label: "Risk Zone Alpha",
 *     position: { x: 100, y: 50, z: 200 },
 *     type: "risk_zone"
 *   }}
 *   isOpen={true}
 *   onClose={() => setSelectedAnnotation(null)}
 * />
 *
 * Expected Output:
 * A floating panel sliding in from the right side containing:
 *   - Header with annotation label and close button
 *   - 4 WeatherKPI cards in a 2x2 grid showing:
 *     - Temperature (in Celsius)
 *     - Humidity (percentage)
 *     - Wind Speed (km/h)
 *     - Pressure (hPa)
 *   - Smooth CSS transition animation on open/close
 */

import { type FC, useMemo } from 'react';
import { X, MapPin } from 'lucide-react';
import { WeatherKPI } from '@/components/kpi/WeatherKPI';
import { type WeatherKPI as WeatherKPIType } from '@/types/kpi';
import { WEATHER_TYPES, WEATHER_UNITS } from '@/utils/constants';

/**
 * Annotation data that works with both useAnnotations hook and pointcloud types
 * Supports position as object { x, y, z } or tuple [x, y, z]
 */
interface AnnotationInput {
  /** Unique identifier for the annotation */
  id: string | number;
  /** Display label for the annotation */
  label?: string;
  /** Text content (alternative to label from useAnnotations) */
  text?: string;
  /** 3D position as object or tuple */
  position: { x: number; y: number; z: number } | [number, number, number];
  /** Annotation type */
  type?: string;
  /** Color of the annotation marker */
  color?: string;
  /** Additional metadata */
  metadata?: {
    description?: string;
    [key: string]: unknown;
  };
}

/**
 * Props for the OnClickDataPanel component
 */
interface OnClickDataPanelProps {
  /** The annotation data for the clicked point */
  annotation: AnnotationInput | null;
  /** Callback when the panel close button is clicked */
  onClose: () => void;
  /** Whether the panel is currently visible */
  isOpen: boolean;
  /** Optional additional CSS classes for positioning */
  className?: string;
}

/**
 * Generates deterministic placeholder weather data based on annotation ID.
 * Uses a simple hash function to create consistent values for each annotation.
 * In a production environment, this would be replaced with actual API data.
 *
 * @param annotationId - The unique identifier of the annotation
 * @returns Array of WeatherKPI data objects
 */
const generateWeatherData = (annotationId: string): WeatherKPIType[] => {
  // Simple hash function to generate consistent pseudo-random values
  const hash = annotationId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  // Generate deterministic values based on hash
  const baseTemp = 15 + Math.abs(hash % 20); // 15-35 range
  const baseHumidity = 30 + Math.abs((hash >> 4) % 50); // 30-80 range
  const baseWindSpeed = 5 + Math.abs((hash >> 8) % 30); // 5-35 range
  const basePressure = 1000 + Math.abs((hash >> 12) % 40); // 1000-1040 range

  return [
    {
      id: `${annotationId}-temp`,
      title: WEATHER_TYPES.Temperature,
      value: baseTemp + (Math.abs(hash % 10) / 10),
      unit: WEATHER_UNITS.Temperature,
      icon: 'Thermometer',
      range: {
        min: baseTemp - 5,
        max: baseTemp + 8,
      },
    },
    {
      id: `${annotationId}-humidity`,
      title: WEATHER_TYPES.Humidity,
      value: baseHumidity + (Math.abs((hash >> 2) % 10) / 10),
      unit: WEATHER_UNITS.Humidity,
      icon: 'Droplets',
      range: {
        min: baseHumidity - 15,
        max: baseHumidity + 10,
      },
    },
    {
      id: `${annotationId}-wind`,
      title: WEATHER_TYPES.WindSpeed,
      value: baseWindSpeed + (Math.abs((hash >> 6) % 10) / 10),
      unit: WEATHER_UNITS.WindSpeed,
      icon: 'Wind',
      range: {
        min: Math.max(0, baseWindSpeed - 10),
        max: baseWindSpeed + 15,
      },
    },
    {
      id: `${annotationId}-pressure`,
      title: WEATHER_TYPES.Pressure,
      value: basePressure + (Math.abs((hash >> 10) % 10) / 10),
      unit: WEATHER_UNITS.Pressure,
      icon: 'Gauge',
      range: {
        min: basePressure - 15,
        max: basePressure + 15,
      },
    },
  ];
};

/**
 * Formats the annotation type for display.
 * Converts snake_case to Title Case with spaces.
 *
 * @param type - The annotation type string
 * @returns Formatted display string
 */
const formatAnnotationType = (type: string | undefined): string => {
  if (!type) return 'Location';
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Gets the display label from annotation (supports both label and text fields)
 */
const getAnnotationLabel = (annotation: AnnotationInput): string => {
  return annotation.label || annotation.text || 'Unknown Location';
};

/**
 * Formats position for display, handling both object and tuple formats
 */
const formatPosition = (position: { x: number; y: number; z: number } | [number, number, number]): string => {
  if (Array.isArray(position)) {
    return position.map((coord) => coord.toFixed(2)).join(', ');
  }
  return `${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`;
};

/**
 * OnClickDataPanel - Sliding weather data panel for annotation details
 *
 * Features:
 * - Smooth slide-in animation from the right edge
 * - 2x2 grid layout of weather KPI cards
 * - Dark glassmorphic design with backdrop blur
 * - Close button with keyboard accessibility
 * - Responsive width optimized for overlay use
 *
 * @param props - Component props including annotation data and visibility state
 * @returns A positioned panel element with weather KPI data
 */
const OnClickDataPanel: FC<OnClickDataPanelProps> = ({
  annotation,
  onClose,
  isOpen,
  className = '',
}) => {
  // Generate weather data based on annotation ID for consistency
  const weatherData = useMemo(() => {
    if (!annotation) return [];
    return generateWeatherData(String(annotation.id));
  }, [annotation?.id]);

  // Format position for display
  const formattedPosition = useMemo(() => {
    if (!annotation?.position) return null;
    return formatPosition(annotation.position);
  }, [annotation?.position]);

  // Get display label
  const displayLabel = annotation ? getAnnotationLabel(annotation) : '';

  // Determine if panel should be truly visible (both isOpen AND has annotation)
  const isVisible = isOpen && annotation;

  // Don't render the panel at all when there's no annotation (after animation completes)
  if (!annotation) {
    return null;
  }

  return (
    <div
      className={`absolute top-0 right-0 h-full w-[320px] bg-slate-900/98 backdrop-blur-sm border-l border-slate-700/50 shadow-xl transform transition-transform duration-200 ease-out z-20 ${isVisible ? 'translate-x-0 visible' : 'translate-x-full invisible'} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Weather data for ${displayLabel}`}
      data-testid="onclick-data-panel"
      aria-hidden={!isVisible}
    >
      {annotation && (
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} strokeWidth={2} className="text-sky-400" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {formatAnnotationType(annotation.type)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
                aria-label="Close panel"
                type="button"
                data-testid="onclick-data-panel-close"
              >
                <X size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <h2
              className="text-lg font-semibold text-slate-100 leading-tight mb-1"
              data-testid="onclick-data-panel-title"
            >
              {displayLabel}
            </h2>

            {formattedPosition && (
              <p className="text-xs font-mono text-slate-500">
                Position: [{formattedPosition}]
              </p>
            )}

            {annotation.metadata?.description && (
              <p className="mt-2 text-sm text-slate-400">
                {annotation.metadata.description}
              </p>
            )}
          </div>

          {/* Weather KPI Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Environmental Conditions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {weatherData.map((kpi) => (
                <WeatherKPI key={kpi.id} data={kpi} />
              ))}
            </div>

            <p className="mt-4 text-[10px] text-slate-500 text-center">
              Environmental data simulated for demonstration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnClickDataPanel;
export { OnClickDataPanel };
export type { OnClickDataPanelProps, AnnotationInput };
