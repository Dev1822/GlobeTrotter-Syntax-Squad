import React from "react";
import { Link } from "react-router-dom";
import { Globe, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0F1C1E] text-[#F7F4EE] pt-20 pb-12 border-t border-[#1a2e31] relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#E8895B]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#1a2e31]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="GlobeTrotter Home"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E8895B] to-[#163A3D] text-white flex items-center justify-center font-serif text-xl font-bold shadow-lg shadow-[#E8895B]/10">
                G
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F7F4EE]">
                GlobeTrotter
              </span>
            </Link>
            <p className="text-sm text-[#899596] font-sans leading-relaxed max-w-sm">
              Your intelligent travel companion for exploring the world.
              Discover, plan, and experience destinations across every
              continent with elegance and ease.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#525A5A]">
              <Globe className="w-3.5 h-3.5 text-[#E8895B]/60" />
              <span>Connecting travelers worldwide.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8895B]">
              Discover
            </h3>
            <ul className="space-y-2.5 text-sm text-[#899596]">
              <li>
                <Link
                  to="/explore"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  All Destinations
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  How It Works
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  Travel Tools
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Account / Journeys */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8895B]">
              Journeys
            </h3>
            <ul className="space-y-2.5 text-sm text-[#899596]">
              <li>
                <Link
                  to="/my-journey"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  My Journeys
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  Account Settings
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  Help & Info
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Note */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8895B]">
              Our Philosophy
            </h3>
            <p className="text-sm text-[#899596] leading-relaxed">
              "The world is a book and those who do not travel read only one
              page." We believe every journey should be as inspiring to plan as
              it is to experience.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#525A5A] space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} GlobeTrotter. All rights reserved.
          </div>
          <div className="flex items-center space-x-8">
            <Link
              to="/how-it-works"
              className="hover:text-[#F7F4EE] transition-colors duration-300"
            >
              Philosophy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
