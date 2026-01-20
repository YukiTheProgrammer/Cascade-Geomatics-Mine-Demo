/**
 * InformationMenuTabs - Tab content components for InformationMenu
 *
 * Description:
 * Separated tab content components for the InformationMenu to keep file sizes manageable.
 * Contains DataTabContent, InstallationsTabContent, EventsTabContent, and TrackingTabContent.
 */

import { type FC, useState, useCallback, useMemo, useEffect } from 'react';
import {
  ChevronDown, Radio, Thermometer, Camera, Activity, CheckCircle2,
  AlertTriangle, XCircle, WifiOff, MapPin, Calendar, RadioTower,
  MousePointer, Truck, Cog, Tractor, Droplets, Car,
} from 'lucide-react';
import { getTowerInstallations, getTowerStatusCounts } from '@/data/installationsData';
import { getPastEvents } from '@/data/pastEventsData';
import { getTrackedVehicles, getVehicleStatusCounts } from '@/data/trackingData';
import { WeatherKPI } from '@/components/kpi/WeatherKPI';
import {
  type TowerInstallation, type HardwareUnit, type PastEvent, type TrackedVehicle,
  type EventTypeValue, type VehicleTypeValue, type VehicleStatusValue,
  type WeatherKPI as WeatherKPIType, KPIStatus, EventType, VehicleType, VehicleStatus,
} from '@/types/kpi';
import { HARDWARE_TYPES, WEATHER_TYPES, WEATHER_UNITS } from '@/utils/constants';

// =============================================================================
// Types
// =============================================================================

interface AnnotationInput {
  id: string | number;
  label?: string;
  text?: string;
  position: { x: number; y: number; z: number } | [number, number, number];
  type?: string;
  metadata?: { description?: string; [key: string]: unknown };
}

interface StatusConfig {
  label: string; bgColor: string; textColor: string; borderColor: string; dotColor: string;
  icon: typeof CheckCircle2;
}

// =============================================================================
// Configuration Objects
// =============================================================================

