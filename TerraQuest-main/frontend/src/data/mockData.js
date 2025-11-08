// TerraQuest Mock Data Layer
// Simulates Firestore-like data structure for fully functional demo

export const mockProducts = [
  {
    barcode: "12345",
    name: "Coca-Cola",
    carbonFootprint: 65,
    recyclable: false,
    ethicalScore: 40,
    sustainabilityScore: 45,
    aiSummary: "This drink uses single-use plastic bottles with high carbon footprint. The packaging is not easily recyclable in most regions. Consider alternatives with glass bottles or refillable containers for a lower environmental impact.",
    category: "Beverages",
    alternatives: ["GreenFizz Sparkling Water", "Local Refill Stores", "Glass Bottled Drinks"]
  },
  {
    barcode: "67890",
    name: "Tata Salt",
    carbonFootprint: 20,
    recyclable: true,
    ethicalScore: 80,
    sustainabilityScore: 78,
    aiSummary: "Locally sourced and fully recyclable packaging — great choice! This product has minimal carbon footprint and supports local sourcing. The packaging is easily recyclable, making it an eco-friendly option.",
    category: "Food & Groceries",
    alternatives: ["Organic Sea Salt", "Bulk Salt Refills"]
  },
  {
    barcode: "11111",
    name: "Dove Soap",
    carbonFootprint: 35,
    recyclable: true,
    ethicalScore: 65,
    sustainabilityScore: 65,
    aiSummary: "Moderate environmental impact. The product uses recyclable packaging and has decent ethical sourcing. However, some ingredients may have higher environmental costs. Look for products with certified organic ingredients.",
    category: "Personal Care",
    alternatives: ["Eco-Friendly Soap Bars", "Refillable Soap Dispensers"]
  },
  {
    barcode: "22222",
    name: "Organic Quinoa",
    carbonFootprint: 15,
    recyclable: true,
    ethicalScore: 90,
    sustainabilityScore: 88,
    aiSummary: "Excellent eco-friendly choice! Organic quinoa has low carbon footprint, sustainable farming practices, and recyclable packaging. This product supports ethical sourcing and environmental conservation.",
    category: "Food & Groceries",
    alternatives: ["Local Grain Alternatives"]
  },
  {
    barcode: "33333",
    name: "Plastic Water Bottle",
    carbonFootprint: 85,
    recyclable: false,
    ethicalScore: 25,
    sustainabilityScore: 30,
    aiSummary: "High environmental impact. Single-use plastic bottles contribute significantly to pollution and have a very high carbon footprint. Strongly consider reusable water bottles or filtered tap water as alternatives.",
    category: "Beverages",
    alternatives: ["Reusable Water Bottles", "Water Filters", "Refill Stations"]
  },
  {
    barcode: "44444",
    name: "Bamboo Toothbrush",
    carbonFootprint: 10,
    recyclable: true,
    ethicalScore: 95,
    sustainabilityScore: 92,
    aiSummary: "Outstanding sustainable choice! Bamboo is a renewable resource with minimal environmental impact. This product is biodegradable and supports eco-friendly practices. Great for reducing plastic waste!",
    category: "Personal Care",
    alternatives: ["Electric Toothbrush with Replaceable Heads"]
  }
];

export const mockChallenges = [
  {
    id: "challenge_001",
    title: "Eco Beginner",
    description: "Scan your first eco-friendly product",
    reward: 50,
    icon: "sprout",
    status: "active",
    progress: 0,
    target: 1,
    category: "Getting Started"
  },
  {
    id: "challenge_002",
    title: "Green Week",
    description: "Scan 5 sustainable products this week",
    reward: 200,
    icon: "leaf",
    status: "active",
    progress: 2,
    target: 5,
    category: "Weekly Goals"
  },
  {
    id: "challenge_003",
    title: "Plastic-Free Hero",
    description: "Avoid plastic items for 3 days",
    reward: 150,
    icon: "recycle",
    status: "active",
    progress: 1,
    target: 3,
    category: "Sustainability"
  },
  {
    id: "challenge_004",
    title: "Eco Explorer",
    description: "Reach 1000 EcoPoints",
    reward: 300,
    icon: "trophy",
    status: "completed",
    progress: 1000,
    target: 1000,
    category: "Milestones"
  },
  {
    id: "challenge_005",
    title: "Carbon Crusher",
    description: "Scan 10 low-carbon products",
    reward: 250,
    icon: "wind",
    status: "active",
    progress: 6,
    target: 10,
    category: "Carbon Reduction"
  }
];

