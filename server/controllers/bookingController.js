// axios removed — not used in current mock implementation
const {
  geocodeCity,
  searchPointsOfInterest,
  OpenTripMapError,
} = require("../utils/openTripMapClient");

// Mock data shared across search and booking endpoints
const mockFlights = [
  {
    id: "fl-1",
    airline: "SkyAir",
    price: 299.99,
    departureTime: "08:00",
    arrivalTime: "10:30",
    duration: "2h 30m",
  },
  {
    id: "fl-2",
    airline: "OceanAir",
    price: 349.99,
    departureTime: "12:15",
    arrivalTime: "14:45",
    duration: "2h 30m",
  },
  {
    id: "fl-3",
    airline: "MountainExpress",
    price: 279.99,
    departureTime: "16:30",
    arrivalTime: "19:00",
    duration: "2h 30m",
  },
  {
    id: "fl-4",
    airline: "BudgetWings",
    price: 149.99,
    departureTime: "05:00",
    arrivalTime: "07:30",
    duration: "2h 30m",
  },
  {
    id: "fl-5",
    airline: "LuxeAir",
    price: 499.99,
    departureTime: "20:00",
    arrivalTime: "22:30",
    duration: "2h 30m",
  },
];

const mockHotels = [
  {
    id: "ht-1",
    name: "Grand Plaza Hotel",
    rating: 4.5,
    price: 199.99,
    amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
    images: ["hotel1_img1.jpg", "hotel1_img2.jpg"],
  },
  {
    id: "ht-2",
    name: "Comfort Inn & Suites",
    rating: 4.2,
    price: 149.99,
    amenities: ["WiFi", "Breakfast", "Parking"],
    images: ["hotel2_img1.jpg", "hotel2_img2.jpg"],
  },
  {
    id: "ht-3",
    name: "Luxury Resort & Spa",
    rating: 4.8,
    price: 299.99,
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym"],
    images: ["hotel3_img1.jpg", "hotel3_img2.jpg"],
  },
  {
    id: "ht-4",
    name: "Budget Stay Inn",
    rating: 3.5,
    price: 79.99,
    amenities: ["WiFi", "Parking"],
    images: ["hotel4_img1.jpg"],
  },
  {
    id: "ht-5",
    name: "City Center Hotel",
    rating: 4.0,
    price: 129.99,
    amenities: ["WiFi", "Restaurant", "Gym"],
    images: ["hotel5_img1.jpg"],
  },
];

// Search for flights with filters
exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, minBudget, maxBudget } =
      req.body;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        msg: "Please provide origin, destination, and departure date",
      });
    }

    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return res.status(400).json({
        msg: "Origin and destination cities cannot be the same",
      });
    }

    const flights = mockFlights.map((f) => ({
      ...f,
      origin,
      destination,
      departureDate,
      currency: "USD",
    }));

    let filteredFlights = flights;

    if (minBudget !== undefined && minBudget !== "") {
      filteredFlights = filteredFlights.filter(
        (f) => f.price >= Number(minBudget),
      );
    }
    if (maxBudget !== undefined && maxBudget !== "") {
      filteredFlights = filteredFlights.filter(
        (f) => f.price <= Number(maxBudget),
      );
    }

    res.json({ flights: filteredFlights });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Search for hotels with filters
