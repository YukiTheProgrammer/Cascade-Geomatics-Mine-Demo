/**
 * KPI Components Index
 *
 * Description:
 * Barrel export file for KPI (Key Performance Indicator) components.
 * Provides a single import point for all KPI-related components used
 * throughout the Mine Demo Dashboard, including KPICard (individual metric
 * display), KPIStrip (container for multiple cards), and WeatherKPI
 * (specialized weather metric display).
 *
 * Sample Input:
 * import { KPICard, KPIStrip, WeatherKPI } from '@/components/kpi';
 *
 * Expected Output:
 * Access to all exported KPI components and their associated types.
 */

export { KPICard, default as KPICardDefault } from './KPICard';
export type { KPICardProps } from './KPICard';

export { KPIStrip, default as KPIStripDefault } from './KPIStrip';
export type { KPIStripProps } from './KPIStrip';

export { WeatherKPI, default as WeatherKPIDefault } from './WeatherKPI';
export type { WeatherKPIProps } from './WeatherKPI';
