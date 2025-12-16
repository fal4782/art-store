const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you don't want to clear)
  console.log("🧹 Cleaning database...");
  await prisma.downloadVerification.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.artworkTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  console.log("👤 Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@artstore.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
    },
  });

  // Create Customer Users
  console.log("👥 Creating customer users...");
  const customerPassword = await bcrypt.hash("customer123", 10);
  const customer1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      password: customerPassword,
      firstName: "John",
      lastName: "Doe",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      password: customerPassword,
      firstName: "Jane",
      lastName: "Smith",
      role: "CUSTOMER",
      isActive: true,
    },
  });

  // Create Addresses
  console.log("📍 Creating addresses...");
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      name: "John Doe",
      line1: "123 MG Road",
      line2: "Near City Mall",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380001",
      country: "India",
      phone: "+919876543210",
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      name: "Jane Smith",
      line1: "456 SG Highway",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380015",
      country: "India",
      phone: "+919876543211",
      isDefault: true,
    },
  });

  // Create Tags
  console.log("🏷️ Creating tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Abstract", slug: "abstract" } }),
    prisma.tag.create({ data: { name: "Nature", slug: "nature" } }),
    prisma.tag.create({ data: { name: "Portrait", slug: "portrait" } }),
    prisma.tag.create({ data: { name: "Modern", slug: "modern" } }),
    prisma.tag.create({ data: { name: "Vintage", slug: "vintage" } }),
    prisma.tag.create({ data: { name: "Handmade", slug: "handmade" } }),
    prisma.tag.create({ data: { name: "Minimalist", slug: "minimalist" } }),
  ]);

  // Create Artworks
  console.log("🎨 Creating artworks...");

  // Physical Paintings
  const painting1 = await prisma.artwork.create({
    data: {
      name: "Sunset Dreams",
      slug: "sunset-dreams",
      description:
        "A beautiful oil painting capturing the warm hues of a sunset over the ocean.",
      category: "PAINTING",
      type: "PHYSICAL",
      priceInPaise: 1500000, // ₹15,000
      dimensions: "24x36 inches",
      medium: "Oil on canvas",
      stockQuantity: 1,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 1,
      images: [
        "https://images.unsplash.com/photo-1578926078940-58d7dcb8e6f6",
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8",
      ],
      views: 245,
    },
  });

  const painting2 = await prisma.artwork.create({
    data: {
      name: "Mountain Majesty",
      slug: "mountain-majesty",
      description:
        "Acrylic painting of majestic mountains with snow-capped peaks.",
      category: "PAINTING",
      type: "PHYSICAL",
      priceInPaise: 1200000, // ₹12,000
      dimensions: "20x30 inches",
      medium: "Acrylic on canvas",
      stockQuantity: 2,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 2,
      images: ["https://images.unsplash.com/photo-1561214115-f2f134cc4912"],
      views: 189,
    },
  });

  // Crochet Items
  const crochet1 = await prisma.artwork.create({
    data: {
      name: "Cozy Blanket",
      slug: "cozy-blanket",
      description: "Hand-crocheted soft blanket perfect for winter nights.",
      category: "CROCHET",
      type: "PHYSICAL",
      priceInPaise: 350000, // ₹3,500
      dimensions: "60x80 inches",
      medium: "Acrylic yarn",
      stockQuantity: 5,
      isAvailable: true,
      isFeatured: false,
      isMadeToOrder: true,
      images: ["https://images.unsplash.com/photo-1584551246679-0daf3d275d0f"],
      views: 98,
    },
  });

  const crochet2 = await prisma.artwork.create({
    data: {
      name: "Amigurumi Bear",
      slug: "amigurumi-bear",
      description: "Adorable hand-crocheted teddy bear, perfect gift for kids.",
      category: "CROCHET",
      type: "PHYSICAL",
      priceInPaise: 120000, // ₹1,200
      dimensions: "8 inches tall",
      medium: "Cotton yarn",
      stockQuantity: 10,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 3,
      images: ["https://images.unsplash.com/photo-1587022092752-090906f35eaf"],
      views: 312,
    },
  });

  // Drawings
  const drawing1 = await prisma.artwork.create({
    data: {
      name: "Portrait Study",
      slug: "portrait-study",
      description: "Detailed pencil portrait drawing with intricate shading.",
      category: "DRAWING",
      type: "PHYSICAL",
      priceInPaise: 800000, // ₹8,000
      dimensions: "16x20 inches",
      medium: "Graphite on paper",
      stockQuantity: 1,
      isAvailable: true,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f"],
      views: 156,
    },
  });

  // Digital Art
  const digital1 = await prisma.artwork.create({
    data: {
      name: "Cyberpunk City",
      slug: "cyberpunk-city",
      description: "Futuristic digital illustration of a neon-lit cityscape.",
      category: "DIGITAL_ART",
      type: "DIGITAL",
      priceInPaise: 250000, // ₹2,500
      medium: "Digital illustration (Procreate)",
      filePath: "/downloads/cyberpunk-city-4k.png",
      stockQuantity: 999,
      isAvailable: true,
      isFeatured: true,
      sortOrder: 4,
      images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"],
      views: 521,
    },
  });

  const digital2 = await prisma.artwork.create({
    data: {
      name: "Abstract Geometry",
      slug: "abstract-geometry",
      description:
        "Minimalist geometric abstract art, perfect for modern interiors.",
      category: "DIGITAL_ART",
      type: "BOTH", // Available as print and digital download
      priceInPaise: 400000, // ₹4,000
      dimensions: "18x24 inches (print)",
      medium: "Digital art (Adobe Illustrator)",
      filePath: "/downloads/abstract-geometry-vector.svg",
      stockQuantity: 3,
      isAvailable: true,
      isFeatured: false,
      images: ["https://images.unsplash.com/photo-1557672172-298e090bd0f1"],
      views: 278,
    },
  });

  // Associate tags with artworks
  console.log("🔗 Linking tags to artworks...");
  await prisma.artworkTag.createMany({
    data: [
      { artworkId: painting1.id, tagId: tags[1].id }, // Nature
      { artworkId: painting1.id, tagId: tags[3].id }, // Modern
      { artworkId: painting2.id, tagId: tags[1].id }, // Nature
      { artworkId: crochet1.id, tagId: tags[5].id }, // Handmade
      { artworkId: crochet2.id, tagId: tags[5].id }, // Handmade
      { artworkId: drawing1.id, tagId: tags[2].id }, // Portrait
      { artworkId: drawing1.id, tagId: tags[4].id }, // Vintage
      { artworkId: digital1.id, tagId: tags[3].id }, // Modern
      { artworkId: digital2.id, tagId: tags[0].id }, // Abstract
      { artworkId: digital2.id, tagId: tags[6].id }, // Minimalist
    ],
  });

  // Create Cart Items
  console.log("🛒 Adding items to carts...");
  await prisma.cartItem.createMany({
    data: [
      { userId: customer1.id, artworkId: painting1.id, quantity: 1 },
      { userId: customer1.id, artworkId: digital1.id, quantity: 1 },
      { userId: customer2.id, artworkId: crochet2.id, quantity: 2 },
    ],
  });

  // Create Wishlist Items
  console.log("❤️ Adding items to wishlists...");
  await prisma.wishlistItem.createMany({
    data: [
      { userId: customer1.id, artworkId: painting2.id },
      { userId: customer1.id, artworkId: crochet1.id },
      { userId: customer2.id, artworkId: painting1.id },
      { userId: customer2.id, artworkId: digital2.id },
    ],
  });

  // Create Orders
  console.log("📦 Creating orders...");
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      addressId: address1.id,
      status: "DELIVERED",
      paymentStatus: "COMPLETED",
      totalPriceInPaise: 120000, // ₹1,200
      paymentIntentId: "order_Mock123456789",
      shippingName: address1.name,
      shippingAddressLine1: address1.line1,
      shippingAddressLine2: address1.line2,
      shippingCity: address1.city,
      shippingState: address1.state,
      shippingPostalCode: address1.postalCode,
      shippingCountry: address1.country,
      shippingPhone: address1.phone,
      trackingNumber: "TRK123456789IN",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      addressId: address2.id,
      status: "CONFIRMED",
      paymentStatus: "COMPLETED",
      totalPriceInPaise: 1500000, // ₹15,000
      paymentIntentId: "order_Mock987654321",
      shippingName: address2.name,
      shippingAddressLine1: address2.line1,
      shippingCity: address2.city,
      shippingState: address2.state,
      shippingPostalCode: address2.postalCode,
      shippingCountry: address2.country,
      shippingPhone: address2.phone,
    },
  });

  // Create Order Items
  console.log("📝 Creating order items...");
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        artworkId: crochet2.id,
        quantity: 1,
        priceInPaise: 120000,
        artworkName: crochet2.name,
        artworkType: crochet2.type,
        artworkDescription: crochet2.description,
        artworkImage: crochet2.images[0],
      },
      {
        orderId: order2.id,
        artworkId: painting1.id,
        quantity: 1,
        priceInPaise: 1500000,
        artworkName: painting1.name,
        artworkType: painting1.type,
        artworkDescription: painting1.description,
        artworkImage: painting1.images[0],
      },
    ],
  });

  // Create Payments
  console.log("💳 Creating payments...");
  await prisma.payment.createMany({
    data: [
      {
        orderId: order1.id,
        amountInPaise: 120000,
        currency: "INR",
        status: "COMPLETED",
        paymentGateway: "razorpay",
        gatewayPaymentId: "pay_Mock123456789",
      },
      {
        orderId: order2.id,
        amountInPaise: 1500000,
        currency: "INR",
        status: "COMPLETED",
        paymentGateway: "razorpay",
        gatewayPaymentId: "pay_Mock987654321",
      },
    ],
  });

  // Create Reviews
  console.log("⭐ Creating reviews...");
  await prisma.review.createMany({
    data: [
      {
        userId: customer1.id,
        artworkId: crochet2.id,
        rating: 5,
        comment:
          "Absolutely adorable! My daughter loves it. The quality is excellent.",
      },
      {
        userId: customer2.id,
        artworkId: painting2.id,
        rating: 4,
        comment:
          "Beautiful painting, colors are vibrant. Took a bit longer to ship but worth the wait.",
      },
      {
        userId: customer1.id,
        artworkId: digital1.id,
        rating: 5,
        comment:
          "Amazing digital art! High resolution and looks great as my desktop wallpaper.",
      },
    ],
  });

  // Create Discount Codes
  console.log("🎟️ Creating discount codes...");
  await prisma.discountCode.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off for new customers",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minPurchaseInPaise: 100000, // Min ₹1,000
        maxUses: 100,
        usedCount: 5,
        isActive: true,
        validUntil: new Date("2025-12-31"),
      },
      {
        code: "FLAT500",
        description: "Flat ₹500 off on orders above ₹5,000",
        discountType: "FIXED",
        discountValue: 50000, // ₹500 in paise
        minPurchaseInPaise: 500000, // Min ₹5,000
        maxUses: 50,
        usedCount: 12,
        isActive: true,
        validUntil: new Date("2025-06-30"),
      },
      {
        code: "EXPIRED",
        description: "Expired discount code",
        discountType: "PERCENTAGE",
        discountValue: 20,
        isActive: false,
        validUntil: new Date("2024-12-31"),
      },
    ],
  });

  // Create Download Verifications for digital products
  console.log("⬇️ Creating download verifications...");
  await prisma.downloadVerification.createMany({
    data: [
      {
        artworkId: digital1.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Artworks: ${await prisma.artwork.count()}`);
  console.log(`   - Orders: ${await prisma.order.count()}`);
  console.log(`   - Reviews: ${await prisma.review.count()}`);
  console.log(`   - Discount Codes: ${await prisma.discountCode.count()}`);
  console.log("\n🔑 Login credentials:");
  console.log("   Admin: admin@artstore.com / admin123");
  console.log("   Customer: john@example.com / customer123");
  console.log("   Customer: jane@example.com / customer123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
