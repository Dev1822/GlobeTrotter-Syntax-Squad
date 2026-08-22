import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { destinationsApi } from "../../services/api/destinationsApi";
import { tripsApi } from "../../services/api/tripsApi";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import LoadingState from "../../components/LoadingState";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  X,
} from "lucide-react";

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filter state
  const activeZone = searchParams.get("zone") || "all";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [addingToTrip, setAddingToTrip] = useState(false);

  const handleAddClick = async (e, dest) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDest(dest);
    setIsAddModalOpen(true);
    try {
      const res = await tripsApi.getAll();
      setUserTrips(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleConfirmAdd = async () => {
    if(!selectedTripId) return;
    setAddingToTrip(true);
    try {
      await tripsApi.addStop(selectedTripId, { city: selectedDest.name });
      setIsAddModalOpen(false);
      alert('City added to trip!');
    } catch(err) {
      alert('Failed to add city to trip');
    } finally {
      setAddingToTrip(false);
    }
  };

  const gridSectionRef = useRef(null);
  const ITEMS_PER_PAGE = 8;

  const zones = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "North India", label: "North India" },
    { id: "South India", label: "South India" },
    { id: "Europe", label: "Europe" },
    { id: "Asia", label: "Asia" },
    { id: "Americas", label: "Americas" },
  ];

  // Keep local search input synchronized if URL param changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (searchQuery) params.search = searchQuery;
      if (activeZone !== "all" && activeZone !== "popular") {
        params.zone = activeZone;
      }

      const res = await destinationsApi.getAll(params);
      const resData = res.data;

      if (resData && Array.isArray(resData.destinations)) {
        setDestinations(resData.destinations);
        setTotalPages(resData.totalPages || 1);
        setTotalCount(resData.total || 0);
      } else if (Array.isArray(resData)) {
        // Fallback filtering if backend returns plain array
        const filtered = resData.filter((dest) => {
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchName = dest.name?.toLowerCase().includes(q);
            const matchCity = dest.city?.toLowerCase().includes(q);
            const matchState = dest.state?.toLowerCase().includes(q);
            if (!matchName && !matchCity && !matchState) return false;
          }
          if (activeZone !== "all" && activeZone !== "popular") {
            if (
              dest.zone &&
              !dest.zone.toLowerCase().includes(activeZone.toLowerCase())
            ) {
              return false;
            }
          }
          return true;
        });

        const calculatedTotalPages =
          Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
        setTotalPages(calculatedTotalPages);
        setTotalCount(filtered.length);

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        setDestinations(filtered.slice(start, start + ITEMS_PER_PAGE));
      } else {
        setDestinations([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn("Failed to fetch destinations:", err);
      setError("Unable to load the destinations catalogue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [activeZone, searchQuery, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    if (localSearch.trim()) nextParams.search = localSearch.trim();
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handleZoneSelect = (zoneId) => {
    const nextParams = {};
    if (zoneId !== "all") nextParams.zone = zoneId;
    if (searchQuery) nextParams.search = searchQuery;
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    if (searchQuery) nextParams.search = searchQuery;
    nextParams.page = String(newPage);
    setSearchParams(nextParams);

    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Curated fallback if DB is completely empty and no search/filters applied
  const isFiltered = Boolean(
    searchQuery.trim() || (activeZone !== "all" && activeZone !== "popular"),
  );

  const defaultCuratedDestinations = [
    // North India
    { _id: "jaipur", name: "Jaipur", state: "Rajasthan", zone: "North India", imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80" },
    { _id: "manali", name: "Manali", state: "Himachal Pradesh", zone: "North India", imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80" },
    { _id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", zone: "North India", imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80" },
    { _id: "agra", name: "Agra", state: "Uttar Pradesh", zone: "North India", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80" },
    { _id: "leh-ladakh", name: "Leh Ladakh", state: "Ladakh", zone: "North India", imageUrl: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80" },

    // South India
    { _id: "kochi", name: "Kochi", state: "Kerala", zone: "South India", imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80" },
    { _id: "munnar", name: "Munnar", state: "Kerala", zone: "South India", imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80" },
    { _id: "ooty", name: "Ooty", state: "Tamil Nadu", zone: "South India", imageUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80" },
    { _id: "hampi", name: "Hampi", state: "Karnataka", zone: "South India", imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80" },
    { _id: "pondicherry", name: "Pondicherry", state: "Puducherry", zone: "South India", imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80" },

    // Europe
    { _id: "paris", name: "Paris", state: "France", zone: "Europe", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80" },
    { _id: "rome", name: "Rome", state: "Italy", zone: "Europe", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80" },
    { _id: "barcelona", name: "Barcelona", state: "Spain", zone: "Europe", imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80" },
    { _id: "amsterdam", name: "Amsterdam", state: "Netherlands", zone: "Europe", imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80" },
    { _id: "london", name: "London", state: "United Kingdom", zone: "Europe", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80" },

    // Asia
    { _id: "tokyo", name: "Tokyo", state: "Japan", zone: "Asia", imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80" },
    { _id: "bali", name: "Bali", state: "Indonesia", zone: "Asia", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80" },
    { _id: "bangkok", name: "Bangkok", state: "Thailand", zone: "Asia", imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80" },
    { _id: "singapore", name: "Singapore", state: "Singapore", zone: "Asia", imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80" },
    { _id: "kyoto", name: "Kyoto", state: "Japan", zone: "Asia", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" },

    // Americas
    { _id: "new-york", name: "New York", state: "USA", zone: "Americas", imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80" },
    { _id: "rio-de-janeiro", name: "Rio de Janeiro", state: "Brazil", zone: "Americas", imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80" },
    { _id: "cancun", name: "Cancún", state: "Mexico", zone: "Americas", imageUrl: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1200&q=80" },
    { _id: "san-francisco", name: "San Francisco", state: "USA", zone: "Americas", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80" },
    { _id: "buenos-aires", name: "Buenos Aires", state: "Argentina", zone: "Americas", imageUrl: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80" },
  ];

  return (
    <div className="bg-[#F7F4EE] text-[#202525] min-h-screen pb-32">
      {/* ── 1. HERO HEADER ── */}
      <header className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pt-32 pb-14 sm:pt-44 sm:pb-20 flex flex-col items-center text-center">
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-[#202525]">
          Explore Destinations
        </h1>
        <p className="text-base sm:text-lg text-[#54433A] max-w-xl mb-12">
          Discover places worth remembering, from historic cities to peaceful global escapes.
        </p>

        {/* Search Bar with Submit & Clear Button */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl relative"
        >
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#899596]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search destinations, cities or states..."
            className="w-full bg-transparent border-b border-[#CBD5D6] focus:border-[#163A3D] px-12 py-4 text-base sm:text-lg text-[#202525] placeholder-[#899596]/60 focus:outline-hidden transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#899596] hover:text-[#202525] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </header>

      {/* ── 2. CATEGORY & ZONE FILTER TABS ── */}
      <section className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pb-16 overflow-x-auto hide-scrollbar">
        <div className="flex gap-8 whitespace-nowrap border-b border-[#CBD5D6]/30 pb-4">
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => handleZoneSelect(z.id)}
              className={`text-xs font-semibold uppercase tracking-widest pb-4 -mb-[18px] transition-colors cursor-pointer ${
                activeZone === z.id
                  ? "text-[#163A3D] border-b-2 border-[#163A3D]"
                  : "text-[#54433A] hover:text-[#163A3D]"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURED DESTINATION HERO (Only when not actively searching) ── */}
      {!searchQuery &&
        currentPage === 1 &&
        (activeZone === "all" ||
          activeZone === "popular" ||
          activeZone === "North India") && (
          <section className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pb-24">
            <Link
              to="/destinations/udaipur"
              className="relative w-full h-[520px] sm:h-[720px] overflow-hidden rounded block bg-[#202525] group image-zoom cursor-pointer shadow-sm"
            >
              <div
                className="w-full h-full bg-cover bg-center absolute inset-0 transform transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxWl-xnZHodPN0zPTcw8fKTdasw9qPGifOaAwnFmL5RWafIdVS4ZeMfklhfQaYYA9YLh39uhYHkczYdkEbmZez0M3EzYunQbERz4uum7mnEHiPamor4vhcsWr_RoqiVHYYWtNxdK_iizMbMsC9436FC0KoRSmENslHNKcQbQxk8Dx_LNHtQLEiQMWQgqpvcwo7gXFPtW0_x0ijuTJQSFNHT5dEaaOwVIZvqYpBI-cyOiB_G6ydekRcsw")`,
                }}
              />
              <div className="absolute inset-0 scrim-bottom" />
              <div className="absolute bottom-0 left-0 p-8 sm:p-16 w-full md:w-2/3 text-white space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#E8895B] block mb-2">
                  Featured Destination
                </span>
                <h2 className="font-serif text-4xl sm:text-6xl font-bold">
                  Udaipur, Rajasthan
                </h2>
                <p className="text-sm sm:text-base text-[#F7F4EE]/90 max-w-xl leading-relaxed">
                  Lakes, palaces and timeless streets make Udaipur one of
                  India’s most atmospheric escapes.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white border-b border-white pb-1 group-hover:opacity-80 transition-opacity">
                    <span>Explore Udaipur</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

      {/* ── 4. ASYMMETRICAL EDITORIAL DESTINATIONS GRID ── */}
      <section
        ref={gridSectionRef}
        className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#CBD5D6]/30 pb-4">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#202525]">
              {searchQuery ? `Search Results` : `Discover more`}
            </h3>
            <p className="text-xs text-[#54433A] mt-1">
              {searchQuery
                ? `Showing destinations matching "${searchQuery}"`
                : `Curated escapes and royal sanctuaries across the subcontinent.`}
            </p>
          </div>

          {totalCount > 0 && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#899596]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
              {totalCount} places
            </span>
          )}
        </div>

        {loading ? (
          <LoadingState message="Unfurling destination catalogue..." />
        ) : error ? (
          <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
            <p className="text-xs font-semibold text-[#BA1A1A]">{error}</p>
          </div>
        ) : destinations.length === 0 && isFiltered ? (
          /* ── 5. EMPTY SEARCH / FILTER STATE ── */
          <div className="py-16 px-4 bg-white/70 border border-[#CBD5D6]/40 rounded text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#163A3D]">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#202525]">
              No destinations found
            </h4>
            <p className="text-xs sm:text-sm text-[#54433A] max-w-md mx-auto leading-relaxed">
              We couldn't find any places matching{" "}
              {searchQuery ? (
                <strong className="text-[#202525]">"{searchQuery}"</strong>
              ) : (
                `the selected ${activeZone} filter`
              )}
              . Try checking for spelling or exploring all zones.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-[#163A3D] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded hover:bg-[#204F53] transition-colors cursor-pointer"
              >
                Clear Search & Show All
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              {(destinations.length > 0
                ? destinations
                : defaultCuratedDestinations.filter(d => activeZone === "all" || activeZone === "popular" || d.zone === activeZone)
              ).map((dest, idx) => {
                const isLarge = idx % 5 === 0;
                const spanClass = isLarge
                  ? "md:col-span-8 h-[480px]"
                  : "md:col-span-4 h-[480px]";
                const cover =
                  dest.imageUrl ||
                  (dest.images && dest.images[0]) ||
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80";

                return (
                  <Link
                    key={dest._id || dest.name}
                    to={`/destinations/${dest.slug || dest._id}`}
                    className={`relative ${spanClass} overflow-hidden rounded bg-[#202525] group image-zoom cursor-pointer shadow-sm`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center absolute inset-0 transform transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url("${cover}")` }}
                    />
                    <div className="absolute inset-0 scrim-bottom" />
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h4 className="font-serif text-3xl sm:text-4xl font-bold">
                        {dest.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 mb-3">
                        <span className="text-xs text-[#E8895B] font-semibold uppercase tracking-widest">
                          {dest.state || dest.zone || "India"}
                        </span>
                        <span className="bg-white/20 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {dest.costIndex || "$$"}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddClick(e, dest)} 
                        className="bg-white/20 hover:bg-white text-white hover:text-[#202525] text-xs font-semibold px-4 py-2 rounded backdrop-blur-sm transition-all"
                      >
                        + Add to Trip
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── 6. PAGINATION CONTROLS ── */}
            {totalPages > 1 && (
              <div className="pt-12 border-t border-[#CBD5D6]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-xs text-[#54433A] font-medium">
                  Page <strong className="text-[#202525]">{currentPage}</strong>{" "}
                  of <strong className="text-[#202525]">{totalPages}</strong>
                </p>

                <div className="flex items-center space-x-2">
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2.5 rounded border border-[#CBD5D6] text-xs font-semibold uppercase tracking-wider text-[#202525] hover:bg-[#F6F3F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        if (
                          totalPages > 7 &&
                          pageNum !== 1 &&
                          pageNum !== totalPages &&
                          Math.abs(pageNum - currentPage) > 2
                        ) {
                          if (pageNum === 2 || pageNum === totalPages - 1) {
                            return (
                              <span
                                key={pageNum}
                                className="text-xs text-[#899596] px-1"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded text-xs font-semibold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-[#163A3D] text-white shadow-xs font-bold"
                                : "text-[#54433A] hover:bg-[#F6F3F2] hover:text-[#202525]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* Next Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2.5 rounded border border-[#CBD5D6] text-xs font-semibold uppercase tracking-wider text-[#202525] hover:bg-[#F6F3F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── ADD TO TRIP MODAL ── */}
      {isAddModalOpen && selectedDest && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={`Add ${selectedDest.name} to Trip`}
        >
          <div className="space-y-4">
            <label className="text-xs font-semibold text-[#54433A]">Select an ongoing trip:</label>
            {userTrips.length === 0 ? (
              <p className="text-xs text-[#899596]">You have no ongoing trips.</p>
            ) : (
              <select
                className="w-full bg-white border border-[#CBD5D6] rounded px-4 py-2 text-sm"
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
              >
                <option value="">-- Choose Trip --</option>
                {userTrips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button variant="terracotta" onClick={handleConfirmAdd} disabled={!selectedTripId} loading={addingToTrip}>
                Add City
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ExplorePage;
