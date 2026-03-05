// ─── Mock Movie Data ─────────────────────────────────────────────────────────
const MOVIES = [
  {
    id: 1,
    title: "Stellar Odyssey",
    genre: ["Sci-Fi", "Adventure"],
    language: "English",
    rating: 8.7,
    duration: "2h 28m",
    certificate: "UA",
    releaseDate: "2026-01-15",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=500&fit=crop",
    synopsis: "A crew of astronauts embarks on humanity's most ambitious journey — a one-way mission to a distant star system that promises a new home for civilization. But when they discover the planet already harbours life, everything changes.",
    cast: ["Aria Chen", "Marcus Rivers", "Yuki Tanaka", "Leon Okafor"],
    director: "Sofia Reinholt",
    trailer: "#",
    tags: ["space", "exploration", "survival"]
  },
  {
    id: 2,
    title: "The Last Kingdom",
    genre: ["Action", "Drama"],
    language: "English",
    rating: 8.2,
    duration: "2h 45m",
    certificate: "A",
    releaseDate: "2026-01-22",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=500&fit=crop",
    synopsis: "A disgraced warrior returns to his homeland after a decade in exile, only to find his kingdom on the brink of collapse. With enemies at the gates and traitors within the walls, he must choose between honour and survival.",
    cast: ["Damian Cross", "Priya Nair", "Ethan Wolf", "Sofia Blanc"],
    director: "James Okonkwo",
    trailer: "#",
    tags: ["warrior", "kingdom", "epic"]
  },
  {
    id: 3,
    title: "Neon Shadows",
    genre: ["Thriller", "Neo-Noir"],
    language: "English",
    rating: 7.9,
    duration: "1h 58m",
    certificate: "A",
    releaseDate: "2026-02-05",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop",
    synopsis: "In a rain-soaked cyberpunk city, a rogue detective uncovers a conspiracy that links the city's most powerful corporations to a string of mysterious disappearances. The deeper she digs, the more dangerous the truth becomes.",
    cast: ["Zara Kim", "Cole Mercer", "Nina Vasquez", "Ray Thorn"],
    director: "Aiko Yamamoto",
    trailer: "#",
    tags: ["detective", "cyberpunk", "mystery"]
  },
  {
    id: 4,
    title: "Wildfire",
    genre: ["Drama", "Romance"],
    language: "English",
    rating: 7.5,
    duration: "2h 10m",
    certificate: "UA",
    releaseDate: "2026-02-14",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1200&h=500&fit=crop",
    synopsis: "Two strangers meet during a wildfire evacuation and find themselves stranded together in the mountains. What begins as a desperate survival story becomes an unexpected romance that neither expected to find.",
    cast: ["Lena Hart", "Alex Russo", "Carmen Diaz", "Will Stone"],
    director: "Rachel Moore",
    trailer: "#",
    tags: ["romance", "survival", "drama"]
  },
  {
    id: 5,
    title: "Phantom Protocol",
    genre: ["Action", "Spy"],
    language: "English",
    rating: 8.4,
    duration: "2h 22m",
    certificate: "UA",
    releaseDate: "2026-02-20",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=500&fit=crop",
    synopsis: "A ghost operative believed dead for five years resurfaces with stolen intelligence that could trigger World War III. Now every intelligence agency on the planet wants her — dead or alive.",
    cast: ["Vanessa Cross", "Riku Sato", "Marco Ferretti", "Beth Osei"],
    director: "David Grant",
    trailer: "#",
    tags: ["spy", "action", "thriller"]
  },
  {
    id: 6,
    title: "Echo Chamber",
    genre: ["Horror", "Psychological"],
    language: "English",
    rating: 7.8,
    duration: "1h 52m",
    certificate: "A",
    releaseDate: "2026-03-01",
    status: "now_showing",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop",
    synopsis: "A sound engineer begins hearing voices through a vintage recording device and soon discovers they are warnings from a version of herself trapped in an alternate reality. As the boundaries blur, she must decide which reality is real.",
    cast: ["Mia Walsh", "Jordan Fox", "Carla Reeves", "Sean Liu"],
    director: "Ingrid Bjork",
    trailer: "#",
    tags: ["horror", "psychological", "alternate reality"]
  },
  {
    id: 7,
    title: "Sunrise in Mumbai",
    genre: ["Drama", "Family"],
    language: "Hindi",
    rating: 8.1,
    duration: "2h 35m",
    certificate: "U",
    releaseDate: "2026-03-15",
    status: "coming_soon",
    poster: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=500&fit=crop",
    synopsis: "A heartwarming tale of a young girl from a fishing village in Mumbai who dreams of becoming India's first female astronaut. Against all odds, she fights through social barriers, poverty, and self-doubt to reach the stars.",
    cast: ["Ananya Sharma", "Rajesh Kapoor", "Deepa Nair", "Aarav Seth"],
    director: "Priya Menon",
    trailer: "#",
    tags: ["inspirational", "family", "india"]
  },
  {
    id: 8,
    title: "The Forgotten Code",
    genre: ["Mystery", "Sci-Fi"],
    language: "English",
    rating: 8.6,
    duration: "2h 18m",
    certificate: "UA",
    releaseDate: "2026-03-22",
    status: "coming_soon",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=500&fit=crop",
    synopsis: "A cryptographer deciphers an ancient mathematical sequence that predates modern civilization by 30,000 years. Hidden within it is a message — and following it leads her to a secret that will rewrite human history.",
    cast: ["Elena Park", "Thomas Grey", "Asha Reddy", "Victor Moss"],
    director: "Karl Jensen",
    trailer: "#",
    tags: ["mystery", "ancient", "code"]
  }
];