const STATUS_CONFIG: Record<KPIStatus, StatusConfig> = {
  [KPIStatus.SUCCESS]: { label: 'Operational', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30', dotColor: 'bg-emerald-400', icon: CheckCircle2 },
  [KPIStatus.WARNING]: { label: 'Warning', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', borderColor: 'border-amber-500/30', dotColor: 'bg-amber-400', icon: AlertTriangle },
  [KPIStatus.ERROR]: { label: 'Error', bgColor: 'bg-rose-500/10', textColor: 'text-rose-400', borderColor: 'border-rose-500/30', dotColor: 'bg-rose-400', icon: XCircle },
  [KPIStatus.INFO]: { label: 'Info', bgColor: 'bg-sky-500/10', textColor: 'text-sky-400', borderColor: 'border-sky-500/30', dotColor: 'bg-sky-400', icon: CheckCircle2 },
  [KPIStatus.UNKNOWN]: { label: 'Offline', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400', borderColor: 'border-slate-500/30', dotColor: 'bg-slate-500', icon: WifiOff },
};

const HARDWARE_ICONS: Record<string, typeof Radio> = {
  [HARDWARE_TYPES.LIDAR]: Radio, [HARDWARE_TYPES.Thermal]: Thermometer,
  [HARDWARE_TYPES.Camera]: Camera, [HARDWARE_TYPES.Probes]: Activity,
};

const EVENT_TYPE_CONFIG: Record<EventTypeValue, { bg: string; text: string; border: string; label: string }> = {
  [EventType.ROCKFALL]: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Rockfall' },
  [EventType.LANDSLIDE]: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Landslide' },
  [EventType.SUBSIDENCE]: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Subsidence' },
  [EventType.EROSION]: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', label: 'Erosion' },
};

const VEHICLE_TYPE_CONFIG: Record<VehicleTypeValue, { icon: typeof Truck; bg: string; text: string; border: string; label: string }> = {
  [VehicleType.HAUL_TRUCK]: { icon: Truck, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Haul Truck' },
  [VehicleType.EXCAVATOR]: { icon: Cog, bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Excavator' },
  [VehicleType.DOZER]: { icon: Tractor, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Dozer' },
  [VehicleType.WATER_TRUCK]: { icon: Droplets, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Water Truck' },
  [VehicleType.LIGHT_VEHICLE]: { icon: Car, bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Light Vehicle' },
};

const VEHICLE_STATUS_CONFIG: Record<VehicleStatusValue, { label: string; bg: string; text: string; dot: string; pulse: boolean }> = {
  [VehicleStatus.ACTIVE]: { label: 'Active', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400', pulse: true },
  [VehicleStatus.IDLE]: { label: 'Idle', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', pulse: false },
  [VehicleStatus.OFFLINE]: { label: 'Offline', bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-500', pulse: false },
  [VehicleStatus.MAINTENANCE]: { label: 'Maintenance', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400', pulse: false },
};

// =============================================================================
// Helper Functions
// =============================================================================

const formatLastContact = (lastContact: Date | string): string => {
  const diffMins = Math.floor((Date.now() - new Date(lastContact).getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const formatEventDate = (d: Date | string): string => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const generateWeatherData = (id: string): WeatherKPIType[] => {
  const h = id.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const t = 15 + Math.abs(h % 20), hm = 30 + Math.abs((h >> 4) % 50);
  const w = 5 + Math.abs((h >> 8) % 30), p = 1000 + Math.abs((h >> 12) % 40);
  return [
    { id: `${id}-temp`, title: WEATHER_TYPES.Temperature, value: t + (Math.abs(h % 10) / 10), unit: WEATHER_UNITS.Temperature, icon: 'Thermometer', range: { min: t - 5, max: t + 8 } },
    { id: `${id}-humidity`, title: WEATHER_TYPES.Humidity, value: hm + (Math.abs((h >> 2) % 10) / 10), unit: WEATHER_UNITS.Humidity, icon: 'Droplets', range: { min: hm - 15, max: hm + 10 } },
    { id: `${id}-wind`, title: WEATHER_TYPES.WindSpeed, value: w + (Math.abs((h >> 6) % 10) / 10), unit: WEATHER_UNITS.WindSpeed, icon: 'Wind', range: { min: Math.max(0, w - 10), max: w + 15 } },
    { id: `${id}-pressure`, title: WEATHER_TYPES.Pressure, value: p + (Math.abs((h >> 10) % 10) / 10), unit: WEATHER_UNITS.Pressure, icon: 'Gauge', range: { min: p - 15, max: p + 15 } },
  ];
};

const formatAnnotationType = (type?: string): string => type ? type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Location';
const getAnnotationLabel = (a: AnnotationInput): string => a.label || a.text || 'Unknown Location';
const formatPosition = (p: { x: number; y: number; z: number } | [number, number, number]): string =>
  Array.isArray(p) ? p.map(c => c.toFixed(2)).join(', ') : `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;

// =============================================================================
// Sub-Components
// =============================================================================

const StatusBadge: FC<{ status: KPIStatus; compact?: boolean }> = ({ status, compact }) => {
  const c = STATUS_CONFIG[status], Icon = c.icon;
  if (compact) return <div className={`flex items-center justify-center w-5 h-5 rounded-full ${c.bgColor} ${c.borderColor} border`} aria-label={c.label}><Icon size={12} className={c.textColor} /></div>;
  return <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${c.bgColor} ${c.textColor} ${c.borderColor} border`}><span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`} />{c.label}</div>;
};

const HardwareItem: FC<{ unit: HardwareUnit; type: string }> = ({ unit, type }) => {
  const Icon = HARDWARE_ICONS[type] || Activity, c = STATUS_CONFIG[unit.status];
  return (
    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-6 h-6 rounded-md ${c.bgColor} ${c.borderColor} border`}><Icon size={12} className={c.textColor} /></div>
        <div className="flex flex-col"><span className="text-[11px] font-medium text-slate-200">{type}</span><span className="text-[9px] text-slate-500">{formatLastContact(unit.lastContact)}</span></div>
      </div>
      <StatusBadge status={unit.status} compact />
    </div>
  );
};

const TowerCard: FC<{ tower: TowerInstallation; isExpanded: boolean; onToggle: () => void }> = ({ tower, isExpanded, onToggle }) => {
  const [towerNumber, towerLocation = ''] = tower.name.split(' - ');
  return (
    <div className={`rounded-lg overflow-hidden bg-slate-800/30 border border-slate-700/40 ${isExpanded ? 'ring-1 ring-slate-600/50' : ''}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-700/20 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-inset" aria-expanded={isExpanded} type="button">
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: tower.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5"><RadioTower size={12} className="text-slate-400" /><span className="text-xs font-semibold text-slate-100 truncate">{towerNumber}</span></div>
          {towerLocation && <span className="text-[9px] text-slate-500 uppercase tracking-wide">{towerLocation}</span>}
        </div>
        <StatusBadge status={tower.status} />
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${isExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
        <div className="px-3 pb-2.5 pt-1 space-y-1 border-t border-slate-700/30">
          <HardwareItem unit={tower.lidar} type={HARDWARE_TYPES.LIDAR} />
          <HardwareItem unit={tower.thermalCamera} type={HARDWARE_TYPES.Thermal} />
          <HardwareItem unit={tower.camera} type={HARDWARE_TYPES.Camera} />
          <HardwareItem unit={tower.probes} type={HARDWARE_TYPES.Probes} />
        </div>
      </div>
    </div>
  );
};

const EventCard: FC<{ event: PastEvent; isSelected: boolean; onSelect: () => void }> = ({ event, isSelected, onSelect }) => {
  const c = EVENT_TYPE_CONFIG[event.eventType];
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-lg bg-slate-800/30 border transition-colors hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${isSelected ? 'ring-1 ring-sky-500/70 border-sky-500/50' : 'border-slate-700/40'}`} type="button">
      <div className="p-2.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-slate-100 truncate">{event.name}</h3>
            <div className="flex items-center gap-1 mt-0.5"><Calendar size={9} className="text-slate-500" /><span className="text-[9px] text-slate-500">{formatEventDate(event.date)}</span></div>
          </div>
          <div className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${c.bg} ${c.text}`}>{c.label}</div>
        </div>
        <div className="flex items-center gap-1"><MapPin size={10} className="text-slate-500" /><span className="text-[10px] text-slate-400">{event.location}</span></div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-700/30">
          <span className="text-[9px] text-slate-500">Similarity</span>
          <span className="text-[10px] font-semibold text-slate-300">{event.similarityPercentage}%</span>
        </div>
      </div>
    </button>
  );
};

const VehicleCard: FC<{ vehicle: TrackedVehicle; isSelected: boolean; onSelect: () => void }> = ({ vehicle, isSelected, onSelect }) => {
  const tc = VEHICLE_TYPE_CONFIG[vehicle.vehicleType], sc = VEHICLE_STATUS_CONFIG[vehicle.status], Icon = tc.icon;
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-lg bg-slate-800/30 border transition-colors hover:bg-slate-700/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50 ${isSelected ? 'ring-1 ring-sky-500/70 border-sky-500/50' : 'border-slate-700/40'}`} type="button">
      <div className="p-2.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon size={16} className={tc.text} />
            <div className="flex flex-col"><span className="text-xs font-semibold text-slate-100">{vehicle.name}</span>{vehicle.operator && <span className="text-[9px] text-slate-500">{vehicle.operator}</span>}</div>
          </div>
          <div className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${tc.bg} ${tc.text}`}>{tc.label}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${sc.bg} ${sc.text}`}><span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}</div>
          <span className="text-[9px] text-slate-500">{formatLastContact(vehicle.lastUpdate)}</span>
        </div>
        {vehicle.status === VehicleStatus.ACTIVE && vehicle.speed !== undefined && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-700/30"><span className="text-[9px] text-slate-500">Speed</span><span className="text-[10px] font-semibold text-slate-300">{vehicle.speed} km/h</span></div>
        )}
      </div>
    </button>
  );
};

// =============================================================================
// Tab Content Components
// =============================================================================

export const DataTabContent: FC<{ annotation: AnnotationInput | null }> = ({ annotation }) => {
  const weatherData = useMemo(() => annotation ? generateWeatherData(String(annotation.id)) : [], [annotation]);
  const formattedPosition = useMemo(() => annotation?.position ? formatPosition(annotation.position) : null, [annotation]);

  if (!annotation) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4">
        <MousePointer size={24} className="text-slate-500 mb-3" />
        <p className="text-sm text-slate-400 text-center mb-1">No Point Selected</p>
        <p className="text-xs text-slate-500 text-center">Click on a point in the terrain to see environmental data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-700/30">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={14} className="text-sky-400" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{formatAnnotationType(annotation.type)}</span>
        </div>
        <h3 className="text-sm font-semibold text-slate-100 mb-1">{getAnnotationLabel(annotation)}</h3>
        {formattedPosition && <p className="text-[10px] font-mono text-slate-500">Position: [{formattedPosition}]</p>}
      </div>
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Environmental Conditions</h4>
        <div className="grid grid-cols-2 gap-2">{weatherData.map(kpi => <WeatherKPI key={kpi.id} data={kpi} />)}</div>
      </div>
      <p className="text-[9px] text-slate-500 text-center pt-2">Environmental data simulated for demonstration.</p>
    </div>
  );
};

interface InstallationsTabContentProps {
  /** Selected annotation from the point cloud - used to auto-expand the corresponding tower */
  selectedAnnotation?: AnnotationInput | null;
}

export const InstallationsTabContent: FC<InstallationsTabContentProps> = ({ selectedAnnotation }) => {
  const [expandedTowers, setExpandedTowers] = useState<Set<string>>(new Set());
  const towers = useMemo(() => getTowerInstallations(), []);
  const statusCounts = useMemo(() => getTowerStatusCounts(), []);

  // Auto-expand tower when its annotation is selected in the point cloud
  useEffect(() => {
    if (selectedAnnotation?.type === 'installation' && selectedAnnotation.metadata?.towerId) {
      const towerId = selectedAnnotation.metadata.towerId as string;
      setExpandedTowers(prev => {
        if (prev.has(towerId)) return prev;
        const next = new Set(prev);
        next.add(towerId);
        return next;
      });
    }
  }, [selectedAnnotation]);

  const handleToggle = useCallback((id: string) => setExpandedTowers(prev => {
    const next = new Set(prev);
    if (prev.has(id)) { next.delete(id); } else { next.add(id); }
    return next;
  }), []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{towers.length} Towers Monitored</span>
        <div className="flex gap-2 text-[9px]"><span className="text-emerald-400">{statusCounts.operational} OK</span><span className="text-amber-400">{statusCounts.warning} Warn</span><span className="text-rose-400">{statusCounts.error} Err</span></div>
      </div>
      <div className="space-y-2">{towers.map(tower => <TowerCard key={tower.id} tower={tower} isExpanded={expandedTowers.has(tower.id)} onToggle={() => handleToggle(tower.id)} />)}</div>
      <p className="text-[9px] text-slate-600 text-center pt-2">Hardware status simulated for demonstration.</p>
    </div>
  );
};

export const EventsTabContent: FC<{ onEventSelect?: (event: PastEvent) => void }> = ({ onEventSelect }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const events = useMemo(() => getPastEvents(), []);
  const handleSelect = useCallback((event: PastEvent) => {
    const newId = selectedEventId === event.id ? null : event.id;
    setSelectedEventId(newId);
    if (newId && onEventSelect) onEventSelect(event);
  }, [selectedEventId, onEventSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-slate-500 uppercase tracking-wider">{events.length} Historical Event{events.length !== 1 ? 's' : ''}</span></div>
      <div className="space-y-2">{events.map(event => <EventCard key={event.id} event={event} isSelected={selectedEventId === event.id} onSelect={() => handleSelect(event)} />)}</div>
      <p className="text-[9px] text-slate-600 text-center pt-2">Events shown are for demonstration purposes.</p>
    </div>
  );
};

interface TrackingTabContentProps {
  /** Selected annotation from the point cloud - used to auto-select the corresponding vehicle */
  selectedAnnotation?: AnnotationInput | null;
  onVehicleSelect?: (vehicle: TrackedVehicle) => void;
}

export const TrackingTabContent: FC<TrackingTabContentProps> = ({ selectedAnnotation, onVehicleSelect }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const vehicles = useMemo(() => getTrackedVehicles(), []);
  const statusCounts = useMemo(() => getVehicleStatusCounts(), []);

  // Auto-select vehicle when its annotation is selected in the point cloud
  useEffect(() => {
    if (selectedAnnotation?.type === 'vehicle' && selectedAnnotation.metadata?.vehicleId) {
      const vehicleId = selectedAnnotation.metadata.vehicleId as string;
      setSelectedVehicleId(vehicleId);
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle && onVehicleSelect) {
        onVehicleSelect(vehicle);
      }
    }
  }, [selectedAnnotation, vehicles, onVehicleSelect]);

  const handleSelect = useCallback((vehicle: TrackedVehicle) => {
    const newId = selectedVehicleId === vehicle.id ? null : vehicle.id;
    setSelectedVehicleId(newId);
    if (newId && onVehicleSelect) onVehicleSelect(vehicle);
  }, [selectedVehicleId, onVehicleSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{vehicles.length} Vehicles</span>
        <div className="flex gap-2 text-[9px]"><span className="text-emerald-400">{statusCounts.active} Active</span><span className="text-amber-400">{statusCounts.idle} Idle</span></div>
      </div>
      <div className="space-y-2">{vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} isSelected={selectedVehicleId === vehicle.id} onSelect={() => handleSelect(vehicle)} />)}</div>
      <p className="text-[9px] text-slate-600 text-center pt-2">Vehicle positions are for demonstration purposes.</p>
    </div>
  );
};

export type { AnnotationInput };