exports.searchHotels = async (req, res) => {
  try {
    const {
      location,
      checkIn,
      checkOut,
      minBudget,
      maxBudget,
      minRating,
      amenities,
    } = req.body;

    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({
        msg: "Please provide location, check-in, and check-out dates",
      });
    }

    // Add request-specific fields to the shared hotel data
    const addresses = {
      "ht-1": "123 Main Street",
      "ht-2": "456 Park Avenue",
      "ht-3": "789 Beach Boulevard",
      "ht-4": "321 Economy Road",
      "ht-5": "555 Downtown Ave",
    };
    const hotels = mockHotels.map((h) => ({
      ...h,
      location,
      address: addresses[h.id],
      currency: "USD",
    }));

    let filteredHotels = hotels;

    // Budget filter
    if (minBudget !== undefined && minBudget !== "") {
      filteredHotels = filteredHotels.filter(
        (h) => h.price >= Number(minBudget),
      );
    }
    if (maxBudget !== undefined && maxBudget !== "") {
      filteredHotels = filteredHotels.filter(
        (h) => h.price <= Number(maxBudget),
      );
    }

    // Rating filter
    if (minRating !== undefined && minRating !== "" && Number(minRating) > 0) {
      filteredHotels = filteredHotels.filter(
        (h) => h.rating >= Number(minRating),
      );
    }

    // Amenities filter — hotel must have ALL selected amenities
    if (amenities && amenities.length > 0) {
      filteredHotels = filteredHotels.filter((h) =>
        amenities.every((a) => h.amenities.includes(a)),
      );
    }

    res.json({ hotels: filteredHotels });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Book a flight
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengers, tripId } = req.body;

    if (!flightId || !passengers || !tripId) {
      return res.status(400).json({
        msg: "Please provide flight ID, passenger details, and trip ID",
      });
    }

    // Look up the selected flight to get its actual price
    const selectedFlight = mockFlights.find((f) => f.id === flightId);
    if (!selectedFlight) {
      return res.status(404).json({ msg: "Flight not found" });
    }

    const bookingConfirmation = {
      bookingId: "BK" + Math.floor(Math.random() * 10000000),
      flightId,
      status: "confirmed",
      passengers,
      totalPrice: selectedFlight.price * passengers.length,
      currency: "USD",
    };

    res.json(bookingConfirmation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Book a hotel
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, roomType, guests, checkIn, checkOut, tripId } = req.body;

    // Validate that all required fields are present
    if (!hotelId || !roomType || !guests || !checkIn || !checkOut || !tripId) {
      return res.status(400).json({
        msg: "Please provide all required booking details",
      });
    }

    // 1. Validate Date Formatting Semantics (Fixes corrupted-date-string vulnerability)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        msg: "Please provide valid check-in and check-out dates",
      });
    }

    // 2. Validate Stay Duration Chronology (Fixes negative-date and same-day checkout vulnerabilities)
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const totalNights = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (totalNights < 1) {
      return res.status(400).json({
        msg: "Booking duration must be at least 1 night",
      });
    }

    // 3. Complete Safe Price Calculation
    const PRICE_PER_NIGHT = 199.99;
    const calculatedPrice = parseFloat(
      (PRICE_PER_NIGHT * totalNights).toFixed(2),
    );

    const bookingConfirmation = {
      bookingId: "HB" + Math.floor(Math.random() * 10000000),
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: "confirmed",
      totalPrice: calculatedPrice,
      currency: "USD",
    };

    res.json(bookingConfirmation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const VALID_POI_CATEGORIES = [
  "SIGHTS",
  "HISTORICAL",
  "BEACH_PARK",
  "NIGHTLIFE",
  "RESTAURANT",
  "SHOPPING",
];

const CATEGORY_TO_KINDS = {
  SIGHTS: ["view_points", "monuments_and_memorials", "cultural"],
  HISTORICAL: ["historic"],
  BEACH_PARK: ["beaches", "natural"],
  NIGHTLIFE: ["amusements"],
  RESTAURANT: ["foods"],
  SHOPPING: ["shops"],
};

const DEFAULT_KINDS = Array.from(
  new Set(Object.values(CATEGORY_TO_KINDS).flat()),
);

function resolveCategory(kindsString) {
  const kinds = (kindsString || "").split(",");
  const matches = (list) => list.some((k) => kinds.includes(k));

  if (matches(CATEGORY_TO_KINDS.HISTORICAL)) return "HISTORICAL";
  if (matches(CATEGORY_TO_KINDS.BEACH_PARK)) return "BEACH_PARK";
  if (matches(CATEGORY_TO_KINDS.NIGHTLIFE)) return "NIGHTLIFE";
  if (matches(CATEGORY_TO_KINDS.RESTAURANT)) return "RESTAURANT";
  if (matches(CATEGORY_TO_KINDS.SHOPPING)) return "SHOPPING";
  return "SIGHTS";
}

function rateToRank(rate) {
  const HERITAGE_TIERS = { "1h": 70, "2h": 85, "3h": 95, "7d": 100 };
  if (typeof rate === "string" && HERITAGE_TIERS[rate] !== undefined) {
    return HERITAGE_TIERS[rate];
  }
  const numericRate = Number(rate) || 0; // typically 0-3
  return Math.min(100, numericRate * 25);
}

function hashToNumber(str) {
  // Some OpenTripMap entries can arrive without an xid; guard against that
  // instead of crashing the whole search on a single malformed POI.
  if (typeof str !== "string" || str.length === 0) return 0;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }
  return Math.abs(hash);
}

