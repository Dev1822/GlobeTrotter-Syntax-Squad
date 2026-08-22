import React, { useState } from 'react';
import { tripsApi } from '../../../services/api/tripsApi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '../../../components/Button';
import FormField from '../../../components/FormField';
import Modal from '../../../components/Modal';
import { GripVertical, Plus, Calendar, MapPin } from 'lucide-react';

const SortableStopItem = ({ stop }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 border border-[#E5E2E1] rounded mb-3 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <button {...attributes} {...listeners} className="cursor-grab text-[#899596]">
          <GripVertical className="w-5 h-5" />
        </button>
        <div>
          <h4 className="font-semibold text-[#202525] text-lg flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-[#163A3D]" /> {stop.city}
          </h4>
          <p className="text-xs text-[#54433A] flex items-center mt-1">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {stop.startDate ? new Date(stop.startDate).toLocaleDateString() : 'TBD'} - 
            {stop.endDate ? new Date(stop.endDate).toLocaleDateString() : 'TBD'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TripStopsTab = ({ trip, onTripUpdated }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const stops = trip.stops || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = stops.findIndex(s => s.id === active.id);
      const newIndex = stops.findIndex(s => s.id === over.id);
      const newStops = arrayMove(stops, oldIndex, newIndex).map((s, idx) => ({ ...s, orderIndex: idx }));
      
      // Optimistically update
      onTripUpdated({ ...trip, stops: newStops });
      
      try {
        await tripsApi.reorderStops(trip.id, newStops);
      } catch (err) {
        console.error("Failed to save reorder", err);
      }
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await tripsApi.addStop(trip.id, { city, startDate, endDate });
      onTripUpdated({ ...trip, stops: [...stops, res.data] });
      setIsAddOpen(false);
      setCity(''); setStartDate(''); setEndDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E2E1]">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#202525]">Cities & Stops</h3>
          <p className="text-xs text-[#54433A]">Manage the cities in your multi-city itinerary. Drag to reorder.</p>
        </div>
        <Button variant="terracotta" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add City Stop
        </Button>
      </div>

      {stops.length === 0 ? (
        <div className="text-center py-12 text-[#54433A]">No cities added yet.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-6">
              {stops.map(stop => (
                <SortableStopItem key={stop.id} stop={stop} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add City Stop">
          <form onSubmit={handleAddStop} className="space-y-4">
            <FormField label="City Name" value={city} onChange={e => setCity(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <FormField label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" variant="terracotta" loading={loading}>Add Stop</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default TripStopsTab;
