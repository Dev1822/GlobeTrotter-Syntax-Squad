// ---------------------------------------------------------
// DragOverlayCard — The "ghost" card shown while dragging
// ---------------------------------------------------------
// Rendered by DndContext's <DragOverlay>. It's a visual-only
// clone of ActivityCard without drag hooks.
// ---------------------------------------------------------

import { Clock, MapPin } from 'lucide-react';

export default function DragOverlayCard({ activity }) {
  if (!activity) return null;

  return (
    <div className="dnd-overlay-card">
      <div className="activity-card__icon">{activity.icon}</div>

      <div className="activity-card__body">
        <div className="activity-card__name">{activity.name}</div>
        <div className="activity-card__meta">
          {activity.startTime && (
            <span className="activity-card__time">
              <Clock size={12} />
              {activity.startTime}
              {activity.endTime && ` – ${activity.endTime}`}
            </span>
          )}
          {activity.tripStopName && (
            <span className="activity-card__stop">
              <MapPin size={12} />
              {activity.tripStopName}
            </span>
          )}
        </div>
      </div>

      {activity.estimatedCost > 0 && (
        <div className="activity-card__cost">€{activity.estimatedCost}</div>
      )}
    </div>
  );
}
