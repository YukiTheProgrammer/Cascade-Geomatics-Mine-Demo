/**
 * Past Events Data Module
 *
 * Description:
 * Provides placeholder past event data for the Mine Demo Dashboard Past Events Panel.
 * Contains historical geological event records for development and demonstration purposes.
 * Events include rockfalls, landslides, and subsidence incidents with varied similarity
 * percentages to showcase pattern matching capabilities.
 *
 * Sample Input:
 * import { getPastEvents, getPastEventById, getPastEventsByType } from '@/data/pastEventsData';
 * const events = getPastEvents();
 * const event1 = getPastEventById('PE001');
 * const rockfalls = getPastEventsByType('rockfall');
 *
 * Expected Output:
 * An array of PastEvent objects with:
 *   - 3 historical events with unique identifiers
 *   - Varied event types (rockfall, landslide, subsidence)
 *   - Similarity percentages ranging from 45-89%
 *   - Dates from 6 months to 2 years ago
 *   - Locations matching tower monitoring regions
 */

import { type PastEvent, type EventTypeValue, EventType, KPIStatus } from '../types/kpi';

/**
 * Generates a timestamp N days ago from current date
 * @param daysAgo - Number of days before current time
 * @returns ISO string timestamp
 */
const getDateDaysAgo = (daysAgo: number): string => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
};

/**
 * Creates the placeholder past events data
 * Event 1: Recent rockfall with high similarity
 * Event 2: Landslide from about a year ago with medium similarity
 * Event 3: Subsidence from nearly 2 years ago with lower similarity
 */
const createPastEvents = (): PastEvent[] => {
  const events: PastEvent[] = [];

  // Event 1 - Rockfall at North Ridge (6 months ago, 89% similarity)
  events.push({
    id: 'PE001',
    name: 'North Ridge Rockfall 2025',
    eventType: EventType.ROCKFALL,
    date: getDateDaysAgo(182), // ~6 months ago
    location: 'North Ridge',
    similarityPercentage: 89,
    description:
      'Medium-scale rockfall event triggered by seasonal freeze-thaw cycles. ' +
      'Approximately 450 cubic meters of material displaced from upper bench. ' +
      'Detected early by LIDAR monitoring system, allowing evacuation of work area.',
    affectedArea: 1200,
    severity: KPIStatus.WARNING,
  });

  // Event 2 - Landslide at East Slope (14 months ago, 67% similarity)
  events.push({
    id: 'PE002',
    name: 'East Slope Landslide 2024',
    eventType: EventType.LANDSLIDE,
    date: getDateDaysAgo(425), // ~14 months ago
    location: 'East Slope',
    similarityPercentage: 67,
    description:
      'Significant landslide following extended period of heavy rainfall. ' +
      'Slope failure occurred along pre-existing discontinuity plane. ' +
      'Event resulted in temporary closure of haul road for 3 weeks during remediation.',
    affectedArea: 3500,
    severity: KPIStatus.ERROR,
  });

  // Event 3 - Subsidence at West Quarry (22 months ago, 45% similarity)
  events.push({
    id: 'PE003',
    name: 'West Quarry Subsidence 2024',
    eventType: EventType.SUBSIDENCE,
    date: getDateDaysAgo(670), // ~22 months ago
    location: 'West Quarry',
    similarityPercentage: 45,
    description:
      'Gradual ground subsidence detected near pit floor area. ' +
      'Attributed to dewatering activities affecting underlying clay layer. ' +
      'Ground probe network provided 72-hour advance warning of acceleration.',
    affectedArea: 850,
    severity: KPIStatus.WARNING,
  });

  return events;
};

/**
 * Cached past events data
 */
let cachedEvents: PastEvent[] | null = null;

/**
 * Returns the placeholder past events data array
 * Uses caching to ensure consistent data across component renders
 *
 * @returns Array of PastEvent objects for the past events panel
 */
export const getPastEvents = (): PastEvent[] => {
  if (!cachedEvents) {
    cachedEvents = createPastEvents();
  }
  return cachedEvents;
};

/**
 * Returns a specific past event by ID
 *
 * @param eventId - The event identifier (e.g., 'PE001')
 * @returns PastEvent object or undefined if not found
 */
export const getPastEventById = (eventId: string): PastEvent | undefined => {
  return getPastEvents().find((event) => event.id === eventId);
};

/**
 * Returns past events filtered by event type
 *
 * @param eventType - The event type to filter by
 * @returns Filtered array of PastEvent objects
 */
export const getPastEventsByType = (eventType: EventTypeValue): PastEvent[] => {
  return getPastEvents().filter((event) => event.eventType === eventType);
};

/**
 * Returns past events sorted by similarity percentage (highest first)
 *
 * @returns Array of PastEvent objects sorted by similarity
 */
export const getPastEventsBySimilarity = (): PastEvent[] => {
  return [...getPastEvents()].sort((a, b) => b.similarityPercentage - a.similarityPercentage);
};

/**
 * Returns count of events by type
 *
 * @returns Object with counts for each event type
 */
export const getEventTypeCounts = (): Record<string, number> => {
  const events = getPastEvents();
  return {
    rockfall: events.filter((e) => e.eventType === EventType.ROCKFALL).length,
    landslide: events.filter((e) => e.eventType === EventType.LANDSLIDE).length,
    subsidence: events.filter((e) => e.eventType === EventType.SUBSIDENCE).length,
    erosion: events.filter((e) => e.eventType === EventType.EROSION).length,
    total: events.length,
  };
};

/**
 * Clears the cached events data (useful for testing or refreshing data)
 */
export const clearPastEventsCache = (): void => {
  cachedEvents = null;
};

export default getPastEvents;
