import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  MapPin,
  DollarSign,
  Luggage,
  ArrowRight,
  Compass,
  Plane,
  Globe,
} from "lucide-react";

/* ─── SCROLL REVEAL COMPONENT ─── */
const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const dirs = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, ...dirs[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const HowItWorksPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="bg-[#F7F4EE] text-[#202525] overflow-x-hidden min-h-screen grain-overlay relative">
      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section ref={heroRef} className="relative w-full h-[88vh] min-h-[580px] flex items-end pb-20 md:pb-28 overflow-hidden">
        {/* Parallax BG */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img
            className="w-full h-full object-cover object-center"
            alt="Breathtaking mountain landscape with serene lake"
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C1E]/95 via-[#0F1C1E]/40 to-transparent z-[1]" />
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full border border-white/10 hidden lg:block z-[2]"
          animate={{ y: [0, -20, 0], rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full text-white" style={{ opacity: heroOpacity }}>
          <div className="max-w-3xl space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-px bg-[#E8895B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B]">
                THE PACKGO PHILOSOPHY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              From inspiration <br />to your next journey.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-xl text-[#F7F4EE]/90 max-w-2xl font-light leading-relaxed"
            >
              GlobeTrotter helps you discover destinations across India, turn ideas
              into trips, and keep everything organized in one place.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── 2. STORY JOURNEY STEPS (Smooth Scroll Entrance Animations) ── */}
      <section className="py-28 sm:py-36 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative">
        {/* Timeline connector line behind items (desktop only) */}
        <div className="absolute left-1/2 top-48 bottom-48 w-px bg-gradient-to-b from-[#163A3D]/20 via-[#E8895B]/30 to-[#163A3D]/20 hidden lg:block -translate-x-1/2 z-0" />

        {/* Step 01 - Discover */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 sm:mb-44 relative z-10">
          <ScrollReveal className="w-full lg:w-1/2" direction="right">
            <div className="bg-white/40 backdrop-blur-xs p-8 sm:p-12 rounded-2xl border border-[#163A3D]/10 hover:border-[#163A3D]/20 hover:bg-white/60 transition-all duration-500 shadow-md hover-lift">
              <div className="w-14 h-14 rounded-xl bg-[#163A3D] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#163A3D]/20">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B] mb-2 block">
                01 / DISCOVER
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525] mb-5 tracking-tight">
                Find a place worth exploring.
              </h2>
              <p className="text-base text-[#54433A] leading-relaxed font-light">
                Explore Indian destinations, hidden heritage sites, and cultural
                experiences to find somewhere that deeply inspires you. Use curated collections
                and interactive filters to tailor your search.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal className="w-full lg:w-1/2" direction="left" delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F3F2] rounded-2xl border border-[#899596]/15 p-3 sm:p-4 shadow-xl card-tilt group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2 }}
                className="w-full h-full object-cover rounded-xl"
                alt="Vintage map and destination postcards"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ruMeI0D_x73il0rhDR-wzERUYuF14X0tT-QanJLBLs9aYXhQOpU-mFVVvVlldds5eftTdtFvfoMgeQWX892QlGZrzMx5W_UgpRRykwIzw_dXY2P39Vo110N40HzmbdhNgptT-Dp0AEW6sUFEmQGptOKbFyQlIyeljZ6cZVUcOpmv_JKSvT8a8wQzULTSVMRvYOothELX7lH5rCDMuHF4W2Ui0yX8c-6Za_au0llJ4wxf-0GHq_2hdg"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Step 02 - Plan */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20 mb-32 sm:mb-44 relative z-10">
          <ScrollReveal className="w-full lg:w-1/2" direction="left">
            <div className="bg-white/40 backdrop-blur-xs p-8 sm:p-12 rounded-2xl border border-[#E8895B]/10 hover:border-[#E8895B]/20 hover:bg-white/60 transition-all duration-500 shadow-md hover-lift">
              <div className="w-14 h-14 rounded-xl bg-[#E8895B] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#E8895B]/20">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#163A3D] mb-2 block">
                02 / PLAN
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525] mb-5 tracking-tight">
                Turn inspiration into a trip.
              </h2>
              <p className="text-base text-[#54433A] leading-relaxed font-light">
                Choose your destination, dates, and budget, then create your
                personalized journey with structured day-by-day itineraries. Keep track of 
                accommodations, travel nodes, and local events dynamically.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="w-full lg:w-1/2" direction="right" delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F3F2] rounded-2xl border border-[#899596]/15 p-3 sm:p-4 shadow-xl card-tilt group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2 }}
                className="w-full h-full object-cover rounded-xl"
                alt="Travel notebook, sunglasses, and polaroids"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9_tKWMp8k1smy5oz8qIiTctpXuam-riWLdbof_LRy0z_gmHvmTSr4z0tGFiqG6W5kpuh01fZHrEX6newUuhHn_7FEjOFr7nhwWcNZDEVspGJFtkdZKRujFgDDm2vF-ttQiW6Wsq_NR6rXSRfwgfxT2xlOwf1_GD_3Tml0iodwCTpy8pmc5yLIMCNbKkOroHGQodXnO0XJMQ3-M7xafOp-oFxYs_1uOFrXgXBrVJ6VFr0qa-4nGGKIEA"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Step 03 - Travel / Manage */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          <ScrollReveal className="w-full lg:w-1/2" direction="right">
            <div className="bg-white/40 backdrop-blur-xs p-8 sm:p-12 rounded-2xl border border-[#163A3D]/10 hover:border-[#163A3D]/20 hover:bg-white/60 transition-all duration-500 shadow-md hover-lift">
              <div className="w-14 h-14 rounded-xl bg-[#163A3D] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#163A3D]/20">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B] mb-2 block">
                03 / TRAVEL
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#202525] mb-5 tracking-tight">
                Keep your journey together.
              </h2>
              <p className="text-base text-[#54433A] leading-relaxed font-light">
                Organize your itinerary, saved places, real-time expenses, packing
                lists, live weather forecasts, and trip notes from one intuitive, responsive
                interface built to work perfectly on any screen.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="w-full lg:w-1/2" direction="left" delay={0.15}>
            <div className="relative aspect-[16/10] overflow-hidden bg-[#F6F3F2] rounded-2xl border border-[#899596]/15 p-3 sm:p-4 shadow-xl card-tilt group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2 }}
                className="w-full h-full object-cover rounded-xl"
                alt="Digital travel planner tablet with morning tea"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJgxw4D2KyJcgXLRuXuMK4zDQnAlXpIWTLz2r4CNkHTdzqfzW55vl1QAi7HJMS3ChvKL6nFUwe0IAXoGrd-LqMnxzk-l4q0VS0HY0hhdvaFoRSdkOD_fhXu_37RQaeO22mGX7gY9HqHNVEzmUCFRHhDNGGF4-Vf57-CdGJcD-Jqw1v5d3V3Rtp2P8IqLkrR8WHmECqNJKOFIkb-zVYQy-DHrl7Ovo1KnMgvCE8w7sGQNM0ypPuk1hSnw"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. ECOSYSTEM SECTION (4 Badges with staggered hover effect) ── */}
      <section className="bg-[#0F1C1E] py-28 sm:py-36 text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,137,91,0.06),transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center mb-20 relative z-10">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B] block mb-4">
              ALL-IN-ONE PLATFORM
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
              Everything for your journey, in one place.
            </h2>
            <p className="text-base sm:text-lg text-[#899596] max-w-2xl mx-auto font-light">
              A suite of thoughtful tools designed to keep your focus on the
              experience, not the logistics.
            </p>
          </ScrollReveal>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {[
            { icon: <Calendar className="w-6 h-6 text-[#E8895B]" />, title: "Itinerary" },
            { icon: <MapPin className="w-6 h-6 text-[#E8895B]" />, title: "Places" },
            { icon: <DollarSign className="w-6 h-6 text-[#E8895B]" />, title: "Budget & Expenses" },
            { icon: <Luggage className="w-6 h-6 text-[#E8895B]" />, title: "Packing Checklist" },
          ].map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8, borderColor: "rgba(232,137,91,0.3)", backgroundColor: "rgba(255,255,255,0.04)" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center p-8 bg-white/3 rounded-2xl border border-white/5 transition-all duration-300 group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#E8895B]/15 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#F7F4EE]/90">
                  {item.title}
                </span>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 4. CTA SECTION (Dramatic Final Call to Action) ── */}
      <section className="relative py-32 sm:py-40 px-4 sm:px-8 text-center overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Beautiful golden sunset over tropical ocean beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C1E]/95 via-[#0F1C1E]/60 to-[#0F1C1E]/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto text-white space-y-8"
        >
          <h2 className="font-serif text-3xl sm:text-6xl font-bold tracking-tight">
            Ready to start exploring?
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Find a destination and begin planning your next journey across India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 pt-4">
            <Link
              to="/explore"
              className="px-10 py-5 bg-[#E8895B] text-white rounded-lg text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#d4774d] transition-all duration-300 shadow-[0_0_30px_rgba(232,137,91,0.3)] hover:shadow-[0_0_50px_rgba(232,137,91,0.5)] inline-flex items-center justify-center gap-2 group"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HowItWorksPage;

