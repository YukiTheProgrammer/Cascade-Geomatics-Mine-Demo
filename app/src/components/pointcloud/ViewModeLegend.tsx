import type { JSX } from 'react';
import type { ViewMode } from '@/types/pointcloud';

type LegendItem = {
  level: number;
  label: string;
  color: readonly [number, number, number];
};

type LegendConfig = {
  title: string;
  range: string;
  items: readonly LegendItem[];
};

const LEGENDS: Partial<Record<ViewMode, LegendConfig>> = {
  cracking: {
    title: 'Cracking',
    range: '0–4',
    items: [
      { level: 0, label: 'No cracks', color: [0, 0.8, 1] },
      { level: 1, label: 'Low', color: [0, 1, 0] },
      { level: 2, label: 'Moderate', color: [1, 1, 0] },
      { level: 3, label: 'High', color: [1, 0.65, 0] },
      { level: 4, label: 'Major', color: [1, 0, 0] },
    ],
  },
  micro_movements: {
    title: 'Micro Movements',
    range: '5–8',
    items: [
      { level: 1, label: 'Low / none', color: [0, 1, 0] },
      { level: 2, label: 'Low–med', color: [1, 1, 0] },
      { level: 3, label: 'Med–high', color: [1, 0.65, 0] },
      { level: 4, label: 'High', color: [1, 0, 0] },
    ],
  },
  risk: {
    title: 'Risk',
    range: '9–12',
    items: [
      { level: 1, label: 'Low risk', color: [0, 1, 0] },
      { level: 2, label: 'Moderate risk', color: [1, 1, 0] },
      { level: 3, label: 'High risk', color: [1, 0.65, 0] },
      { level: 4, label: 'Very high risk', color: [1, 0, 0] },
    ],
  },
};

function cssRgb([r, g, b]: readonly [number, number, number]): string {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

function ViewModeLegend({ viewMode }: { viewMode: ViewMode }): JSX.Element | null {
  const config = LEGENDS[viewMode];
  if (!config) return null;

  return (
    <div className="px-2 pt-2" data-testid={`view-mode-legend-${viewMode}`}>
      <div className="rounded-md border border-slate-700/40 bg-slate-950/35 px-2 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Legend
          </span>
          <span className="text-[10px] text-slate-500">
            {config.title} {config.range}
          </span>
        </div>

        <ul className="mt-2 grid gap-1" role="list" aria-label={`${config.title} legend`}>
          {config.items.map((item) => (
            <li
              key={`${viewMode}-${item.level}`}
              className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-slate-900/40"
              data-testid={`view-mode-legend-item-${viewMode}-${item.level}`}
            >
              <span
                className="h-3.5 w-3.5 rounded-sm ring-1 ring-slate-800/80"
                aria-hidden="true"
                style={{ backgroundColor: cssRgb(item.color) }}
              />
              <span className="text-[11px] font-medium text-slate-200">Class {item.level}</span>
              <span className="text-[11px] text-slate-400 truncate">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewModeLegend;
export { ViewModeLegend };
