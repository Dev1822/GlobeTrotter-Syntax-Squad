// ---------------------------------------------------------
// DayDropZone — Droppable container for a day's activities
// ---------------------------------------------------------

import { useDroppable } from '@dnd-kit/core';
import ActivityCard from './ActivityCard';

export default function DayDropZone({ day, activities, variant = 'list' }) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
    data: { day },
  });

  const isList = variant === 'list';

  if (isList) {
    return (
      <div className="day-group" id={`day-group-${day.id}`}>
        <div className="day-group__header">
          <div className="day-group__badge">{day.label.match(/Day (\d+)/)?.[1] || '#'}</div>
          <div className="day-group__info">
            <h3>{day.label}</h3>
            <span>{day.date} · {activities.length} activit{activities.length === 1 ? 'y' : 'ies'}</span>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className={`day-group__activities${isOver ? ' day-group__activities--over' : ''}`}
        >
          {activities.length > 0 ? (
            activities.map((act) => <ActivityCard key={act.id} activity={act} />)
          ) : (
            <div className="day-group__empty">Drop activities here</div>
          )}
        </div>
      </div>
    );
  }

  // Calendar variant
  return (
    <div className={`calendar-day${isOver ? ' calendar-day--over' : ''}`} id={`calendar-${day.id}`}>
      <div className="calendar-day__header">
        <div>
          <div className="calendar-day__date">{day.date}</div>
          <div className="calendar-day__label">{day.label}</div>
        </div>
        <div className="calendar-day__count">
          {activities.length} item{activities.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`calendar-day__body${isOver ? ' calendar-day__body--over' : ''}`}
      >
        {activities.length > 0 ? (
          activities.map((act) => <ActivityCard key={act.id} activity={act} compact />)
        ) : (
          <div className="calendar-day__empty">Drop here</div>
        )}
      </div>
    </div>
  );
}
