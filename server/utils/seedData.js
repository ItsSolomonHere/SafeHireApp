const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
const Worker = require('../models/Worker');
require('dotenv').config({ path: './config.env' });

const categories = [
  {
    name: 'House Cleaning',
    description: 'Professional house cleaning and maintenance services',
    icon: 'sparkles',
    featured: true,
    sortOrder: 1,
    requirements: [
      {
        title: 'Background Check',
        description: 'All workers must pass a thorough background check',
        required: true
      },
      {
        title: 'Experience',
        description: 'Minimum 1 year of cleaning experience',
        required: true
      }
    ],
    tags: ['cleaning', 'housekeeping', 'maintenance']
  },
  {
    name: 'Plumbing',
    description: 'Expert plumbing repair and installation services',
    icon: 'wrench',
    featured: true,
    sortOrder: 2,
    requirements: [
      {
        title: 'Licensed Plumber',
        description: 'Must be a licensed plumber with valid certification',
        required: true
      },
      {
        title: 'Insurance',
        description: 'Must have liability insurance coverage',
        required: true
      }
    ],
    tags: ['plumbing', 'repair', 'installation']
  },
  {
    name: 'Electrical Work',
    description: 'Professional electrical installation and repair services',
    icon: 'zap',
    featured: true,
    sortOrder: 3,
    requirements: [
      {
        title: 'Licensed Electrician',
        description: 'Must be a licensed electrician with valid certification',
        required: true
      },
      {
        title: 'Safety Training',
        description: 'Must have completed safety training courses',
        required: true
      }
    ],
    tags: ['electrical', 'wiring', 'installation']
  },
  {
    name: 'Gardening',
    description: 'Landscaping and garden maintenance services',
    icon: 'flower',
    featured: false,
    sortOrder: 4,
    requirements: [
      {
        title: 'Experience',
        description: 'Minimum 2 years of gardening experience',
        required: true
      }
    ],
    tags: ['gardening', 'landscaping', 'maintenance']
  },
  {
    name: 'Carpentry',
    description: 'Custom woodwork and furniture repair services',
    icon: 'hammer',
    featured: false,
    sortOrder: 5,
    requirements: [
      {
        title: 'Experience',
        description: 'Minimum 3 years of carpentry experience',
        required: true
      },
      {
        title: 'Tools',
        description: 'Must have own professional tools',
        required: true
      }
    ],
    tags: ['carpentry', 'woodwork', 'furniture']
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services',
    icon: 'palette',
    featured: false,
    sortOrder: 6,
    requirements: [
      {
        title: 'Experience',
        description: 'Minimum 2 years of painting experience',
        required: true
      }
    ],
    tags: ['painting', 'interior', 'exterior']
  },
  {
    name: 'Moving & Packing',
    description: 'Professional moving and packing services',
    icon: 'package',
    featured: false,
    sortOrder: 7,
    requirements: [
      {
        title: 'Vehicle',
        description: 'Must have access to a moving vehicle',
        required: true
      },
      {
        title: 'Insurance',
        description: 'Must have moving insurance coverage',
        required: true
      }
    ],
    tags: ['moving', 'packing', 'transport']
  },
  {
    name: 'Pet Care',
    description: 'Pet sitting, walking, and grooming services',
    icon: 'heart',
    featured: false,
    sortOrder: 8,
    requirements: [
      {
        title: 'Pet Experience',
        description: 'Must have experience with various pets',
        required: true
      }
    ],
    tags: ['pets', 'sitting', 'grooming']
  }
];

const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'employer',
    phone: '+254700123456',
    location: {
      county: 'Nairobi',
      city: 'Westlands',
      coordinates: {
        type: 'Point',
        coordinates: [36.8172, -1.2921]
      }
    },
    isVerified: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'worker',
    phone: '+254700123457',
    location: {
      county: 'Nairobi',
      city: 'Kilimani',
      coordinates: {
        type: 'Point',
        coordinates: [36.8172, -1.2921]
      }
    },
    isVerified: true
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@safehire.co.ke',
    password: 'admin123',
    role: 'admin',
    phone: '+254700123458',
    location: {
      county: 'Nairobi',
      city: 'CBD',
      coordinates: {
        type: 'Point',
        coordinates: [36.8172, -1.2921]
      }
    },
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await User.deleteMany({});
    await Worker.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample worker profile
    const workerUser = createdUsers.find(user => user.role === 'worker');
    const houseCleaningCategory = createdCategories.find(cat => cat.name === 'House Cleaning');

    if (workerUser && houseCleaningCategory) {
      const worker = new Worker({
        user: workerUser._id,
        category: houseCleaningCategory._id,
        skills: [
          {
            name: 'House Cleaning',
            level: 'expert',
            yearsOfExperience: 5
          },
          {
            name: 'Window Cleaning',
            level: 'intermediate',
            yearsOfExperience: 3
          }
        ],
        hourlyRate: 800,
        bio: 'Professional house cleaner with 5+ years of experience. Specializing in deep cleaning, regular maintenance, and eco-friendly cleaning solutions.',
        documents: {
          idCard: 'https://example.com/id-card.jpg',
          policeClearance: 'https://example.com/police-clearance.jpg'
        },
        verification: {
          isVerified: true,
          verifiedAt: new Date(),
          verifiedBy: createdUsers.find(user => user.role === 'admin')._id
        },
        status: 'active',
        availability: {
          monday: { available: true, startTime: '08:00', endTime: '17:00' },
          tuesday: { available: true, startTime: '08:00', endTime: '17:00' },
          wednesday: { available: true, startTime: '08:00', endTime: '17:00' },
          thursday: { available: true, startTime: '08:00', endTime: '17:00' },
          friday: { available: true, startTime: '08:00', endTime: '17:00' },
          saturday: { available: false, startTime: '08:00', endTime: '17:00' },
          sunday: { available: false, startTime: '08:00', endTime: '17:00' }
        }
      });

      await worker.save();
      console.log('✅ Created sample worker profile');

      // Update category stats
      await houseCleaningCategory.updateWorkerCount();
      await houseCleaningCategory.updateAverageRate();
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data:');
    console.log('- Categories:', createdCategories.length);
    console.log('- Users:', createdUsers.length);
    console.log('- Sample worker profile created');
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Employer: john.doe@example.com / password123');
    console.log('Worker: jane.smith@example.com / password123');
    console.log('Admin: admin@safehire.co.ke / admin123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

