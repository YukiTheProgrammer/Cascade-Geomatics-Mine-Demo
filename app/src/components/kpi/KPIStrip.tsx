/**
 * KPIStrip Component
 *
 * Description:
 * Container component that displays KPI cards in a responsive grid layout.
 * Supports different strip types (hardware, weather, operations, safety, custom)
 * with type-specific styling and grid configurations.
 *
 * Sample Input:
 * - data: { id: "hardware-strip", title: "Hardware Status", type: "hardware", cards: [...], lastUpdated: Date }
 * - onCardClick: (cardId) => console.log("Clicked:", cardId)
 *
 * Expected Output:
 * A styled section containing a header with title/timestamp and a responsive grid of KPI cards.
 */

import { useMemo } from 'react';

import {
  type KPICard as KPICardData,
  type KPIStrip as KPIStripData,
  type WeatherKPI,
  KPIStripType,
} from '../../types/kpi';
import { KPICard } from './KPICard';

interface KPIStripProps {
  data: KPIStripData;
  className?: string;
  onCardClick?: (cardId: string) => void;
  renderWeatherCard?: (card: WeatherKPI) => React.ReactNode;
}

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function isWeatherKPI(card: KPICardData | WeatherKPI): card is WeatherKPI {
  return typeof card.value === 'number' && !('status' in card);
}

function convertWeatherKPIToCardData(weatherKPI: WeatherKPI): KPICardData {
  return {
    id: weatherKPI.id,
    title: weatherKPI.title,
    value: weatherKPI.value.toString(),
    unit: weatherKPI.unit,
    icon: weatherKPI.icon,
    lastUpdated: weatherKPI.timestamp ?? new Date(),
    description: weatherKPI.description,
  };
}

const GRID_CLASSES: Record<KPIStripType, string> = {
  [KPIStripType.HARDWARE]: 'grid-cols-1 sm:grid-cols-3',
  [KPIStripType.WEATHER]: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  [KPIStripType.OPERATIONS]: 'grid-cols-2 sm:grid-cols-4',
  [KPIStripType.SAFETY]: 'grid-cols-1 sm:grid-cols-3',
  [KPIStripType.CUSTOM]: 'grid-cols-2 sm:grid-cols-4',
};

const ACCENT_COLORS: Record<KPIStripType, string> = {
  [KPIStripType.HARDWARE]: 'border-l-amber-500',
  [KPIStripType.WEATHER]: 'border-l-cyan-500',
  [KPIStripType.OPERATIONS]: 'border-l-emerald-500',
  [KPIStripType.SAFETY]: 'border-l-red-500',
  [KPIStripType.CUSTOM]: 'border-l-violet-500',
};

function KPIStrip({
  data,
  className = '',
  onCardClick,
  renderWeatherCard,
}: KPIStripProps): React.ReactElement {
  const { id, title, type, cards, lastUpdated } = data;

  const formattedTime = useMemo(() => formatTimestamp(lastUpdated), [lastUpdated]);
  const gridClasses = GRID_CLASSES[type] ?? GRID_CLASSES[KPIStripType.CUSTOM];
  const accentColor = ACCENT_COLORS[type] ?? ACCENT_COLORS[KPIStripType.CUSTOM];

  function renderCard(card: KPICardData | WeatherKPI, index: number): React.ReactNode {
    if (isWeatherKPI(card)) {
      if (renderWeatherCard) {
        return (
          <div key={card.id || index} className="h-full">
            {renderWeatherCard(card)}
          </div>
        );
      }
      const convertedCard = convertWeatherKPIToCardData(card);
      return (
        <KPICard
          key={convertedCard.id || index}
          data={convertedCard}
          onClick={onCardClick ? () => onCardClick(convertedCard.id) : undefined}
          className="h-full"
        />
      );
    }

    return (
      <KPICard
        key={card.id || index}
        data={card}
        onClick={onCardClick ? () => onCardClick(card.id) : undefined}
        className="h-full"
      />
    );
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`bg-slate-800/50 rounded-lg border-l-2 ${accentColor} ${className}`}
    >
      <header className="px-4 py-2.5 flex items-center justify-between border-b border-slate-700/30">
        <h2 id={`${id}-title`} className="text-sm font-medium text-slate-200">
          {title}
        </h2>
        <time className="text-[11px] text-slate-500 font-mono tabular-nums">
          {formattedTime}
        </time>
      </header>

      <div className="p-3">
        <div className={`grid ${gridClasses} gap-2.5`}>
          {cards.map((card, index) => renderCard(card, index))}
        </div>
      </div>
    </section>
  );
}

export default KPIStrip;
export { KPIStrip };
export type { KPIStripProps };