export const mockRewards = [
  {
    id: "reward_001",
    name: "GreenEarth Foundation",
    reward: "Plant a Tree",
    points: 500,
    description: "Help reforest our planet. One tree planted for every redemption.",
    category: "NGO",
    icon: "tree",
    available: true
  },
  {
    id: "reward_002",
    name: "EcoKart",
    reward: "₹50 Coupon",
    points: 700,
    description: "Get ₹50 off on your next eco-friendly purchase.",
    category: "Brand",
    icon: "shopping",
    available: true
  },
  {
    id: "reward_003",
    name: "OceanWave NGO",
    reward: "Clean 1kg Ocean Plastic",
    points: 1000,
    description: "Fund the cleanup of 1kg of plastic from our oceans.",
    category: "NGO",
    icon: "waves",
    available: true
  },
  {
    id: "reward_004",
    name: "SolarPower Initiative",
    reward: "Solar Panel Installation",
    points: 5000,
    description: "Contribute to solar panel installation in rural areas.",
    category: "NGO",
    icon: "sun",
    available: true
  },
  {
    id: "reward_005",
    name: "EcoStore",
    reward: "₹100 Gift Card",
    points: 1200,
    description: "Redeem for sustainable products at EcoStore.",
    category: "Brand",
    icon: "gift",
    available: true
  },
  {
    id: "reward_006",
    name: "WaterWell Project",
    reward: "Clean Water Access",
    points: 2000,
    description: "Help provide clean water access to communities.",
    category: "NGO",
    icon: "droplet",
    available: true
  }
];

export const mockBadges = [
  {
    id: "badge_001",
    name: "Eco Beginner",
    icon: "🌿",
    description: "Started your eco journey",
    unlocked: true,
    unlockedAt: "2025-01-01"
  },
  {
    id: "badge_002",
    name: "Plastic-Free Hero",
    icon: "♻️",
    description: "Avoided plastic for 3 days",
    unlocked: true,
    unlockedAt: "2025-01-05"
  },
  {
    id: "badge_003",
    name: "Water Saver",
    icon: "💧",
    description: "Saved 1000L of water",
    unlocked: false,
    unlockedAt: null
  },
  {
    id: "badge_004",
    name: "Solar Supporter",
    icon: "🌞",
    description: "Supported solar initiatives",
    unlocked: false,
    unlockedAt: null
  },
  {
    id: "badge_005",
    name: "Carbon Crusher",
    icon: "🌍",
    description: "Reduced 10kg CO₂",
    unlocked: true,
    unlockedAt: "2025-01-10"
  },
  {
    id: "badge_006",
    name: "Eco Guardian",
    icon: "🛡️",
    description: "Reached 1000 EcoPoints",
    unlocked: true,
    unlockedAt: "2025-01-15"
  },
  {
    id: "badge_007",
    name: "Green Explorer",
    icon: "🗺️",
    description: "Scanned 25 products",
    unlocked: true,
    unlockedAt: "2025-01-20"
  },
  {
    id: "badge_008",
    name: "Planet Protector",
    icon: "🌎",
    description: "Reached 2000 EcoPoints",
    unlocked: false,
    unlockedAt: null
  }
];

