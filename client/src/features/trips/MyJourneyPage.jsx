import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { tripsApi } from "../../services/api/tripsApi";
import CreateTripModal from "./CreateTripModal";
import LoadingState from "../../components/LoadingState";
import { ArrowRight, Plus, MapPin, Calendar, Compass } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

import { getDestinationDetails } from "../destinations/destinationData";

/* ─── SCROLL REVEAL WRAPPER ─── */
const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MyJourneyPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getAll({ page: 1, limit: 50 });
      if (res.data?.data) {
        setTrips(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to retrieve your journey records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const filteredTrips = trips.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  const upcomingTrip =
    trips.find((t) => t.status === "planned" || t.status === "ongoing") ||
    trips[0];

  const pastTrips = trips.filter((t) => t._id !== upcomingTrip?._id);

  // Stitch Default Placeholder Past Journeys for Rich Experience if user has fewer trips
  const defaultPastJourneys = [
    {
      _id: "demo-jaipur",
      destination: "Jaipur",
      dateLabel: "Oct 2025 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCop9_SUGmoIs8xdYJa5NPHUgJmnmEwh8ERGIz_QNasOM6UHaTVahV3K1wOz6L2u3SROQd2UPS_fZc2TPnz--AyMWSxPG3woCr7fU38exkAkmaezXjYNk2YBb0bxobTclTFcMeHWXppUx_SQlXzc2IEessiDKzephcx0bQRv1USw3ih39tNNKcSoCLdcqwM7m2tea60cEEaxzQhlWEjJQbkRuWRMlgXFeapJ_dr19cRKIzOMkYHwZ_XHQ",
      spanClass: "md:col-span-7 aspect-square",
    },
    {
      _id: "demo-goa",
      destination: "Goa",
      dateLabel: "Dec 2024 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDyGZCCvghXSWdIxVaevzBGf8KlCybaCeZfNyAlyQDmMLFWFc4BR0IzirEpCDMGgyhr-mi1CQw5SXk-B07gyA9ITXW6Wouj5fe4yapvsVfKw2srcmH3uVeX0HGG_gLA8IkvMNocPTtngjdg2sAqyqfaQvAiAxgudYICwI0Uh7jwHol91QtIaxYvC2gtVqdvaiVThfqTVFOvTFxoiRmCBJTfE4SdW-GG-J941oAsZrJWMOzxqh7B5WbE-w",
      spanClass: "md:col-span-5 aspect-[3/4] md:aspect-auto md:h-full md:mt-24",
    },
    {
      _id: "demo-kerala",
      destination: "Kerala",
      dateLabel: "Jan 2024 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYC5DfuwRa0_Zyydy072tLcyVWtKY34LduwzawRsxmJwk7nbj4XD8va8ofH3xJVIv5HyIz3TuWQzsLcA0ajTW56DiQT8LRoIPYn-YJwugjVaPMR7o7JQG5yyX6GB--fUA3LZYzSYSm-QiLE6VlcVV0RmxIaojqvwUi7BiB4TQ42pfW1zrLO2JvPgextoQ-N2E-vto2gY1lesebHAPBCnN54afLIH9SZwwQw45hq3GEYyrgt9r0rfb0YQ",
      spanClass: "md:col-span-8 aspect-video md:aspect-[16/9] md:-mt-12 z-10",
    },
    {
      _id: "demo-varanasi",
      destination: "Varanasi",
      dateLabel: "Nov 2023 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPHB5fKZtlks1MDfVe3TfRskbijreFZnQX-6FjcBJKjQ_QDwTohmzREJAUEx6_R-4wC24p_1CNC8FShNQF8ocTvRIK2DirmZJxb1pqc4opO0xp-jAUk3MCbfSAbE397n0FO5Gn5iy0ePCu71HfUWwK19pkJxJBwrMnuvE6LF5MkNQ_ayeybUJImVnYiOfHZpcqny0X0x0CGJ9OrEi7y7lZDoy4juOS-8SYYUZ47El0RwjIuagTvDJ8WQ",
      spanClass: "md:col-span-4 aspect-square md:aspect-[3/4] md:mt-24",
    },
  ];

  return (
    <div className="bg-[#F7F4EE] text-[#202525] min-h-screen pt-32 pb-32 overflow-x-hidden relative">
      
      {/* Decorative grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 grain-overlay z-0 mix-blend-overlay" />

      {/* ── 1. HEADER SECTION ── */}
      <header className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-14 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#CBD5D6]/30 pb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8895B] block mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              PERSONAL EXPEDITIONS
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#163A3D] tracking-tight">
              My Journey
            </h1>
            <p className="text-sm sm:text-lg text-[#54433A] mt-2 max-w-xl">
              Your stories, your places, curated with elegance.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start md:self-auto bg-[#163A3D] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#204F53] transition-colors duration-300 shadow-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Plan a New Trip</span>
          </motion.button>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-8 mt-8 overflow-x-auto pb-3 hide-scrollbar border-b border-[#CBD5D6]/20 relative"
        >
          {[
            { id: "all", label: "All" },
            { id: "planned", label: "Upcoming" },
            { id: "ongoing", label: "Ongoing" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`text-xs font-semibold uppercase tracking-widest pb-3 -mb-[14px] transition-colors cursor-pointer relative ${
                filterStatus === tab.id
                  ? "text-[#163A3D]"
                  : "text-[#54433A] hover:text-[#163A3D]"
              }`}
            >
              {tab.label}
              {filterStatus === tab.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#163A3D]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </header>

      {/* ── 2. FEATURED UPCOMING TRIP ── */}
      <div className="relative z-10">
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mb-24">
          <LoadingState message="Unpacking your journey archives..." />
        </div>
      ) : upcomingTrip ? (
        <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-32">
          <ScrollReveal delay={0.1}>
            <div
              onClick={() => navigate(`/trips/${upcomingTrip.id || upcomingTrip._id}`)}
              className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded overflow-hidden group cursor-pointer shadow-2xl bg-[#202525] card-tilt"
            >
              <motion.img
                alt={upcomingTrip.destination}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                src={
                  upcomingTrip.images && upcomingTrip.images.length > 0
                    ? upcomingTrip.images[0]
                    : (upcomingTrip.destinationImageUrl || getDestinationDetails(upcomingTrip.destination || upcomingTrip.name).heroImage)
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              
              <div className="absolute top-6 left-6 flex gap-3 z-10">
                 <motion.span 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-semibold uppercase tracking-widest text-white border border-white/30 shadow-lg"
                 >
                    {upcomingTrip.status || "Upcoming"}
                 </motion.span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-white z-10">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-3 opacity-90 text-xs font-semibold uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-[#E8895B]" />
                      {upcomingTrip.startDate
                        ? `${new Date(upcomingTrip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — ${new Date(upcomingTrip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Dates not set"}
                    </div>
                    <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
                      {upcomingTrip.destination}
                    </h2>
                    <p className="text-sm sm:text-lg opacity-80 mt-2 font-light flex items-center gap-2">
                       <MapPin className="w-4 h-4"/> India
                    </p>
                  </motion.div>
                </div>
                
                <motion.div
                   whileHover={{ x: 10 }}
                   className="w-14 h-14 rounded-full bg-[#E8895B] flex items-center justify-center text-white cursor-pointer shadow-[0_0_20px_rgba(232,137,91,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(232,137,91,0.6)]"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      ) : (
        <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-32">
          <ScrollReveal>
            <div className="text-center py-24 bg-white/40 backdrop-blur-sm border border-[#CBD5D6]/30 rounded-xl shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 stripe-pattern opacity-5" />
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#163A3D] mb-4 relative z-10">
                The Canvas is Empty
              </h3>
              <p className="text-sm sm:text-base text-[#54433A] mb-8 max-w-md mx-auto relative z-10">
                Embark on your next expedition across India. Every great story begins with a single step.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#163A3D] text-white px-8 py-4 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#204F53] transition-colors inline-flex items-center gap-2 shadow-lg relative z-10"
              >
                <Plus className="w-4 h-4" />
                <span>Chart Your First Journey</span>
              </motion.button>
            </div>
          </ScrollReveal>
        </section>
      )}
      </div>

      {/* ── 3. PAST JOURNEYS ASYMMETRICAL GRID ── */}
      <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12 border-b border-[#CBD5D6]/30 pb-4">
            <h3 className="font-serif text-3xl sm:text-5xl font-bold text-[#163A3D]">
              Chronicles
            </h3>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#899596]">
              Past Expeditions
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {pastTrips.length > 0
            ? pastTrips.map((trip, idx) => {
                const isLarge = idx % 3 === 0;
                const span = isLarge
                  ? "md:col-span-7 aspect-square md:aspect-[4/3]"
                  : "md:col-span-5 aspect-[4/3] md:aspect-[3/4] mt-0 md:mt-16";
                return (
                  <ScrollReveal key={trip.id || trip._id} delay={(idx % 3) * 0.15} className={span}>
                    <div
                      onClick={() => navigate(`/trips/${trip.id || trip._id}`)}
                      className={`relative w-full h-full rounded overflow-hidden group cursor-pointer bg-[#202525] shadow-lg hover-lift`}
                    >
                      <motion.img
                        alt={trip.destination}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        src={
                          trip.images && trip.images.length > 0
                            ? trip.images[0]
                            : (trip.destinationImageUrl || getDestinationDetails(trip.destination || trip.name).heroImage)
                        }
                      />
                      <div className="absolute inset-0 scrim-bottom opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80 mb-2 text-[#E8895B]">
                          {trip.status || "Completed"}
                        </p>
                        <h4 className="font-serif text-3xl sm:text-4xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          {trip.destination}
                        </h4>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })
            : defaultPastJourneys.map((item, idx) => (
                <ScrollReveal key={item._id} delay={(idx % 3) * 0.1} className={`${item.spanClass}`}>
                  <div
                    onClick={() => setIsCreateModalOpen(true)}
                    className={`relative w-full h-full rounded overflow-hidden group cursor-pointer bg-[#202525] shadow-lg hover-lift`}
                  >
                    <motion.img
                      alt={item.destination}
                      className="absolute inset-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      src={item.imageUrl}
                    />
                    <div className="absolute inset-0 scrim-bottom opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10 overflow-hidden">
                      <motion.p 
                        className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80 mb-2 text-[#E8895B]"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.dateLabel}
                      </motion.p>
                      <motion.h4 
                        className="font-serif text-3xl sm:text-5xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                      >
                        {item.destination}
                      </motion.h4>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
        </div>
      </section>

      {/* Create Journey Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateTripModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onTripCreated={handleTripCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyJourneyPage;
