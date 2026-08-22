const { Destination } = require('../models');

const seedData = [
  // North India
  {
    name: "Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    zone: "North India",
    slug: "jaipur",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    description: "The Pink City famous for royal palaces, forts, and vibrant bazaars."
  },
  {
    name: "Manali",
    city: "Manali",
    state: "Himachal Pradesh",
    zone: "North India",
    slug: "manali",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    description: "High-altitude Himalayan resort town known for snow-capped peaks and adventure sports."
  },
  {
    name: "Varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    zone: "North India",
    slug: "varanasi",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    description: "Spiritual capital of India on the sacred banks of the Ganges River."
  },
  {
    name: "Agra",
    city: "Agra",
    state: "Uttar Pradesh",
    zone: "North India",
    slug: "agra",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    description: "Home of the iconic Taj Mahal, a world wonder of ivory-white marble."
  },
  {
    name: "Leh Ladakh",
    city: "Leh",
    state: "Ladakh",
    zone: "North India",
    slug: "leh-ladakh",
    imageUrl: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    description: "Dramatically scenic mountain landscapes, ancient monasteries, and high passes."
  },

  // South India
  {
    name: "Kochi",
    city: "Kochi",
    state: "Kerala",
    zone: "South India",
    slug: "kochi",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    description: "Historic port city featuring Chinese fishing nets and tranquil backwaters."
  },
  {
    name: "Munnar",
    city: "Munnar",
    state: "Kerala",
    zone: "South India",
    slug: "munnar",
    imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    description: "Serene hill station renowned for sprawling tea plantations and mist-covered hills."
  },
  {
    name: "Ooty",
    city: "Ooty",
    state: "Tamil Nadu",
    zone: "South India",
    slug: "ooty",
    imageUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    description: "Charming Nilgiri hill resort famed for botanical gardens and toy train rides."
  },
  {
    name: "Hampi",
    city: "Hampi",
    state: "Karnataka",
    zone: "South India",
    slug: "hampi",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80",
    description: "UNESCO World Heritage site filled with ancient temple ruins among boulder-strewn hills."
  },
  {
    name: "Pondicherry",
    city: "Pondicherry",
    state: "Puducherry",
    zone: "South India",
    slug: "pondicherry",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    description: "Coastal town with French colonial heritage, mustard-yellow villas, and quiet beaches."
  },

  // Europe
  {
    name: "Paris",
    city: "Paris",
    state: "France",
    zone: "Europe",
    slug: "paris",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "The City of Light, famous for the Eiffel Tower, Louvre Museum, and cafe culture."
  },
  {
    name: "Rome",
    city: "Rome",
    state: "Italy",
    zone: "Europe",
    slug: "rome",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "The Eternal City boasting ancient wonders like the Colosseum and Vatican City."
  },
  {
    name: "Barcelona",
    city: "Barcelona",
    state: "Spain",
    zone: "Europe",
    slug: "barcelona",
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
    description: "Vibrant Mediterranean metropolis renowned for Gaudí architecture and tapas."
  },
  {
    name: "Amsterdam",
    city: "Amsterdam",
    state: "Netherlands",
    zone: "Europe",
    slug: "amsterdam",
    imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
    description: "Picturesque canal network, historical gabled houses, and rich artistic heritage."
  },
  {
    name: "London",
    city: "London",
    state: "United Kingdom",
    zone: "Europe",
    slug: "london",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    description: "Global landmark city home to Big Ben, Tower Bridge, and world-class theater."
  },

  // Asia
  {
    name: "Tokyo",
    city: "Tokyo",
    state: "Japan",
    zone: "Asia",
    slug: "tokyo",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    description: "Futuristic metropolis blending neon skyscrapers with historic temples and culinary magic."
  },
  {
    name: "Bali",
    city: "Denpasar",
    state: "Indonesia",
    zone: "Asia",
    slug: "bali",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "Tropical paradise famed for lush rice terraces, volcanic peaks, and beach resorts."
  },
  {
    name: "Bangkok",
    city: "Bangkok",
    state: "Thailand",
    zone: "Asia",
    slug: "bangkok",
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    description: "Bustling capital with ornate shrines, vibrant street food, and lively river channels."
  },
  {
    name: "Singapore",
    city: "Singapore",
    state: "Singapore",
    zone: "Asia",
    slug: "singapore",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    description: "Modern island city-state with futuristic Gardens by the Bay and diverse cultures."
  },
  {
    name: "Kyoto",
    city: "Kyoto",
    state: "Japan",
    zone: "Asia",
    slug: "kyoto",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    description: "Cultural heart of Japan known for classical Buddhist temples, gardens, and geisha districts."
  },

  // Americas
  {
    name: "New York",
    city: "New York City",
    state: "USA",
    zone: "Americas",
    slug: "new-york",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    description: "The Big Apple, featuring Times Square, Central Park, and iconic skyline views."
  },
  {
    name: "Rio de Janeiro",
    city: "Rio de Janeiro",
    state: "Brazil",
    zone: "Americas",
    slug: "rio-de-janeiro",
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
    description: "Coastal city famous for Copacabana beach, Sugarloaf Mountain, and Christ the Redeemer."
  },
  {
    name: "Cancún",
    city: "Cancún",
    state: "Mexico",
    zone: "Americas",
    slug: "cancun",
    imageUrl: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1200&q=80",
    description: "Caribbean gateway with turquoise waters, white sand beaches, and Mayan ruins nearby."
  },
  {
    name: "San Francisco",
    city: "San Francisco",
    state: "USA",
    zone: "Americas",
    slug: "san-francisco",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
    description: "Hilly California city famous for the Golden Gate Bridge, cable cars, and Victorian houses."
  },
  {
    name: "Buenos Aires",
    city: "Buenos Aires",
    state: "Argentina",
    zone: "Americas",
    slug: "buenos-aires",
    imageUrl: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
    description: "Cosmopolitan capital known for European architecture, tango music, and rich gastronomy."
  }
];

async function autoSeedDestinations() {
  try {
    for (const item of seedData) {
      await Destination.findOrCreate({
        where: { slug: item.slug },
        defaults: item
      });
    }
    console.log('Destinations successfully seeded with at least 5 cities per category.');
  } catch (err) {
    console.error('Error seeding destinations:', err);
  }
}

module.exports = autoSeedDestinations;
