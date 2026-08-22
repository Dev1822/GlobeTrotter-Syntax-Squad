import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Badge from "./Badge";

export const ExperienceCard = ({
  title,
  category,
  location,
  duration,
  imageUrl,
  description,
  destinationId,
}) => {
  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#CBD5D6]">
      <div className="relative h-64 w-full overflow-hidden bg-[#EDE7DF]">
        <img
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
          }
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#202525]/70 via-transparent to-transparent opacity-80" />

        <div className="absolute top-4 left-4">
          <Badge variant="terracotta" size="xs">
            {category || "Cultural Experience"}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="text-xs text-[#E8895B] font-semibold tracking-wider uppercase">
            {location}
          </div>
          {duration && (
            <div className="text-[11px] text-white/80 mt-0.5">{duration}</div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#202525] group-hover:text-[#163A3D] transition-colors leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-xs text-[#54433A] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {destinationId && (
          <div className="mt-4 pt-3 border-t border-[#EDE7DF] flex items-center justify-between">
            <Link
              to={`/destinations/${destinationId}`}
              className="text-xs font-semibold text-[#163A3D] hover:underline flex items-center"
            >
              <span>Explore Related Destination</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
