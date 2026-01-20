/**
 * Quick Overview Page
 *
 * Primary dashboard displaying KPIs for hardware status, environmental
 * conditions, and recent activity. Designed for fast scanning and
 * immediate comprehension by quarry operators.
 */

import { useMemo } from 'react';
import { KPIStrip, WeatherKPI as WeatherKPIComponent } from '../components/kpi';
import { ActivityLog } from '../components/activity';
import { generateHardwareKPIs, generateWeatherKPIs } from '../data/kpiData';
import { getPlaceholderActivities } from '../data/activityData';
import type { WeatherKPI as WeatherKPIType } from '../types/kpi';

function QuickOverview() {
  const hardwareKPIs = useMemo(() => generateHardwareKPIs(), []);
  const weatherKPIs = useMemo(() => generateWeatherKPIs(), []);
  const activities = useMemo(() => getPlaceholderActivities(), []);

  const renderWeatherCard = (card: WeatherKPIType) => (
    <WeatherKPIComponent data={card} className="h-full" />
  );

  return (
    <main className="min-h-full bg-slate-900 text-slate-100" aria-label="Operations overview dashboard">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5">
        {/* Page Header - Minimal */}
        <header className="mb-6 flex items-baseline gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            Operations Overview
          </h1>
          <span className="text-xs text-slate-500 font-mono">
            Real-time monitoring
          </span>
        </header>

        {/* KPI Sections - Tight spacing */}
        <div className="space-y-4">
          <KPIStrip data={hardwareKPIs} />
          <KPIStrip data={weatherKPIs} renderWeatherCard={renderWeatherCard} />
        </div>

        {/* Activity Log */}
        <div className="mt-6">
          <ActivityLog
            activities={activities}
            title="Activity"
            maxItems={8}
            showFilterControls
          />
        </div>
      </div>
    </main>
  );
}

export default QuickOverview;
