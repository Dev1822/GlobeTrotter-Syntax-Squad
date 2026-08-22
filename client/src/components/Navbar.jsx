import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Compass,
  MapPin,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const navClasses = isHome
    ? scrolled
      ? "bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#CBD5D6]/40 text-[#202525] py-3.5 shadow-xs"
      : "bg-transparent text-white py-5"
    : "bg-[#F7F4EE]/95 backdrop-blur-md border-b border-[#CBD5D6]/50 text-[#202525] py-3.5 shadow-xs";

  const linkColor =
    isHome && !scrolled
      ? "text-white/90 hover:text-white"
      : "text-[#54433A] hover:text-[#163A3D]";
  const activeLinkColor =
    isHome && !scrolled
      ? "text-white font-bold border-b-2 border-white"
      : "text-[#163A3D] font-bold border-b-2 border-[#163A3D]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight italic">
            GlobeTrotter
          </span>
          <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase opacity-70 border-l border-current pl-2 ml-2 hidden sm:inline-block">
            Discovery
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/explore"
            className={`text-xs font-semibold uppercase tracking-wider transition-colors pb-1 ${
              location.pathname.startsWith("/explore") ||
              location.pathname.startsWith("/destinations")
                ? activeLinkColor
                : linkColor
            }`}
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-journey"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors pb-1 ${
                  location.pathname.startsWith("/my-journey") ||
                  location.pathname.startsWith("/trips")
                    ? activeLinkColor
                    : linkColor
                }`}
              >
                My Journey
              </Link>
              <Link
                to="/tools"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors pb-1 ${
                  location.pathname === "/tools" ? activeLinkColor : linkColor
                }`}
              >
                Travel Tools
              </Link>
            </>
          ) : (
            <Link
              to="/how-it-works"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors pb-1 ${
                location.pathname === "/how-it-works"
                  ? activeLinkColor
                  : linkColor
              }`}
            >
              How It Works
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  isHome && !scrolled
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-[#CBD5D6] text-[#202525] hover:bg-[#F6F3F2]"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">
                  {user?.name || "Traveler"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#CBD5D6] rounded-md shadow-lg py-1.5 text-xs text-[#202525] z-50">
                  <div className="px-4 py-2 border-b border-[#EDE7DF]">
                    <p className="font-bold truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#899596] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[#54433A] hover:bg-[#F6F3F2] transition-colors"
                  >
                    Profile & Settings
                  </Link>
                  <Link
                    to="/my-journey"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[#54433A] hover:bg-[#F6F3F2] transition-colors"
                  >
                    My Journeys
                  </Link>
                  <Link
                    to="/tools"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-[#54433A] hover:bg-[#F6F3F2] transition-colors"
                  >
                    Travel Tools
                  </Link>
                  <div className="border-t border-[#EDE7DF] mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#BA1A1A] hover:bg-[#FFDAD6]/40 transition-colors flex items-center"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link
                to="/login"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isHome && !scrolled
                    ? "text-white/90 hover:text-white"
                    : "text-[#202525] hover:text-[#163A3D]"
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className={`px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-sm ${
                  isHome && !scrolled
                    ? "bg-[#FFFFFF] text-[#202525] hover:bg-[#F6F3F2]"
                    : "bg-[#163A3D] text-white hover:bg-[#204F53]"
                }`}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded focus:outline-none ${
              isHome && !scrolled ? "text-white" : "text-[#202525]"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F7F4EE] border-b border-[#CBD5D6] px-6 py-6 space-y-4 shadow-xl text-[#202525]">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold uppercase tracking-wider text-[#54433A] py-1"
          >
            Explore India
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-journey"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold uppercase tracking-wider text-[#54433A] py-1"
              >
                My Journey
              </Link>
              <Link
                to="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold uppercase tracking-wider text-[#54433A] py-1"
              >
                Travel Tools
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold uppercase tracking-wider text-[#54433A] py-1"
              >
                Profile & Settings
              </Link>
              <div className="pt-4 border-t border-[#E5E2E1]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider bg-[#FFDAD6] text-[#BA1A1A] rounded"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold uppercase tracking-wider text-[#54433A] py-1"
              >
                How It Works
              </Link>
              <div className="pt-4 border-t border-[#E5E2E1] flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider border border-[#CBD5D6] rounded text-[#202525]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider bg-[#163A3D] text-white rounded"
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
