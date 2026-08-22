import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { getDestinationDetails } from "../features/destinations/destinationData";

export const TripCard = ({ trip }) => {
  const {
    id,
    _id,
    name,
    destination,
    startDate,
    endDate,
    budget,
    status = "planned",
    images = [],
    description,
    stops = [],
  } = trip;

  const tripId = id || _id;
  const destinationCity =
    destination ||
    (stops && stops[0]?.city) ||
    (name && !name.toLowerCase().includes("new trip") ? name : null) ||
    "Udaipur";

  const destDetails = getDestinationDetails(destinationCity);
  const fallbackImage = destDetails.heroImage;
  const imageSrc =
    images && images.length > 0
      ? images[0]
      : (trip?.destinationImageUrl || fallbackImage);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days difference
  const calculateDaysRemaining = () => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return "Starts today";
    return "Ongoing / Completed";
  };

  const daysText = calculateDaysRemaining();

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#CBD5D6]">
      {/* Cover Image */}
      <div className="relative h-56 w-full overflow-hidden bg-[#EDE7DF]">
        <img
          src={imageSrc}
          alt={destination}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#202525]/70 via-transparent to-transparent opacity-80" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={status} size="xs" className="capitalize">
            {status}
          </Badge>
        </div>

        {/* Days badge */}
        {daysText && status === "planned" && (
          <div className="absolute top-4 right-4 bg-[#202525]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#F7F4EE]">
            {daysText}
          </div>
        )}

        {/* Destination text overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center text-xs font-semibold text-[#E8895B] uppercase tracking-wider mb-0.5">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Journey to</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight">
            {destination}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-3">
          <div className="flex items-center text-xs text-[#54433A]">
            <Calendar className="w-4 h-4 mr-2 text-[#899596] shrink-0" />
            <span>
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>

          {description && (
            <p className="text-xs text-[#54433A] line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {budget > 0 && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EDE7DF]">
              <span className="text-[#899596]">Planned Budget</span>
              <span className="font-semibold text-[#202525]">
                ₹{budget.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#EDE7DF] flex items-center justify-end">
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center text-xs font-semibold text-[#163A3D] group-hover:text-[#204F53] transition-colors"
          >
            <span>Open Journey Overview</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
