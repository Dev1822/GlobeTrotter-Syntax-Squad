// ---------------------------------------------------------
// ItineraryBuilder — Main page component
// ---------------------------------------------------------
// Orchestrates:
//   • List / Calendar view toggle
//   • @dnd-kit DndContext for drag-and-drop
//   • State management for moving activities between days
// ---------------------------------------------------------

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  List,
  CalendarDays,
  MapPin,
  Compass,
} from 'lucide-react';

import { TRIP_INFO, DAYS, INITIAL_ACTIVITIES } from '../data/sampleItinerary';
import DayDropZone from './DayDropZone';
import DragOverlayCard from './DragOverlayCard';

export default function ItineraryBuilder() {
  // ---- State ----
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [activeActivity, setActiveActivity] = useState(null);

  // ---- DnD Sensors ----
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, keyboardSensor);

  // ---- Group activities by dayId ----
  const activitiesByDay = useMemo(() => {
    const map = {};
    for (const day of DAYS) {
      map[day.id] = [];
    }
    for (const act of activities) {
      if (map[act.dayId]) {
        map[act.dayId].push(act);
      }
    }
    // Sort each day's activities by orderIndex
    for (const dayId of Object.keys(map)) {
      map[dayId].sort((a, b) => a.orderIndex - b.orderIndex);
    }
    return map;
  }, [activities]);

  // ---- Stats ----
  const totalCost = useMemo(
    () => activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0),
    [activities],
  );

  // ---- DnD Handlers ----
  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      const found = activities.find((a) => a.id === active.id);
      setActiveActivity(found || null);
    },
    [activities],
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveActivity(null);

      if (!over) return;

      const draggedId = active.id;
      const targetDayId = over.id; // The droppable id is the day id

      // Find the dragged activity
      const draggedActivity = activities.find((a) => a.id === draggedId);
      if (!draggedActivity) return;

      // If dropped on the same day, nothing to do (sortable within day would go here)
      if (draggedActivity.dayId === targetDayId) return;

      // Move activity to the new day
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id === draggedId) {
            // Append at the end of the target day
            const targetCount = prev.filter((a) => a.dayId === targetDayId).length;
            return { ...act, dayId: targetDayId, orderIndex: targetCount };
          }
          return act;
        }),
      );
    },
    [activities],
  );

  const handleDragCancel = useCallback(() => {
    setActiveActivity(null);
  }, []);

  return (
    <div className="app-layout">
      {/* ---- Header ---- */}
      <header className="app-header">
        <div className="app-header__brand">
          <Compass size={22} style={{ color: 'var(--gt-accent-light)' }} />
          <span className="app-header__logo">GlobeTrotter</span>
          <span className="app-header__badge">Beta</span>
        </div>

        <nav className="app-header__nav">
          {/* View Toggle */}
          <div className="view-toggle" id="view-toggle">
            <button
              className={`view-toggle__btn${viewMode === 'list' ? ' view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              id="view-toggle-list"
              aria-pressed={viewMode === 'list'}
            >
              <List className="view-toggle__icon" />
              List
            </button>
            <button
              className={`view-toggle__btn${viewMode === 'calendar' ? ' view-toggle__btn--active' : ''}`}
              onClick={() => setViewMode('calendar')}
              id="view-toggle-calendar"
              aria-pressed={viewMode === 'calendar'}
            >
              <CalendarDays className="view-toggle__icon" />
              Calendar
            </button>
          </div>
        </nav>
      </header>

      {/* ---- Main Content ---- */}
      <main className="itinerary">
        {/* Title bar */}
        <div className="itinerary__title-bar gt-animate-fade">
          <div>
            <h1 className="itinerary__title">{TRIP_INFO.title}</h1>
            <p className="itinerary__subtitle">
              <MapPin size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
              {TRIP_INFO.destination} · {TRIP_INFO.startDate} → {TRIP_INFO.endDate}
            </p>
          </div>
          <div className="itinerary__stats">
            <div className="itinerary__stat">
              <div className="itinerary__stat-value">{activities.length}</div>
              <div className="itinerary__stat-label">Activities</div>
            </div>
            <div className="itinerary__stat">
              <div className="itinerary__stat-value">{DAYS.length}</div>
              <div className="itinerary__stat-label">Days</div>
            </div>
            <div className="itinerary__stat">
              <div className="itinerary__stat-value">€{totalCost}</div>
              <div className="itinerary__stat-label">Est. Cost</div>
            </div>
          </div>
        </div>

        {/* DnD Context wraps both view modes */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {viewMode === 'list' ? (
            /* ---- List View ---- */
            <div className="list-view gt-stagger">
              {DAYS.map((day) => (
                <DayDropZone
                  key={day.id}
                  day={day}
                  activities={activitiesByDay[day.id]}
                  variant="list"
                />
              ))}
            </div>
          ) : (
            /* ---- Calendar View ---- */
            <div className="calendar-view gt-stagger">
              {DAYS.map((day) => (
                <DayDropZone
                  key={day.id}
                  day={day}
                  activities={activitiesByDay[day.id]}
                  variant="calendar"
                />
              ))}
            </div>
          )}

          {/* Drag Overlay — follows cursor */}
          <DragOverlay dropAnimation={{ duration: 200 }}>
            {activeActivity && <DragOverlayCard activity={activeActivity} />}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
