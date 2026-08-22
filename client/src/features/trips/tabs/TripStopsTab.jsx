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

import { getErrorMessage } from '../../../services/api/client';

const SortableStopItem = ({ stop }) => {
  const stopId = stop.id || stop._id;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stopId });
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
    if (active && over && active.id !== over.id) {
      const oldIndex = stops.findIndex(s => (s.id || s._id) === active.id);
      const newIndex = stops.findIndex(s => (s.id || s._id) === over.id);
      const newStops = arrayMove(stops, oldIndex, newIndex).map((s, idx) => ({ ...s, orderIndex: idx }));
      
      // Optimistically update
      onTripUpdated({ ...trip, stops: newStops });
      
      try {
        const tripId = trip.id || trip._id;
        await tripsApi.reorderStops(tripId, newStops);
      } catch (err) {
        console.error("Failed to save reorder", err);
      }
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tripId = trip.id || trip._id;
      const res = await tripsApi.addStop(tripId, {
        city,
        startDate: startDate && startDate.trim() ? startDate : undefined,
        endDate: endDate && endDate.trim() ? endDate : undefined
      });
      onTripUpdated({ ...trip, stops: [...stops, res.data] });
      setIsAddOpen(false);
      setCity(''); setStartDate(''); setEndDate('');
    } catch (err) {
      console.error("Add stop failed:", err);
      alert(getErrorMessage(err, "Failed to add stop to journey."));
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
          <SortableContext items={stops.map(s => s.id || s._id)} strategy={verticalListSortingStrategy}>
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
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#899596]">
                City Name *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full bg-[#FFFFFF] border border-[#CBD5D6] rounded px-3 py-2.5 text-sm font-medium text-[#202525] focus:outline-none focus:border-[#163A3D]"
              >
                <option value="">-- Select a Real City --</option>
                <optgroup label="India (North)">
                  <option value="Jaipur">Jaipur, Rajasthan</option>
                  <option value="Udaipur">Udaipur, Rajasthan</option>
                  <option value="Varanasi">Varanasi, Uttar Pradesh</option>
                  <option value="Agra">Agra, Uttar Pradesh</option>
                  <option value="Manali">Manali, Himachal Pradesh</option>
                  <option value="Shimla">Shimla, Himachal Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Amritsar">Amritsar, Punjab</option>
                  <option value="Rishikesh">Rishikesh, Uttarakhand</option>
                  <option value="Leh-Ladakh">Leh-Ladakh, Ladakh</option>
                </optgroup>
                <optgroup label="India (South, West & East)">
                  <option value="Goa">Goa</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Kolkata">Kolkata, West Bengal</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                  <option value="Darjeeling">Darjeeling, West Bengal</option>
                  <option value="Mysore">Mysore, Karnataka</option>
                  <option value="Gandhinagar">Gandhinagar, Gujarat</option>
                  <option value="Ahmedabad">Ahmedabad, Gujarat</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Paris">Paris, France</option>
                  <option value="Rome">Rome, Italy</option>
                  <option value="London">London, United Kingdom</option>
                  <option value="Barcelona">Barcelona, Spain</option>
                  <option value="Amsterdam">Amsterdam, Netherlands</option>
                  <option value="Venice">Venice, Italy</option>
                  <option value="Vienna">Vienna, Austria</option>
                  <option value="Prague">Prague, Czech Republic</option>
                  <option value="Zurich">Zurich, Switzerland</option>
                </optgroup>
                <optgroup label="Asia & Middle East">
                  <option value="Tokyo">Tokyo, Japan</option>
                  <option value="Kyoto">Kyoto, Japan</option>
                  <option value="Bangkok">Bangkok, Thailand</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Bali">Bali, Indonesia</option>
                  <option value="Istanbul">Istanbul, Turkey</option>
                  <option value="Seoul">Seoul, South Korea</option>
                </optgroup>
                <optgroup label="Americas & Oceania">
                  <option value="New York">New York, USA</option>
                  <option value="Los Angeles">Los Angeles, USA</option>
                  <option value="San Francisco">San Francisco, USA</option>
                  <option value="Toronto">Toronto, Canada</option>
                  <option value="Sydney">Sydney, Australia</option>
                </optgroup>
              </select>
            </div>
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
