// ---------------------------------------------------------
// ActivityCard — Draggable activity item
// ---------------------------------------------------------

import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Clock, MapPin } from 'lucide-react';

export default function ActivityCard({ activity, compact = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: activity.id,
    data: { activity },
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`activity-card${isDragging ? ' activity-card--dragging' : ''}`}
      {...attributes}
      {...listeners}
      id={`activity-${activity.id}`}
    >
      {/* Drag handle */}
      <div className="activity-card__drag-handle">
        <GripVertical size={16} />
      </div>

      {/* Emoji icon */}
      <div className="activity-card__icon">{activity.icon}</div>

      {/* Body */}
      <div className="activity-card__body">
        <div className="activity-card__name" title={activity.name}>
          {activity.name}
        </div>
        <div className="activity-card__meta">
          {activity.startTime && (
            <span className="activity-card__time">
              <Clock size={12} />
              {activity.startTime}
              {activity.endTime && ` – ${activity.endTime}`}
            </span>
          )}
          {activity.tripStopName && !compact && (
            <span className="activity-card__stop">
              <MapPin size={12} />
              {activity.tripStopName}
            </span>
          )}
        </div>
      </div>

      {/* Cost */}
      {activity.estimatedCost > 0 && (
        <div className="activity-card__cost">€{activity.estimatedCost}</div>
      )}
    </div>
  );
}
