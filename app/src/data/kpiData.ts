/**
 * KPI Data Generators
 *
 * Placeholder data generators for KPI components on the Quick Overview page.
 */

import {
  KPIStatus,
  type KPIStrip,
  KPIStripType,
  type WeatherKPI,
  WeatherCondition,
  type HardwareKPI,
  HardwareType,
  type HardwareUnit,
} from '../types/kpi';

function createRelativeTimestamp(minutesAgo: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
}

/**
 * Generates hardware KPI data for the Quick Overview dashboard.
 * Returns monitoring status for Towers, Server, and Model components.
 */
export function generateHardwareKPIs(): KPIStrip {
  const now = new Date().toISOString();

  // Tower configuration: [location, minutesAgo, isOnline]
  const towerConfig: [string, number, boolean][] = [
    ['North Quadrant', 1, true],
    ['East Quadrant', 2, true],
    ['South Quadrant', 45, false],
    ['West Quadrant', 1, true],
    ['Central', 3, true],
  ];

  const towerUnits: HardwareUnit[] = towerConfig.map(
    ([location, minutesAgo, isOnline], index) => ({
      id: `tower-${index + 1}`,
      name: `Tower ${index + 1}`,
      status: isOnline ? KPIStatus.SUCCESS : KPIStatus.ERROR,
      lastContact: createRelativeTimestamp(minutesAgo),
      location,
    })
  );

  const towersKPI: HardwareKPI = {
    id: 'hardware-towers',
    title: 'Towers',
    value: '4/5 Online',
    status: KPIStatus.WARNING,
    icon: 'Tower',
    lastUpdated: createRelativeTimestamp(1),
    description: 'Tower 3 is currently offline - maintenance required',
    hardwareType: HardwareType.TOWER,
    onlineCount: 4,
    totalCount: 5,
    units: towerUnits,
    healthPercentage: 80,
  };

  const serverKPI: HardwareKPI = {
    id: 'hardware-server',
    title: 'Server',
    value: 'Operational',
    status: KPIStatus.SUCCESS,
    icon: 'Server',
    lastUpdated: createRelativeTimestamp(0),
    description: 'All server systems functioning normally',
    hardwareType: HardwareType.SERVER,
    healthPercentage: 100,
  };

  const modelKPI: HardwareKPI = {
    id: 'hardware-model',
    title: 'Model',
    value: 'Updated 2h ago',
    status: KPIStatus.INFO,
    icon: 'Brain',
    lastUpdated: createRelativeTimestamp(120),
    description: 'Risk analysis model last updated 2 hours ago',
    hardwareType: HardwareType.MODEL,
    healthPercentage: 100,
  };

  return {
    id: 'hardware-kpi-strip',
    title: 'Hardware Status',
    type: KPIStripType.HARDWARE,
    cards: [towersKPI, serverKPI, modelKPI],
    description: 'Real-time monitoring of mine hardware infrastructure',
    lastUpdated: now,
  };
}

/**
 * Generates geological monitoring KPI data for the Quick Overview dashboard.
 * Returns risk analysis metrics relevant to mine operations and slope stability.
 */
export function generateWeatherKPIs(): KPIStrip {
  const now = new Date().toISOString();
  const weatherTimestamp = createRelativeTimestamp(5);

  // Geological monitoring KPI configuration: [id, title, value, unit, icon, description, range]
  const monitoringConfig: Array<{
    id: string;
    title: string;
    value: number;
    unit: string;
    icon: string;
    description: string;
    range?: { min: number; max: number };
  }> = [
    {
      id: 'monitoring-runout',
      title: 'Runout Zone',
      value: 450,
      unit: 'ft',
      icon: 'MapPin',
      description: 'Max reach distance (exclusion zone)',
      range: { min: 380, max: 520 },
    },
    {
      id: 'monitoring-failure-prob',
      title: 'P(Failure)',
      value: 13,
      unit: '%',
      icon: 'AlertTriangle',
      description: 'Probability of failure (next 6 hr)',
      range: { min: 8, max: 18 },
    },
    {
      id: 'monitoring-micro-mov',
      title: 'Micro-Mov',
      value: 1.0,
      unit: 'in',
      icon: 'Activity',
      description: 'Displacement (last 6 hr)',
      range: { min: 0.45, max: 1.6 },
    },
    {
      id: 'monitoring-accel',
      title: 'Δ Rate',
      value: 0.04,
      unit: 'in/hr²',
      icon: 'TrendingUp',
      description: 'Acceleration (rate ↑ 2.0–3.5×)',
      range: { min: 0.02, max: 0.06 },
    },
    {
      id: 'monitoring-volume',
      title: 'Unstable Vol',
      value: 4.2,
      unit: 'ft³',
      icon: 'Box',
      description: 'Estimated mass (confidence: Medium)',
    },
    {
      id: 'monitoring-triggers',
      title: 'Triggers',
      value: 2.3,
      unit: 'in',
      icon: 'AlertCircle',
      description: 'Rain/SWE (24h); Freeze-thaw: Yes',
    },
  ];

  const weatherCards: WeatherKPI[] = monitoringConfig.map(
    ({ id, title, value, unit, icon, description, range }) => ({
      id,
      title,
      value,
      unit,
      icon,
      description,
      timestamp: weatherTimestamp,
      condition: WeatherCondition.CLEAR,
      range,
    })
  );

  return {
    id: 'weather-kpi-strip',
    title: 'Risk Monitoring',
    type: KPIStripType.WEATHER,
    cards: weatherCards,
    description: 'Geological stability and risk analysis metrics',
    lastUpdated: now,
  };
}

