import type { Artwork, ArtCategory, Order, OrderStatus } from "./types";

export const demoArtworks: Artwork[] = [
  {
    id: "art_001",
    title: "Sunset Dreams",
    description:
      "A vibrant painting capturing the golden hour with warm oranges and deep purples blending across the canvas. This piece evokes feelings of tranquility and wonder.",
    price: 750.0,
    category: "PAINTING" as ArtCategory,
    dimensions: "24x36 inches",
    medium: "Oil on Canvas",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
    ],
    createdAt: "2024-01-10T10:30:00Z",
    updatedAt: "2024-01-10T10:30:00Z",
  },
  {
    id: "art_002",
    title: "Urban Reflections",
    description:
      "A striking digital artwork showcasing the geometric patterns of modern architecture reflected in glass surfaces.",
    price: 500.0,
    category: "DIGITAL_ART" as ArtCategory,
    dimensions: "20x30 inches",
    medium: "Digital Print",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    ],
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
  },
  {
    id: "art_003",
    title: "Abstract Harmony",
    description:
      "Bold strokes of blue and gold create a dynamic composition that speaks to the rhythm of modern life. A centerpiece for any contemporary space.",
    price: 2100.0,
    category: "PAINTING" as ArtCategory,
    dimensions: "48x60 inches",
    medium: "Acrylic on Canvas",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600",
    ],
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
  },
  {
    id: "art_004",
    title: "Mountain Serenity",
    description:
      "A peaceful landscape painting depicting snow-capped mountains reflected in a crystal-clear alpine lake. Perfect for bringing nature indoors.",
    price: 850.0,
    category: "PAINTING" as ArtCategory,
    dimensions: "30x40 inches",
    medium: "Watercolor on Paper",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    ],
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
  },
  {
    id: "art_005",
    title: "City Lights",
    description:
      "A captivating digital art piece showcasing the vibrant energy of city life through streaks of light and urban architecture.",
    price: 950.0,
    category: "DIGITAL_ART" as ArtCategory,
    dimensions: "16x24 inches",
    medium: "Digital Print on Metal",
    isAvailable: true,
    images: ["https://images.unsplash.com/photo-1549490349-8643362247b5?w=600"],
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-18T11:30:00Z",
  },
  {
    id: "art_006",
    title: "Ocean Waves",
    description:
      "Dynamic brushstrokes capture the power and beauty of ocean waves crashing against rocky shores. A tribute to nature's raw energy.",
    price: 700.0,
    category: "PAINTING" as ArtCategory,
    dimensions: "36x48 inches",
    medium: "Oil on Canvas",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600",
    ],
    createdAt: "2024-01-20T13:10:00Z",
    updatedAt: "2024-01-20T13:10:00Z",
  },
  {
    id: "art_007",
    title: "Digital Dreams",
    description:
      "A futuristic digital art piece exploring the intersection of technology and imagination through vibrant neon colors and geometric forms.",
    price: 1200.0,
    category: "DIGITAL_ART" as ArtCategory,
    dimensions: "24x32 inches",
    medium: "Digital Print on Canvas",
    isAvailable: true,
    images: ["https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600"],
    createdAt: "2024-01-22T08:45:00Z",
    updatedAt: "2024-01-22T08:45:00Z",
  },
  {
    id: "art_008",
    title: "Portrait in Shadows",
    description:
      "A dramatic portrait drawing using charcoal technique, playing with light and shadow to create depth and emotion.",
    price: 1800.0,
    category: "DRAWING" as ArtCategory,
    dimensions: "18x24 inches",
    medium: "Charcoal on Paper",
    isAvailable: false,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    ],
    createdAt: "2024-01-05T15:20:00Z",
    updatedAt: "2024-01-05T15:20:00Z",
  },
  {
    id: "art_009",
    title: "Floral Symphony",
    description:
      "A delicate watercolor painting featuring a bouquet of wildflowers in soft pastels. Brings the beauty of spring into any room.",
    price: 450.0,
    category: "PAINTING" as ArtCategory,
    dimensions: "12x16 inches",
    medium: "Watercolor on Paper",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    ],
    createdAt: "2024-01-25T12:00:00Z",
    updatedAt: "2024-01-25T12:00:00Z",
  },
  {
    id: "art_010",
    title: "Cozy Blanket",
    description:
      "A handmade crochet blanket with intricate patterns in warm earth tones. Perfect for adding comfort and style to any living space.",
    price: 650.0,
    category: "CROCHET" as ArtCategory,
    dimensions: "60x80 inches",
    medium: "Wool Yarn",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600",
    ],
    createdAt: "2024-01-28T10:15:00Z",
    updatedAt: "2024-01-28T10:15:00Z",
  },
];

// Demo Orders
export const demoOrders: Order[] = [
  {
    id: "order_001",
    status: "DELIVERED" as OrderStatus,
    totalAmount: 750.0,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    notes: "Please handle with care - fragile artwork",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-22T14:20:00Z",
    userId: "user_001",
    orderItems: [
      {
        id: "item_001",
        quantity: 1,
        price: 750.0,
        artworkId: "art_001",
        artwork: demoArtworks[0], // Sunset Dreams
      },
    ],
  },
  {
    id: "order_002",
    status: "SHIPPED" as OrderStatus,
    totalAmount: 1450.0,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    notes: "Birthday gift - please include gift wrapping",
    createdAt: "2024-01-20T15:45:00Z",
    updatedAt: "2024-01-25T09:30:00Z",
    userId: "user_001",
    orderItems: [
      {
        id: "item_002",
        quantity: 1,
        price: 500.0,
        artworkId: "art_002",
        artwork: demoArtworks[1], // Urban Reflections
      },
      {
        id: "item_003",
        quantity: 1,
        price: 950.0,
        artworkId: "art_005",
        artwork: demoArtworks[4], // City Lights
      },
    ],
  },
  {
    id: "order_003",
    status: "PROCESSING" as OrderStatus,
    totalAmount: 2100.0,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    createdAt: "2024-01-28T11:15:00Z",
    updatedAt: "2024-01-29T16:45:00Z",
    userId: "user_001",
    orderItems: [
      {
        id: "item_004",
        quantity: 1,
        price: 2100.0,
        artworkId: "art_003",
        artwork: demoArtworks[2], // Abstract Harmony
      },
    ],
  },
  {
    id: "order_004",
    status: "PENDING" as OrderStatus,
    totalAmount: 1550.0,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    notes: "Rush delivery if possible",
    createdAt: "2024-02-01T08:20:00Z",
    updatedAt: "2024-02-01T08:20:00Z",
    userId: "user_001",
    orderItems: [
      {
        id: "item_005",
        quantity: 1,
        price: 850.0,
        artworkId: "art_004",
        artwork: demoArtworks[3], // Mountain Serenity
      },
      {
        id: "item_006",
        quantity: 1,
        price: 700.0,
        artworkId: "art_006",
        artwork: demoArtworks[5], // Ocean Waves
      },
    ],
  },
];