export const mockLevels = [
  { name: "Eco Rookie", minPoints: 0, maxPoints: 200, color: "gray" },
  { name: "Green Explorer", minPoints: 200, maxPoints: 500, color: "green" },
  { name: "Eco Guardian", minPoints: 500, maxPoints: 1000, color: "emerald" },
  { name: "Planet Protector", minPoints: 1000, maxPoints: 2000, color: "teal" },
  { name: "Earth Champion", minPoints: 2000, maxPoints: 5000, color: "blue" },
  { name: "Sustainability Master", minPoints: 5000, maxPoints: Infinity, color: "purple" }
];

// Helper functions
export const calculateLevel = (ecoScore) => {
  const level = mockLevels.find(l => ecoScore >= l.minPoints && ecoScore < l.maxPoints);
  return level || mockLevels[mockLevels.length - 1];
};

export const calculatePointsFromScan = (sustainabilityScore) => {
  // Higher sustainability score = more points
  // Base points: 10-50 based on score
  if (sustainabilityScore >= 80) return 50;
  if (sustainabilityScore >= 60) return 35;
  if (sustainabilityScore >= 40) return 20;
  return 10;
};

export const generateAIFeedback = (product) => {
  // Enhanced AI-style feedback based on product data
  const score = product.sustainabilityScore;
  let feedback = product.aiSummary;
  
  if (score >= 80) {
    feedback += " 🌟 This is an excellent sustainable choice! Keep up the great work!";
  } else if (score >= 60) {
    feedback += " 👍 Good choice! There are even better alternatives available.";
  } else if (score >= 40) {
    feedback += " ⚠️ Consider exploring greener alternatives for your next purchase.";
  } else {
    feedback += " 🚨 This product has significant environmental impact. Strongly consider alternatives.";
  }
  
  return feedback;
};

export const getProductByBarcode = (barcode) => {
  return mockProducts.find(p => p.barcode === barcode);
};

export const getProductByName = (name) => {
  return mockProducts.find(p => 
    p.name.toLowerCase().includes(name.toLowerCase())
  );
};

// Initial mock user data
export const getInitialUser = () => ({
  uid: "user_001",
  name: "Mahaashree",
  email: "mahaashree@terraquest.com",
  ecoScore: 1240,
  level: "Eco Guardian",
  totalScans: 34,
  scans: [
    { id: "scan_001", productName: "Coca-Cola", score: 45, scannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "scan_002", productName: "Tata Salt", score: 78, scannedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "scan_003", productName: "Dove Soap", score: 65, scannedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
  ],
  badges: ["badge_001", "badge_002", "badge_005", "badge_006", "badge_007"],
  redeemedRewards: ["reward_001"],
  treesPlanted: 2,
  plasticSaved: 1.5,
  co2Reduced: 4.2,
  joinedAt: "2025-01-01"
});

export const mockLeaderboard = [
  { uid: "user_001", name: "Mahaashree", ecoScore: 1240, level: "Eco Guardian", avatar: "🌸" },
  { uid: "user_002", name: "Aarav", ecoScore: 1180, level: "Eco Guardian", avatar: "🌿" },
  { uid: "user_003", name: "Leela", ecoScore: 1040, level: "Eco Guardian", avatar: "🌱" },
  { uid: "user_004", name: "Ravi", ecoScore: 980, level: "Green Explorer", avatar: "🍃" },
  { uid: "user_005", name: "Sana", ecoScore: 950, level: "Green Explorer", avatar: "🌾" },
  { uid: "user_006", name: "Kiran", ecoScore: 890, level: "Green Explorer", avatar: "🌳" },
  { uid: "user_007", name: "Priya", ecoScore: 820, level: "Green Explorer", avatar: "🌺" },
  { uid: "user_008", name: "Arjun", ecoScore: 750, level: "Green Explorer", avatar: "🌲" },
  { uid: "user_009", name: "Meera", ecoScore: 680, level: "Eco Rookie", avatar: "🌻" },
  { uid: "user_010", name: "Vikram", ecoScore: 620, level: "Eco Rookie", avatar: "🌴" }
];

