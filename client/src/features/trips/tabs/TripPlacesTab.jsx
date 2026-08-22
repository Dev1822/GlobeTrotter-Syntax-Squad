import React, { useState, useEffect } from "react";
import { placesApi } from "../../../services/api/placesApi";
import { tripsApi } from "../../../services/api/tripsApi";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import {
  Compass, MapPin, ExternalLink, Star, Banknote, Search, Filter, Plus
} from "lucide-react";

export const TripPlacesTab = ({ trip, onTripUpdated }) => {
  const stops = trip.stops || [];
  
  const [selectedStopId, setSelectedStopId] = useState(stops.length > 0 ? stops[0].id : "");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = [
    { id: "all", label: "All Sights" },
    { id: "SIGHTS", label: "Viewpoints & Mon." },
    { id: "HISTORICAL", label: "Historic" },
    { id: "BEACH_PARK", label: "Nature & Parks" },
    { id: "RESTAURANT", label: "Culinary" },
    { id: "SHOPPING", label: "Bazaars" },
  ];

  const fetchPlaces = async (cats = [], price = "") => {
    if (!selectedStopId) return;
    
    const stop = stops.find(s => s.id === parseInt(selectedStopId));
    if (!stop) return;

    setLoading(true);
    setError(null);
    try {
      const payload = { destination: stop.city };
      if (cats && cats.length > 0) payload.categories = cats;
      if (price) payload.maxPrice = price;

      const res = await placesApi.search(payload);
      if (res.data?.places) setPlaces(res.data.places);
    } catch (err) {
      console.warn("Places search error:", err);
      setError("Could not load live points of interest. Ensure OpenTripMap API key is set.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(selectedCategory === "all" ? [] : [selectedCategory], maxPrice);
  }, [selectedStopId, selectedCategory, maxPrice]);

  const handleAddToItinerary = async (place) => {
    try {
      const payload = {
        name: place.name,
        location: place.category,
        cost: place.price || 0,
        notes: `Added from Activity Search. ${place.bookingLinks?.googleMaps || ''}`
      };
      const res = await tripsApi.addActivity(selectedStopId, payload);
      alert('Added to itinerary!');
      // Update trip state if needed via onTripUpdated...
    } catch(err) {
      alert('Failed to add to itinerary');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E2E1]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#163A3D] block mb-1">
            Attractions & Landmark Discovery
          </span>
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-2xl font-bold text-[#202525]">Points of Interest in</h3>
            <select 
              value={selectedStopId} 
              onChange={e => setSelectedStopId(e.target.value)}
              className="bg-[#F6F3F2] border border-[#CBD5D6] rounded px-3 py-1 font-serif text-xl"
            >
              {stops.length === 0 && <option value="">No cities</option>}
              {stops.map(s => <option key={s.id} value={s.id}>{s.city}</option>)}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id ? "bg-[#163A3D] text-white" : "bg-[#FFFFFF] text-[#54433A] border border-[#CBD5D6] hover:border-[#202525]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#899596]">Max Price (₹):</span>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="border border-[#CBD5D6] rounded px-2 py-1 w-24" placeholder="Any" />
          </div>
        </div>
      </div>

      {/* Content */}
      {stops.length === 0 ? (
        <EmptyState icon={MapPin} title="No Cities Added" description="Add cities to your trip to discover activities." />
      ) : loading ? (
        <LoadingState message="Searching points of interest..." />
      ) : error ? (
        <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
          <p className="text-xs font-semibold text-[#BA1A1A]">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchPlaces()}>Retry Search</Button>
        </div>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div key={place.id || place.name} className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs hover:border-[#CBD5D6] hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="terracotta" size="xs">{place.category}</Badge>
                  {place.rank > 0 && (
                    <div className="flex items-center space-x-1 text-[11px] text-[#899596]">
                      <Star className="w-3 h-3 fill-[#F0BD8B] text-[#F0BD8B]" />
                      <span>Score {place.rank}</span>
                    </div>
                  )}
                </div>

                <h4 className="font-serif text-xl font-bold text-[#202525] leading-snug">{place.name}</h4>

                <div className="flex items-center text-xs text-[#54433A]">
                  <Banknote className="w-3.5 h-3.5 mr-1.5 text-[#163A3D]" />
                  <span>Est. Admission: <strong>{place.price > 0 ? `₹${place.price}` : "Free / Public"}</strong></span>
                </div>

                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {place.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#F6F3F2] rounded text-[10px] text-[#899596] uppercase font-mono">
                        #{tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDE7DF] flex items-center justify-between text-xs font-semibold">
                {place.bookingLinks && (
                  <a href={place.bookingLinks.googleMaps} target="_blank" rel="noopener noreferrer" className="text-[#163A3D] hover:underline inline-flex items-center">
                    <span>View Map</span><ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
                <button onClick={() => handleAddToItinerary(place)} className="bg-[#202525] text-white px-3 py-1.5 rounded flex items-center hover:bg-[#163A3D] transition-colors">
                  <Plus className="w-3 h-3 mr-1"/> Add to Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Compass} title="No Landmarks Found" description="We could not identify cataloged landmarks matching the criteria." actionLabel="Clear Filters" onAction={() => { setSelectedCategory("all"); setMaxPrice(""); }} />
      )}
    </div>
  );
};
export default TripPlacesTab;
