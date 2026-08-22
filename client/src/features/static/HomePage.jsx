import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Compass, Calendar, Users, Globe, Sparkles, Plane, Star } from "lucide-react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ─── ANIMATED COUNTER HOOK ─── */
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

/* ─── MAGNETIC BUTTON ─── */
const MagneticButton = ({ children, className = "", ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} style={{ x: springX, y: springY }} className="inline-block">
      <div className={className} {...props}>{children}</div>
    </motion.div>
  );
};

/* ─── WORD-BY-WORD TEXT REVEAL ─── */
const AnimatedHeading = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: delay + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.3em]"
          style={{ transformOrigin: "bottom", perspective: "800px" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

/* ─── SCROLL REVEAL ─── */
const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs = { up: { y: 60 }, down: { y: -60 }, left: { x: 60 }, right: { x: -60 } };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 0, y: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── DATA ─── */
const destinations = [
  {
    name: "Santorini", region: "Greece", span: "md:col-span-8", aspect: "aspect-[16/10] md:aspect-[4/3]",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Kyoto", region: "Japan", span: "md:col-span-4", aspect: "aspect-[4/5] md:aspect-auto md:h-full",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Swiss Alps", region: "Switzerland", span: "md:col-span-4", aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Marrakech", region: "Morocco", span: "md:col-span-4", aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Bali", region: "Indonesia", span: "md:col-span-4", aspect: "aspect-[4/5]",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85",
  },
];

const howItWorksSteps = [
  {
    num: "01", title: "Discover", 
    description: "Browse breathtaking destinations from every corner of the globe. Get inspired by curated travel stories, local tips, and stunning photography.",
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=85",
    icon: <Compass className="w-6 h-6" />,
  },
  {
    num: "02", title: "Plan",
    description: "Build a structured, elegant itinerary with your stops, durations, and activities. Set your budget and let the platform guide your spending.",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    num: "03", title: "Travel",
    description: "Access your full plan on the go. Use translation tools, weather forecasts, and itinerary tools so you can focus on experiencing every moment.",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
    icon: <Plane className="w-6 h-6" />,
  },
];

const marqueeItems = [
  "Paris", "Tokyo", "Bali", "New York", "Cape Town", "Santorini",
  "Dubai", "Iceland", "Machu Picchu", "Maldives", "Barcelona", "Sydney",
  "Kyoto", "Swiss Alps", "Marrakech", "Patagonia", "Venice", "Petra",
];

export const HomePage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 0.75]);

  const stat1 = useCounter(500, 2200);
  const stat2 = useCounter(120, 2000);
  const stat3 = useCounter(85, 1800);
  const stat4 = useCounter(4.9, 1500);

  const [activeStep, setActiveStep] = useState(0);

  // Auto-rotate steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F7F4EE] text-[#202525] overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO — Full-screen cinematic parallax
         ═══════════════════════════════════════════════════ */}
      <header ref={heroRef} className="relative w-full h-screen min-h-[700px] flex items-end pb-20 md:pb-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
        {/* Parallax BG */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=90"
            alt="Stunning tropical beach paradise with crystal clear water"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlays */}
        <motion.div className="absolute inset-0 bg-[#0a1628] z-[1]" style={{ opacity: overlayOpacity }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/90 via-[#0a0e17]/30 to-transparent z-[2]" />

        {/* Floating decorative orbs */}
        <motion.div
          className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full border border-[#E8895B]/20 hidden lg:block z-[3]"
          animate={{ y: [0, -25, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[35%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#E8895B]/50 hidden lg:block z-[3]"
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[5%] w-20 h-20 rounded-full border border-white/10 hidden lg:block z-[3]"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero Content */}
        <motion.div className="relative z-10 max-w-7xl mx-auto w-full text-white" style={{ opacity: heroOpacity }}>
          <div className="max-w-5xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="w-10 h-px bg-[#E8895B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8895B]">
                Explore The World
              </span>
            </motion.div>

            <AnimatedHeading
              text="The world is waiting for you."
              className="font-serif text-5xl sm:text-7xl lg:text-[6.5rem] font-bold leading-[1.02] tracking-tight"
              delay={0.4}
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed font-light"
            >
              Plan trips to any destination on Earth. Build stunning itineraries,
              manage budgets, and turn your travel dreams into unforgettable journeys.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <MagneticButton>
                <Link
                  to="/explore"
                  className="bg-[#E8895B] text-white px-10 py-5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] text-center hover:bg-[#d4774d] transition-all duration-300 shadow-[0_0_30px_rgba(232,137,91,0.3)] hover:shadow-[0_0_50px_rgba(232,137,91,0.5)] inline-flex items-center gap-3 group"
                >
                  Start Exploring
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/how-it-works"
                  className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-10 py-5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] text-center hover:bg-white/20 transition-all duration-300 inline-block"
                >
                  How It Works
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-0 right-0 hidden lg:flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40" style={{ writingMode: "vertical-lr" }}>
              Scroll
            </span>
            <motion.div
              className="w-px h-16 bg-white/20 origin-top"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════════════
          MARQUEE — Endless scrolling world destinations
         ═══════════════════════════════════════════════════ */}
      <div className="relative bg-[#163A3D] py-5 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/30 flex items-center gap-3 select-none">
              <Globe className="w-3.5 h-3.5 text-[#E8895B]/50" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STATS — Animated counters
         ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {[
            { ref: stat1.ref, count: stat1.count, suffix: "+", label: "Destinations", icon: <MapPin className="w-5 h-5" /> },
            { ref: stat2.ref, count: stat2.count, suffix: "+", label: "Countries", icon: <Globe className="w-5 h-5" /> },
            { ref: stat3.ref, count: stat3.count, suffix: "K+", label: "Happy Travelers", icon: <Users className="w-5 h-5" /> },
            { ref: stat4.ref, count: stat4.count, suffix: "★", label: "Average Rating", icon: <Star className="w-5 h-5" /> },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div ref={stat.ref} className="text-center group cursor-default">
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#163A3D]/8 text-[#163A3D] mb-5 border border-[#163A3D]/10"
                  whileHover={{ scale: 1.15, backgroundColor: "#163A3D", color: "#fff", borderColor: "#163A3D" }}
                  transition={{ duration: 0.4 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="font-serif text-5xl sm:text-6xl font-bold text-[#163A3D] tracking-tight">
                  {stat.count}{stat.suffix}
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#525A5A] mt-3 font-semibold">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DESTINATIONS — Editorial grid with world places
         ═══════════════════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto" id="explore">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <ScrollReveal>
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8895B] block mb-3 flex items-center gap-2">
                <span className="w-10 h-px bg-[#E8895B]" />
                Featured Destinations
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#202525] tracking-tight">
                Explore The World
              </h2>
              <p className="text-sm sm:text-lg text-[#525A5A] mt-3 leading-relaxed">
                From ancient temples to alpine peaks — find your next unforgettable destination.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="left">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#163A3D] hover:text-[#E8895B] group transition-colors duration-300"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7">
          {destinations.map((dest, i) => (
            <ScrollReveal key={dest.name} delay={i * 0.08} className={dest.span}>
              <Link to="/explore" className={`group relative ${dest.aspect} overflow-hidden rounded-xl bg-[#EDE7DF] block shadow-lg`}>
                <motion.img
                  src={dest.img}
                  alt={`${dest.name}, ${dest.region}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-[#163A3D]/0 group-hover:bg-[#163A3D]/20 transition-colors duration-500" />

                <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8895B] mb-1.5 flex items-center gap-1.5 opacity-90">
                    <MapPin className="w-3 h-3" />
                    {dest.region}
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    {dest.name}
                  </h3>
                </div>

                {/* Corner arrow */}
                <motion.div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/0 group-hover:bg-white/20 border border-white/0 group-hover:border-white/30 flex items-center justify-center transition-all duration-400 opacity-0 group-hover:opacity-100">
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY SECTION — 3-pillar dark section
         ═══════════════════════════════════════════════════ */}
      <section className="relative bg-[#0F1C1E] py-28 sm:py-36 px-4 sm:px-8 lg:px-16 overflow-hidden">
        {/* Decorative bg circles */}
        <motion.div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full border border-[#E8895B]/8"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full border border-white/3"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B] block mb-4">Why GlobeTrotter</span>
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
                Travel planning, <br className="hidden sm:block" />
                <span className="italic text-[#E8895B]">reimagined.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { num: "01", title: "Discover", desc: "Explore curated destinations from every continent. Get inspired with travel stories and high-quality visual guides from around the world." },
              { num: "02", title: "Organize", desc: "Build structured itineraries, manage transit and stay, set daily budgets, and keep everything organized in a single beautiful dashboard." },
              { num: "03", title: "Experience", desc: "Access your plans on-the-go. Language translation, live weather, travel tools — everything you need to immerse in the moment." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="group text-center space-y-5 p-10 rounded-2xl border border-white/5 cursor-default relative overflow-hidden"
                  whileHover={{ y: -8, borderColor: "rgba(232,137,91,0.3)" }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#E8895B]/0 to-[#E8895B]/0 group-hover:from-[#E8895B]/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />

                  <p className="font-serif text-7xl font-extralight text-white/10 group-hover:text-[#E8895B]/40 transition-colors duration-700 relative z-10">
                    {item.num}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#899596] max-w-sm mx-auto leading-relaxed relative z-10">
                    {item.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — Interactive stepped section
         ═══════════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto" id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8895B] block mb-4">
              Simple & Elegant
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#202525] mb-5 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-lg text-[#525A5A] leading-relaxed">
              Three simple steps from inspiration to your dream trip.
            </p>
          </ScrollReveal>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Steps */}
          <div className="w-full lg:w-1/2 space-y-3">
            {howItWorksSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <motion.div
                  className={`p-7 rounded-xl cursor-pointer transition-all duration-500 border-l-[3px] ${
                    activeStep === i
                      ? "bg-[#163A3D]/6 border-[#E8895B] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-[#EDE7DF]/60"
                  }`}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 6 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        activeStep === i ? "bg-[#E8895B] text-white shadow-lg shadow-[#E8895B]/25" : "bg-[#EDE7DF] text-[#525A5A]"
                      }`}
                      layout
                    >
                      {step.icon}
                    </motion.div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8895B]">{step.num}</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#202525]">{step.title}</h3>
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeStep === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-sm text-[#525A5A] leading-relaxed pl-16 overflow-hidden"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={howItWorksSteps[activeStep].img}
                    alt={howItWorksSteps[activeStep].title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

                {/* Progress indicators */}
                <div className="absolute bottom-6 left-6 flex gap-2.5 z-10">
                  {howItWorksSteps.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-1.5 rounded-full transition-all duration-600 cursor-pointer ${
                        activeStep === i ? "w-10 bg-[#E8895B]" : "w-4 bg-white/40 hover:bg-white/60"
                      }`}
                      layout
                    />
                  ))}
                </div>

                {/* Step label overlay */}
                <div className="absolute top-6 left-6 z-10">
                  <motion.span
                    key={activeStep}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-widest text-white border border-white/15"
                  >
                    Step {howItWorksSteps[activeStep].num}
                  </motion.span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          REVERSE MARQUEE
         ═══════════════════════════════════════════════════ */}
      <div className="relative bg-[#E8895B] py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap" style={{ animationDirection: "reverse", animationDuration: "22s" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-bold uppercase tracking-[0.3em] text-white/50 select-none">
              ✦ Plan Your Dream Trip ✦ Explore Every Continent ✦ Build Itineraries ✦ Track Budgets ✦ Share With Friends
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIAL — Social proof
         ═══════════════════════════════════════════════════ */}
      <section className="py-28 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#E8895B] text-[#E8895B]" />
              ))}
            </div>
            <motion.blockquote
              className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#202525] leading-[1.2] italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
            >
              "GlobeTrotter completely changed how I plan trips. The itineraries are beautiful, the budget tools are genius, and sharing plans with my travel crew is effortless."
            </motion.blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#163A3D] to-[#E8895B] flex items-center justify-center text-white font-serif font-bold text-lg shadow-lg">S</div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#202525]">Sarah Mitchell</p>
                <p className="text-xs text-[#525A5A]">Travel Blogger · 28 Countries Explored</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA — Dramatic final call to action
         ═══════════════════════════════════════════════════ */}
      <section className="relative py-36 md:py-48 px-4 sm:px-8 lg:px-16 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Beautiful golden sunset over tropical ocean beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17]/85 via-[#0a0e17]/50 to-[#0a0e17]/70" />
        </div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-white space-y-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Ready to see <br />
            <span className="italic text-[#E8895B]">the world?</span>
          </h2>
          <p className="text-base sm:text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-light">
            Pick a destination. Build your perfect itinerary.
            Start the adventure of a lifetime.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton>
              <Link
                to="/explore"
                className="inline-flex items-center gap-3 bg-[#E8895B] text-white px-12 py-5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#d4774d] transition-all duration-300 shadow-[0_0_40px_rgba(232,137,91,0.35)] group"
              >
                Start Planning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white px-12 py-5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/20 transition-all duration-300"
              >
                Create Free Account
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
