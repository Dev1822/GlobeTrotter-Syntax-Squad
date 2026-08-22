import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { destinationsApi } from "../../services/api/destinationsApi";
import { useAuth } from "../../context/AuthContext";
import CreateTripModal from "../trips/CreateTripModal";
import { getDestinationDetails } from "./destinationData";
import { ChevronRight, ArrowRight, MapPin } from "lucide-react";

export const DestinationDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      let apiData = null;
      try {
        const res = await destinationsApi.getById(id);
        apiData = res.data?.data || res.data;
      } catch (err) {
        console.warn("Destination fetch notice (using dynamic fallback):", err);
      } finally {
        const fullDetails = getDestinationDetails(id, apiData);
        setDestinationData(fullDetails);
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handlePlanClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/destinations/${id}` } });
    } else {
      setIsPlanModalOpen(true);
    }
  };

  const name = destinationData?.name || "Destination";
  const state = destinationData?.state || destinationData?.zone || "Worldwide";
  const tagline = destinationData?.tagline || `Discover the unique charm and heritage of ${name}.`;
  const heroImg = destinationData?.heroImage || destinationData?.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";
  const storyImg = destinationData?.storyImage || destinationData?.imageUrl || heroImg;
  
  const lat = destinationData?.lat || 20.0;
  const lon = destinationData?.lon || 0.0;
  const bbox = `${lon - 0.06}%2C${lat - 0.06}%2C${lon + 0.06}%2C${lat + 0.06}`;
  const marker = `${lat}%2C${lon}`;

  const landmarks = destinationData?.landmarks || [];

  return (
    <div className="bg-[#F7F4EE] text-[#202525] min-h-screen">
      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative h-[88vh] min-h-[620px] w-full flex items-end pb-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center w-full h-full transform scale-100 transition-transform duration-1000"
            style={{ backgroundImage: `url("${heroImg}")` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 scrim-bottom" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto text-white space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#E8895B] opacity-90">
            <Link to="/explore" className="hover:underline">
              Explore
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Destinations</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{name}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-sm">
            {name}
          </h1>
          <p className="text-base sm:text-xl text-[#F7F4EE]/90 max-w-2xl font-normal leading-relaxed">
            {tagline}
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={handlePlanClick}
              className="bg-[#F7F4EE] text-[#202525] px-8 py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#EDE7DF] hover:-translate-y-0.5 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. DISCOVER / STORY SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-7 image-container overflow-hidden rounded relative h-[420px] sm:h-[500px] shadow-sm bg-[#EDE7DF]">
            <img
              src={storyImg}
              alt={`Scenery of ${name}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#163A3D] block">
              HERITAGE & DISCOVERY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525]">
              Discover {name}
            </h2>
            <div className="text-sm sm:text-base text-[#54433A] leading-relaxed space-y-4">
              {destinationData?.description?.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              )) || (
                <p>{name} is a captivating destination offering a unique blend of heritage, scenic views, and unforgettable cultural experiences.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INFO STRIP ── */}
      <section className="border-y border-[#CBD5D6]/40 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#CBD5D6]/30">
            <div className="px-6 first:pt-0 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#899596] uppercase tracking-widest mb-2">
                Best Season
              </span>
              <span className="font-serif text-xl font-bold text-[#202525]">
                {destinationData?.bestSeason || "Year-round"}
              </span>
            </div>

            <div className="px-6 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#899596] uppercase tracking-widest mb-2">
                Region
              </span>
              <span className="font-serif text-xl font-bold text-[#202525]">
                {state}
              </span>
            </div>

            <div className="px-6 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#899596] uppercase tracking-widest mb-2">
                Ideal For
              </span>
              <span className="font-serif text-xl font-bold text-[#202525]">
                {destinationData?.idealFor || "Sightseeing, Culture, Discovery"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. KEY LANDMARKS ASYMMETRIC GRID ── */}
      {landmarks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32 space-y-12">
          <div className="flex justify-between items-end pb-6 border-b border-[#CBD5D6]/40">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#163A3D] block mb-1">
                CURATED ATTRACTIONS
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525]">
                Key Landmarks in {name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {landmarks.map((lm, idx) => {
              const spans = [
                "md:col-span-8 h-[480px]",
                "md:col-span-4 h-[480px]",
                "md:col-span-6 h-[380px]",
                "md:col-span-6 h-[380px]"
              ];
              const spanClass = spans[idx % spans.length];

              return (
                <div
                  key={lm.title || idx}
                  className={`relative ${spanClass} group cursor-pointer overflow-hidden rounded bg-[#202525] image-zoom shadow-sm`}
                >
                  <img
                    src={lm.image}
                    alt={lm.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 scrim-bottom opacity-75 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-8 text-white space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                      {lm.title}
                    </h3>
                    <p className="text-sm text-[#F7F4EE]/90 max-w-md leading-relaxed">
                      {lm.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 5. INTERACTIVE DESTINATION MAP ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-24 sm:pb-32 space-y-8">
        <div className="flex justify-between items-end pb-6 border-b border-[#CBD5D6]/40">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#163A3D] block mb-1">
              GEOGRAPHY & MAP
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525]">
              Interactive Map of {name}
            </h2>
          </div>
        </div>
        <div className="w-full h-[500px] rounded overflow-hidden shadow-sm border border-[#CBD5D6]/40 bg-[#EDE7DF]">
          <iframe
            title={`Map of ${name}`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* ── 6. FINAL CTA SECTION ── */}
      <section className="bg-[#F6F3F2] py-24 sm:py-32 px-4 sm:px-8 border-t border-[#CBD5D6]/30 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#202525]">
            Ready to make {name} your next journey?
          </h2>
          <p className="text-base text-[#54433A] leading-relaxed">
            Discover {name} with an intentional, curated itinerary designed for you.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePlanClick}
              className="bg-[#202525] text-white px-10 py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#163A3D] transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── STICKY "PLAN A TRIP" CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-md border-t border-[#CBD5D6] p-4 sm:p-5 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="hidden sm:block">
            <h3 className="font-serif text-xl font-bold text-[#202525]">
              {name}
            </h3>
            <p className="text-xs text-[#54433A] uppercase tracking-wider font-semibold">
              {state}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePlanClick}
            className="w-full sm:w-auto bg-[#163A3D] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#204F53] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Plan a Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan Journey Modal */}
      {isPlanModalOpen && (
        <CreateTripModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          initialDestination={name}
          onTripCreated={(newTrip) => {
            setIsPlanModalOpen(false);
            const newId = newTrip?.id || newTrip?._id;
            navigate(`/trips/${newId}`);
          }}
        />
      )}
    </div>
  );
};

export default DestinationDetailPage;
