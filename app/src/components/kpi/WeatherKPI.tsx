/**
 * WeatherKPI Component
 *
 * Description:
 * A specialized compact KPI card for displaying weather and monitoring metrics in the Mine Demo
 * Dashboard. Designed for scientific clarity with an industrial-utilitarian aesthetic,
 * optimized for displaying 6 metrics in a grid layout. Each card shows the measurement value
 * and unit prominently.
 *
 * Sample Input:
 * <WeatherKPI
 *   data={{
 *     id: "temp-001",
 *     title: "Temperature",
 *     value: 23.5,
 *     unit: "°C",
 *     icon: "Thermometer"
 *   }}
 * />
 *
 * Expected Output:
 * A compact card displaying:
 *   - Weather icon (Thermometer) in the header
 *   - Title "Temperature"
 *   - Value "23.5°C" prominently displayed
 */

import { type FC } from 'react';
import {
  Thermometer,
  CloudRain,
  Wind,
  Compass,
  Droplets,
  Gauge,
  MapPin,
  AlertTriangle,
  Activity,
  TrendingUp,
  Box,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { type WeatherKPI as WeatherKPIType } from '../../types/kpi';
import { WEATHER_TYPES } from '../../utils/constants';

interface WeatherKPIProps {
  /** Weather KPI data object containing all display information */
  data: WeatherKPIType;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Maps weather type titles to their corresponding Lucide icons.
 * Uses the WEATHER_TYPES constant values for consistent matching.
 */
const WEATHER_ICON_MAP: Record<string, LucideIcon> = {
  [WEATHER_TYPES.Temperature]: Thermometer,
  [WEATHER_TYPES.Precipitation]: CloudRain,
  [WEATHER_TYPES.WindSpeed]: Wind,
  [WEATHER_TYPES.WindDirection]: Compass,
  [WEATHER_TYPES.Humidity]: Droplets,
  [WEATHER_TYPES.Pressure]: Gauge,
  // Fallback icon names for direct icon prop usage
  Thermometer: Thermometer,
  CloudRain: CloudRain,
  Wind: Wind,
  Compass: Compass,
  Droplets: Droplets,
  Gauge: Gauge,
  MapPin: MapPin,
  AlertTriangle: AlertTriangle,
  Activity: Activity,
  TrendingUp: TrendingUp,
  Box: Box,
  AlertCircle: AlertCircle,
};

/**
 * Resolves the appropriate icon component based on the data's icon or title property.
 * Falls back to Gauge if no matching icon is found.
 */
const resolveIcon = (data: WeatherKPIType): LucideIcon => {
  // First try to match by icon prop
  if (data.icon && WEATHER_ICON_MAP[data.icon]) {
    return WEATHER_ICON_MAP[data.icon];
  }
  // Then try to match by title
  if (WEATHER_ICON_MAP[data.title]) {
    return WEATHER_ICON_MAP[data.title];
  }
  // Default fallback
  return Gauge;
};

/**
 * Formats the display value with appropriate precision.
 * Integers remain as-is, decimals are formatted to 1-2 decimal places based on magnitude.
 */
const formatValue = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // For very small values (< 0.1), show 2 decimal places
  if (Math.abs(value) < 0.1) {
    return value.toFixed(2);
  }
  // For other decimals, show 1 decimal place
  return value.toFixed(1);
};

/**
 * WeatherKPI - Compact weather metric display card
 *
 * A specialized component for displaying environmental measurements with
 * scientific precision. Optimized for grid layouts with 6 weather metrics.
 *
 * @param props - Component props including weather data and optional className
 * @returns A styled card element displaying the weather metric
 */
const WeatherKPI: FC<WeatherKPIProps> = ({ data, className = '' }) => {
  const Icon = resolveIcon(data);

  return (
    <div
      className={`
        relative
        bg-slate-800/60
        border border-slate-700/50
        rounded-lg
        p-3
        min-w-[140px]
        ${className}
      `.trim()}
      data-testid="weather-kpi-card"
    >
      {/* Header: Icon and Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-700/50">
          <Icon
            size={14}
            strokeWidth={1.75}
            className="text-slate-400"
            aria-hidden="true"
          />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 truncate">
          {data.title}
        </span>
      </div>

      {/* Primary Value Display */}
      <div className="flex items-baseline gap-1">
        <span
          className="text-2xl font-semibold text-slate-100 tabular-nums tracking-tight leading-none"
          style={{ fontFeatureSettings: '"tnum" 1' }}
        >
          {formatValue(data.value)}
        </span>
        <span className="text-sm font-medium text-slate-500 leading-none">
          {data.unit}
        </span>
      </div>
    </div>
  );
};

export default WeatherKPI;
export { WeatherKPI };
export type { WeatherKPIProps };
