import React, { useState } from 'react';
import { tripsApi } from '../../../services/api/tripsApi';
import Button from '../../../components/Button';
import FormField from '../../../components/FormField';
import Modal from '../../../components/Modal';
import { Calendar as CalendarIcon, List, Clock, MapPin, Plus, DollarSign, GripVertical, Trash2 } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

export const TripItineraryTab = ({ trip, onTripUpdated }) => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [form, setForm] = useState({ name: '', date: '', startTime: '', endTime: '', cost: '', location: '', notes: '' });

  const stops = trip.stops || [];
  
  // Aggregate all activities with their parent stop info
  const allActivities = stops.flatMap(stop => 
    (stop.activities || []).map(act => ({ ...act, stopCity: stop.city, stopId: stop.id }))
  );

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await tripsApi.addActivity(selectedStopId, form);
      // Update local state
      const updatedStops = stops.map(stop => {
        if (stop.id === parseInt(selectedStopId)) {
          return { ...stop, activities: [...(stop.activities || []), res.data] };
        }
        return stop;
      });
      onTripUpdated({ ...trip, stops: updatedStops });
      setIsAddOpen(false);
      setForm({ name: '', date: '', startTime: '', endTime: '', cost: '', location: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const renderListView = () => (
    <div className="space-y-8 mt-6">
      {stops.map(stop => (
        <div key={stop.id} className="border border-[#E5E2E1] rounded bg-white overflow-hidden shadow-sm">
          <div className="bg-[#F6F3F2] p-4 border-b border-[#E5E2E1] flex items-center justify-between">
            <h4 className="font-serif text-xl font-bold text-[#202525]">{stop.city}</h4>
            <span className="text-xs text-[#54433A]">
              {stop.startDate ? format(parseISO(stop.startDate), 'MMM d') : ''} - {stop.endDate ? format(parseISO(stop.endDate), 'MMM d') : ''}
            </span>
          </div>
          <div className="p-4 space-y-4">
            {stop.activities && stop.activities.length > 0 ? (
              stop.activities.map(act => (
                <div key={act.id} className="flex border-b border-[#E5E2E1] pb-4 last:border-0 last:pb-0">
                  <div className="w-24 shrink-0 text-xs text-[#899596] space-y-1">
                    {act.startTime && <div className="font-semibold text-[#202525]"><Clock className="w-3 h-3 inline mr-1"/>{act.startTime}</div>}
                    {act.date && <div>{format(parseISO(act.date), 'MMM d')}</div>}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-[#202525]">{act.name}</h5>
                    {act.location && <p className="text-xs text-[#54433A]"><MapPin className="w-3 h-3 inline mr-1"/>{act.location}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {act.cost > 0 && <span className="text-sm font-semibold text-[#163A3D]">${act.cost}</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#899596]">No activities planned for {stop.city}.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => {
    // Group all activities by Date
    const grouped = {};
    allActivities.forEach(act => {
      const dateKey = act.date ? act.date.split('T')[0] : 'Unscheduled';
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(act);
    });

    const sortedDates = Object.keys(grouped).sort();

    return (
      <div className="space-y-6 mt-6">
        {sortedDates.map(date => (
          <div key={date} className="relative pl-6 sm:pl-8 border-l-2 border-[#CBD5D6]">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#163A3D] border-4 border-[#F7F4EE]" />
            <h4 className="font-serif text-lg font-bold text-[#202525] mb-4">
              {date === 'Unscheduled' ? 'Unscheduled' : format(parseISO(date), 'EEEE, MMMM do, yyyy')}
            </h4>
            <div className="space-y-3">
              {grouped[date].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map(act => (
                <div key={act.id} className="bg-white p-4 border border-[#E5E2E1] rounded shadow-xs hover:border-[#CBD5D6] transition-colors flex gap-4">
                  <div className="text-xs font-semibold text-[#899596] w-16 shrink-0 pt-1">
                    {act.startTime || '--:--'}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-[#202525] text-base">{act.name}</h5>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#54433A]">
                      <span className="inline-flex items-center text-[#163A3D] font-medium bg-[#F6F3F2] px-2 py-0.5 rounded">
                        {act.stopCity}
                      </span>
                      {act.location && <span className="inline-flex items-center"><MapPin className="w-3 h-3 mr-1"/>{act.location}</span>}
                      {act.cost > 0 && <span className="inline-flex items-center text-[#2E4632]"><DollarSign className="w-3 h-3 mr-0.5"/>{act.cost}</span>}
                    </div>
                    {act.notes && <p className="text-xs text-[#899596] mt-2 bg-[#F6F3F2] p-2 rounded">{act.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2E1]">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#202525]">Advanced Itinerary</h3>
          <p className="text-xs text-[#54433A] mt-1">Manage activities across all your destinations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#F6F3F2] p-1 rounded-full border border-[#E5E2E1]">
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-[#202525]' : 'text-[#899596]'}`}>
              <CalendarIcon className="w-4 h-4 inline mr-1" /> Calendar
            </button>
            <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#202525]' : 'text-[#899596]'}`}>
              <List className="w-4 h-4 inline mr-1" /> List
            </button>
          </div>
          <Button variant="terracotta" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Activity
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule Activity">
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#54433A]">Select City Stop</label>
              <select className="w-full bg-[#FFFFFF] border border-[#CBD5D6] rounded px-4 py-2 text-sm" value={selectedStopId} onChange={e => setSelectedStopId(e.target.value)} required>
                <option value="">-- Choose Stop --</option>
                {stops.map(s => <option key={s.id} value={s.id}>{s.city}</option>)}
              </select>
            </div>
            <FormField label="Activity Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              <FormField label="Cost" type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Time" type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
              <FormField label="End Time" type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
            </div>
            <FormField label="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            <FormField label="Notes" as="textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" variant="terracotta">Save</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default TripItineraryTab;
