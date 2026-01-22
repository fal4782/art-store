
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive seed...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.artworkTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');

  // 2. Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@artstore.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'user@artstore.com',
      password: hashedPassword,
      firstName: 'Falguni',
      lastName: 'Das',
      role: 'CUSTOMER',
    }
  });

  console.log('Users created.');

  // 3. Addresses
  await prisma.address.create({
    data: {
      userId: customer.id,
      name: 'Home',
      line1: '123 Art Lane',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700001',
      country: 'India',
      isDefault: true,
    }
  });

  // 4. Categories
  const catPaintings = await prisma.category.create({
    data: {
      name: "Paintings",
      slug: "painting",
      description: "Original handmade paintings on various mediums.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200",
    }
  });

  const catDigital = await prisma.category.create({
    data: {
      name: "Digital Art",
      slug: "digital-art",
      description: "Modern digital illustrations and concept art.",
      image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=1200",
    }
  });

  const catCrochet = await prisma.category.create({
    data: {
      name: "Crochet",
      slug: "crochet",
      description: "Unique handmade crochet items and patterns.",
      image: "https://images.unsplash.com/photo-1619250917646-9533f52496a7?q=80&w=1200",
    }
  });

  const catDrawings = await prisma.category.create({
    data: {
      name: "Drawings",
      slug: "drawing",
      description: "Detailed pencil and charcoal sketches.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
    }
  });

  console.log('Categories created.');

  // 5. Tags
  const tagsData = [
    { name: 'Oil Painting', slug: 'oil' },
    { name: 'Abstract', slug: 'abstract' },
    { name: 'Landscape', slug: 'landscape' },
    { name: 'Portrait', slug: 'portrait' },
    { name: 'Modern', slug: 'modern' },
    { name: 'Minimalist', slug: 'minimalist' },
    { name: 'Vintage', slug: 'vintage' },
    { name: 'Cyberpunk', slug: 'cyberpunk' },
  ];
  
  const tags = {};
  for (const t of tagsData) {
    tags[t.slug] = await prisma.tag.create({ data: t });
  }

  // 6. Artworks
  const artworks = [
    {
      name: "Eternal Sunset",
      slug: "eternal-sunset",
      description: "A beautiful oil painting capturing the last light of day.",
      categoryId: catPaintings.id,
      priceInPaise: 1500000, // 15,000 INR
      images: ["https://images.unsplash.com/photo-1578310360411-5a507a61d1e4?q=80&w=1000"],
      tags: ['oil', 'landscape']
    },
    {
      name: "Nebula Dreams",
      slug: "nebula-dreams",
      description: "Digital nebula concept for sci-fi enthusiasts.",
      categoryId: catDigital.id,
      type: "DIGITAL",
      priceInPaise: 49900,
      images: ["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000"],
      tags: ['cyberpunk', 'modern']
    },
    {
      name: "Cotton Candy Amigurumi",
      slug: "cotton-candy-amigurumi",
      description: "Soft crochet plushie made with high-quality yarn.",
      categoryId: catCrochet.id,
      priceInPaise: 120000,
      images: ["https://images.unsplash.com/photo-1608133513361-b844cd0a0494?q=80&w=1000"],
      tags: ['minimalist']
    },
    {
      name: "The Silent Forest",
      slug: "silent-forest",
      description: "Detailed charcoal drawing of a dense forest floor.",
      categoryId: catDrawings.id,
      priceInPaise: 850000,
      images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000"],
      tags: ['landscape', 'minimalist']
    },
    {
      name: "Vibrant Chaos",
      slug: "vibrant-chaos",
      description: "Acrylic abstract painting with rich textures.",
      categoryId: catPaintings.id,
      priceInPaise: 2500000,
      images: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000"],
      tags: ['abstract', 'modern']
    },
    {
      name: "Midnight Cityscape",
      slug: "midnight-cityscape",
      description: "Cyberpunk inspired digital illustration.",
      categoryId: catDigital.id,
      type: "BOTH",
      priceInPaise: 150000,
      images: ["https://images.unsplash.com/photo-1514753930263-fb7077fde6bc?q=80&w=1000"],
      tags: ['cyberpunk', 'abstract']
    },
    {
        name: "Cozy Winter Scarf",
        slug: "cozy-winter-scarf",
        description: "Hand-knitted wool scarf for the coldest days.",
        categoryId: catCrochet.id,
        priceInPaise: 95000,
        images: ["https://images.unsplash.com/photo-1542332606-b3d27038668b?q=80&w=1000"],
        tags: ['vintage']
    },
    {
        name: "Expressionist Portrait",
        slug: "expressionist-portrait",
        description: "Pencil sketch with raw emotive power.",
        categoryId: catDrawings.id,
        priceInPaise: 720000,
        images: ["https://images.unsplash.com/photo-1533158307567-8877b235508b?q=80&w=1000"],
        tags: ['portrait', 'modern']
    }
  ];

  for (const art of artworks) {
    const { tags: tagSlugs, ...artData } = art;
    await prisma.artwork.create({
      data: {
        ...artData,
        tags: {
          create: tagSlugs.map(slug => ({
            tag: { connect: { id: tags[slug].id } }
          }))
        }
      }
    });
  }

  console.log('Artworks created.');

  // 7. Cart & Wishlist for demo
  const someArtwork = await prisma.artwork.findFirst({ where: { slug: 'eternal-sunset' } });
  if (someArtwork) {
    await prisma.cartItem.create({
      data: {
        userId: customer.id,
        artworkId: someArtwork.id,
        quantity: 1
      }
    });
    await prisma.wishlistItem.create({
      data: {
        userId: customer.id,
        artworkId: someArtwork.id
      }
    });
  }

  console.log('Cart & Wishlist populated.');

  // 8. Demo Order
  await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'DELIVERED',
      paymentStatus: 'COMPLETED',
      totalPriceInPaise: 1500000,
      orderItems: {
        create: {
          artworkId: someArtwork.id,
          quantity: 1,
          priceInPaise: 1500000,
          artworkName: someArtwork.name,
          artworkType: someArtwork.type,
          artworkImage: someArtwork.images[0]
        }
      }
    }
  });

  console.log('Demo order created.');
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