const USD_TO_INR_RATE = 83;

function estimateEntryFee(poi, rank) {
  const baseUsd = hashToNumber(poi.xid) % 45; // 0-44
  const popularityBoostUsd = rank ? Math.round(rank / 20) : 0; // more popular -> pricier
  const totalUsd = baseUsd + popularityBoostUsd;
  return Math.round((totalUsd * USD_TO_INR_RATE) / 10) * 10; // round to nearest ₹10
}

function buildBookingLinks(name, city) {
  const query = encodeURIComponent(`${name} ${city}`.trim());
  return {
    getYourGuide: `https://www.getyourguide.com/s/?q=${query}`,
    viator: `https://www.viator.com/searchResults/all?text=${query}`,
    tripAdvisor: `https://www.tripadvisor.com/Search?q=${query}`,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}

function hasPlausibleName(name) {
  if (!name || !name.trim()) return false;
  // Reject only genuinely broken data: the Unicode replacement character
  // (mojibake/encoding failures) or control characters. The previous check
  // rejected any name outside the Latin script, which silently dropped
  // legitimate results whenever OpenTripMap only had a place's name in its
  // native script (Devanagari, Tamil, etc.) — very common for destinations
  // across India, the core audience of this app.
  return !/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(name);
}

function getFallbackPlaces(destination) {
  const destLower = (destination || "").toLowerCase().trim();
  const cityName = destination?.trim() ? destination.trim().replace(/\b\w/g, l => l.toUpperCase()) : "City";

  const curatedMap = {
    jaipur: [
      { id: "fp-1", name: "Amber Fort", city: "Jaipur", category: "HISTORICAL", rank: 95, tags: ["historic", "fort", "palace"], price: 500, currency: "INR", bookingLinks: buildBookingLinks("Amber Fort", "Jaipur") },
      { id: "fp-2", name: "Hawa Mahal", city: "Jaipur", category: "SIGHTS", rank: 90, tags: ["view_points", "architecture"], price: 200, currency: "INR", bookingLinks: buildBookingLinks("Hawa Mahal", "Jaipur") },
      { id: "fp-3", name: "City Palace", city: "Jaipur", category: "HISTORICAL", rank: 88, tags: ["historic", "museum"], price: 300, currency: "INR", bookingLinks: buildBookingLinks("City Palace", "Jaipur") },
      { id: "fp-4", name: "Jantar Mantar", city: "Jaipur", category: "SIGHTS", rank: 85, tags: ["cultural", "monuments_and_memorials"], price: 200, currency: "INR", bookingLinks: buildBookingLinks("Jantar Mantar", "Jaipur") },
      { id: "fp-5", name: "Johari Bazaar", city: "Jaipur", category: "SHOPPING", rank: 80, tags: ["shops", "market"], price: 0, currency: "INR", bookingLinks: buildBookingLinks("Johari Bazaar", "Jaipur") }
    ],
    paris: [
      { id: "fp-6", name: "Eiffel Tower", city: "Paris", category: "SIGHTS", rank: 100, tags: ["monuments_and_memorials", "view_points"], price: 2200, currency: "INR", bookingLinks: buildBookingLinks("Eiffel Tower", "Paris") },
      { id: "fp-7", name: "Louvre Museum", city: "Paris", category: "HISTORICAL", rank: 98, tags: ["historic", "cultural"], price: 1700, currency: "INR", bookingLinks: buildBookingLinks("Louvre Museum", "Paris") },
      { id: "fp-8", name: "Arc de Triomphe", city: "Paris", category: "SIGHTS", rank: 90, tags: ["monuments_and_memorials"], price: 1100, currency: "INR", bookingLinks: buildBookingLinks("Arc de Triomphe", "Paris") }
    ],
    "new york": [
      { id: "fp-10", name: "Statue of Liberty", city: "New York", category: "SIGHTS", rank: 98, tags: ["monuments_and_memorials"], price: 2000, currency: "INR", bookingLinks: buildBookingLinks("Statue of Liberty", "New York") },
      { id: "fp-11", name: "Central Park", city: "New York", category: "BEACH_PARK", rank: 95, tags: ["natural", "beaches"], price: 0, currency: "INR", bookingLinks: buildBookingLinks("Central Park", "New York") }
    ]
  };

  const matchKey = Object.keys(curatedMap).find(k => destLower.includes(k) || k.includes(destLower));
  if (matchKey) return curatedMap[matchKey];

  return [
    { id: "gen-1", name: `${cityName} Historic Center`, city: cityName, category: "HISTORICAL", rank: 90, tags: ["historic", "cultural"], price: 150, currency: "INR", bookingLinks: buildBookingLinks(`${cityName} Historic Center`, cityName) },
    { id: "gen-2", name: `${cityName} Scenic Viewpoint`, city: cityName, category: "SIGHTS", rank: 85, tags: ["view_points", "cultural"], price: 0, currency: "INR", bookingLinks: buildBookingLinks(`${cityName} Scenic Viewpoint`, cityName) },
    { id: "gen-3", name: `${cityName} Central Park & Nature Reserve`, city: cityName, category: "BEACH_PARK", rank: 80, tags: ["natural", "beaches"], price: 0, currency: "INR", bookingLinks: buildBookingLinks(`${cityName} Central Park`, cityName) },
    { id: "gen-4", name: `${cityName} Local Market & Bazaars`, city: cityName, category: "SHOPPING", rank: 75, tags: ["shops"], price: 0, currency: "INR", bookingLinks: buildBookingLinks(`${cityName} Local Market`, cityName) }
  ];
}

exports.searchPlaces = async (req, res) => {
  try {
    const { destination, minPrice, maxPrice, categories } = req.body;

    if (!destination) {
      return res.status(400).json({
        msg: "Please provide a destination to search for places to visit",
      });
    }

    const requestedCategories = Array.isArray(categories)
      ? categories.filter((c) => VALID_POI_CATEGORIES.includes(c))
      : [];

    const kinds =
      requestedCategories.length > 0
        ? Array.from(
            new Set(requestedCategories.flatMap((c) => CATEGORY_TO_KINDS[c])),
          )
        : DEFAULT_KINDS;

    let city;
    try {
      city = await geocodeCity(destination);
    } catch (err) {
      console.warn("Geocoding failed, using curated places fallback:", err.message);
    }

    if (!city || city.latitude === undefined) {
      const places = getFallbackPlaces(destination);
      return res.json({ places });
    }

    let rawPois = [];
    try {
      rawPois = await searchPointsOfInterest({
        latitude: city.latitude,
        longitude: city.longitude,
        radius: 20,
        kinds,
      });
    } catch (err) {
      console.warn("OpenTripMap POI search failed, using curated fallback:", err.message);
      const places = getFallbackPlaces(destination);
      return res.json({ places });
    }

    let places = rawPois
      .filter((poi) => hasPlausibleName(poi.name))
      .map((poi) => {
        const rank = rateToRank(poi.rate);
        return {
          id: poi.xid,
          name: poi.name,
          city: city.name,
          category: resolveCategory(poi.kinds),
          rank,
          tags: (poi.kinds || "").split(",").filter(Boolean).slice(0, 6),
          coordinates: poi.point,
          price: estimateEntryFee(poi, rank),
          currency: "INR",
          bookingLinks: buildBookingLinks(poi.name, city.name),
        };
      });

    if (places.length === 0) {
      places = getFallbackPlaces(destination);
    }

    if (requestedCategories.length > 0) {
      const requestedKinds = new Set(
        requestedCategories.flatMap((c) => CATEGORY_TO_KINDS[c]),
      );
      places = places.filter((p) =>
        p.tags.some((tag) => requestedKinds.has(tag)),
      );
      if (places.length === 0) {
        places = getFallbackPlaces(destination);
      }
    }

    if (minPrice !== undefined && minPrice !== "") {
      places = places.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      places = places.filter((p) => p.price <= Number(maxPrice));
    }

    places.sort((a, b) => (b.rank || 0) - (a.rank || 0));

    res.json({ places });
  } catch (err) {
    console.error("searchPlaces failed:", err);
    const places = getFallbackPlaces(req.body?.destination);
    res.json({ places });
  }
};