// ─── Cinemas ─────────────────────────────────────────────────────────────────
const CINEMAS = [
  { id: 1, name: "CineMax IMAX, Andheri", location: "Andheri West, Mumbai" },
  { id: 2, name: "PVR Cinemas, Juhu", location: "Juhu, Mumbai" },
  { id: 3, name: "INOX Megaplex, Lower Parel", location: "Lower Parel, Mumbai" },
  { id: 4, name: "Cinepolis, Thane", location: "Viviana Mall, Thane" }
];

// ─── Showtimes ────────────────────────────────────────────────────────────────
function getShowtimes(movieId) {
  const times = ["10:00 AM", "1:15 PM", "4:30 PM", "7:45 PM", "10:55 PM"];
  const showtimes = [];
  const today = new Date();
  for (let d = 0; d < 5; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    const label = d === 0 ? "Today" : d === 1 ? "Tomorrow" : date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    CINEMAS.forEach(cinema => {
      const cinemaShowtimes = times.slice(0, 3 + Math.floor(Math.random() * 2) + 1);
      showtimes.push({
        date: dateStr,
        label,
        cinema,
        times: cinemaShowtimes.map(t => ({ time: t, format: cinema.id === 1 ? "IMAX" : ["2D", "3D"][Math.floor(Math.random() * 2)] }))
      });
    });
  }
  return showtimes;
}

// ─── Seat Layout ─────────────────────────────────────────────────────────────
const SEAT_CONFIG = {
  rows: [
    { label: "A", count: 8, type: "vip", price: 600 },
    { label: "B", count: 8, type: "vip", price: 600 },
    { label: "C", count: 10, type: "premium", price: 350 },
    { label: "D", count: 10, type: "premium", price: 350 },
    { label: "E", count: 10, type: "premium", price: 350 },
    { label: "F", count: 12, type: "standard", price: 200 },
    { label: "G", count: 12, type: "standard", price: 200 },
    { label: "H", count: 12, type: "standard", price: 200 },
    { label: "I", count: 12, type: "standard", price: 200 },
    { label: "J", count: 12, type: "standard", price: 200 }
  ]
};

// Generate a booked set pseudo-randomly for a given show key
function getBookedSeats(showKey) {
  const booked = new Set();
  let seed = showKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  SEAT_CONFIG.rows.forEach(row => {
    for (let i = 1; i <= row.count; i++) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      if (Math.abs(seed) % 5 < 2) booked.add(`${row.label}${i}`);
    }
  });
  return booked;
}

// ─── Price config ─────────────────────────────────────────────────────────────
const SEAT_PRICES = { vip: 600, premium: 350, standard: 200 };
const BOOKING_FEE = 30;
