import { dbService } from '../services/db.service';
import { User, Item, Booking, Review } from '../types';
import mongoose from 'mongoose';
import { UserModel, ItemModel, BookingModel, ReviewModel } from '../models/Schemas';

export const demoUsers: User[] = [
  {
    _id: 'user_demo_123',
    email: 'user@travelmate.ai',
    name: 'Moinul Islam',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phoneNumber: '+8801711223344',
    preferences: {
      interests: ['Adventure', 'Nature'],
      budget: 'moderate',
      travelStyle: 'Backpacker'
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'manager_demo_123',
    email: 'manager@travelmate.ai',
    name: 'Rahat Khan',
    role: 'manager',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    phoneNumber: '+8801811223344',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'admin_demo_123',
    email: 'admin@travelmate.ai',
    name: 'Tasnim Ahmed',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phoneNumber: '+8801911223344',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const demoItems: Item[] = [
  {
    _id: 'item_coxsbazar_001',
    name: 'Cox\'s Bazar Beach Escape',
    description: 'Experience the world\'s longest natural sandy sea beach in Cox\'s Bazar. Relax, swim, and enjoy sunsets.',
    longDescription: 'Treat yourself to an unforgettable tropical getaway at Cox\'s Bazar, boasting the longest continuous sandy beach on Earth. Over three action-packed yet relaxing days, you will walk along the golden shoreline, taste delicious fresh seafood cooked right before your eyes, watch mesmerizing sunsets over the Bay of Bengal, and explore the nearby hills and marine drives.',
    category: 'Beach',
    location: 'Cox\'s Bazar, Chittagong',
    price: 15000,
    duration: 3,
    rating: 4.8,
    reviewsCount: 3,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      '3-Star Hotel Accommodation (Twin Share)',
      'Daily Breakfast & Dinner',
      'Local Tour Guide',
      'Airport/Bus Terminal Transfers',
      'Inani Beach & Himchari Tour Transportation'
    ],
    highlights: [
      'Walk along the world\'s longest continuous sandy beach (120km)',
      'Scenic drive along the famous Marine Drive road',
      'Breathtaking sunset views from Inani Beach',
      'Spectacular panoramic views from Himchari Hilltop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Beach Exploration',
        activities: [
          'Pick up from airport/bus station and check-in to beachside hotel',
          'Free time to stroll on Laboni Beach and enjoy water sports',
          'Special beachside seafood dinner at a local traditional restaurant'
        ]
      },
      {
        day: 2,
        title: 'Himchari Hills & Inani Coral Beach',
        activities: [
          'Drive along the scenic Marine Drive to Himchari National Park',
          'Hike up the hill for a view of the Bay of Bengal and see the waterfall',
          'Spend the afternoon exploring the unique coral stones of Inani Beach',
          'Watch the golden sunset from the beach'
        ]
      },
      {
        day: 3,
        title: 'Souvenir Shopping & Departure',
        activities: [
          'Visit the Burmese Market for local handicrafts and dry fish markets',
          'Relaxing beach morning stroll',
          'Check-out and transfer back for departure transport'
        ]
      }
    ],
    tags: ['beach', 'sunset', 'seafood', 'relaxing'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_sylhet_002',
    name: 'Sylhet Tea Valley Retreat',
    description: 'Immerse yourself in the lush green tea gardens of Srimangal and explore the scenic lakes of Sylhet.',
    longDescription: 'Embark on a refreshing getaway to the green capital of Bangladesh. Witness endless expanses of tea plantations, trek inside the tropical rainforest of Lawachara to spot rare wildlife, boat on the crystal-clear waters of Lalakhal, and experience the unique swamp forest of Ratargul.',
    category: 'Nature',
    location: 'Srimangal & Sylhet Sadar',
    price: 12000,
    duration: 2,
    rating: 4.7,
    reviewsCount: 2,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Premium Eco-resort Accommodation',
      'All Meals including local Sylheti cuisine',
      'Traditional 7-color tea tasting',
      'Boat rental at Ratargul Swamp Forest',
      'Guided trek in Lawachara National Park'
    ],
    highlights: [
      'Wander through picturesque tea estates in Srimangal',
      'Spot gibbons and rare birds in Lawachara Rainforest',
      'Unique boat ride through the flooded Ratargul Swamp Forest',
      'Taste the legendary 7-color tea'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Srimangal Tea Gardens & Lawachara Forest',
        activities: [
          'Arrival at Srimangal resort and refreshing local breakfast',
          'Guided walk through Finlay tea gardens and visit to a tea processing center',
          'Afternoon trek in Lawachara National Park',
          'Taste the famous multi-layered tea in Nilkantha Tea Cabin'
        ]
      },
      {
        day: 2,
        title: 'Ratargul Swamp Forest Boat Cruise',
        activities: [
          'Morning drive to Ratargul Swamp Forest (the Amazon of Bangla)',
          'Take a traditional wooden boat through the submerged evergreen trees',
          'Traditional Bengali lunch featuring freshwater fish dishes',
          'Transfer back to Sylhet city for departure'
        ]
      }
    ],
    tags: ['tea gardens', 'rainforest', 'nature', 'swamp forest'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_sajek_003',
    name: 'Sajek Valley Cloud Tour',
    description: 'Travel above the clouds to Sajek Valley, surrounded by misty hills and vibrant indigenous culture.',
    longDescription: 'Sajek Valley is the queen of hills in Bangladesh. Nestled in the high peaks of the Chittagong Hill Tracts, Sajek is famous for its breathtaking landscape where clouds float beneath you. This package includes secure military convoy travel, beautiful wooden cottage accommodation, and views of Konglak Para.',
    category: 'Adventure',
    location: 'Sajek Valley, Rangamati',
    price: 14000,
    duration: 3,
    rating: 4.9,
    reviewsCount: 2,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Hilltop Wooden Cottage (Scenic Balcony View)',
      '4WD Land Cruiser (Chander Gari) for sightseeing',
      'Local tribal meals (Bamboo chicken special)',
      'Secure military convoy coordination',
      'Hike to Konglak Para (highest point)'
    ],
    highlights: [
      'Watch waves of white clouds roll through the valley right from your balcony',
      'Exhilarating drive on winding mountain roads in a Chander Gari',
      'Hike to Konglak Para and meet the indigenous Lusai people',
      'Stargazing under an unpolluted night sky full of stars'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Khagrachari to Sajek Mountain Drive',
        activities: [
          'Meet at Khagrachari in the morning, board the 4WD Chander Gari',
          'Join the military convoy at Baghaihat and climb the steep hills to Sajek',
          'Check-in to cottage, watch sunset from Helipad-1',
          'Traditional bamboo chicken dinner'
        ]
      },
      {
        day: 2,
        title: 'Konglak Para Sunrise & Tribal Village',
        activities: [
          'Hike early morning to Konglak Para to watch cloud waves and sunrise',
          'Breakfast and interactive walk through Ruilui Para village',
          'Afternoon sightseeing around Stone Garden and rock formations',
          'Campfire and barbecue night under the stars'
        ]
      },
      {
        day: 3,
        title: 'Alutila Cave Exploration & Departure',
        activities: [
          'Depart Sajek with morning convoy back to Khagrachari',
          'Explore the mysterious, dark stone Alutila Cave with fire torches',
          'Visit the hanging bridge of Khagrachari',
          'Dinner and drop off at the bus terminal'
        ]
      }
    ],
    tags: ['hills', 'clouds', 'trekking', 'indigenous'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_sundarbans_004',
    name: 'Sundarbans Wildlife Expedition',
    description: 'Cruise through the world\'s largest mangrove forest, home of the majestic Royal Bengal Tiger.',
    longDescription: 'Set sail into the deep wilderness of the Sundarbans, a UNESCO World Heritage site and the largest mangrove forest in the world. Traverse the narrow canals in search of spotted deer, saltwater crocodiles, dolphins, and the elusive Royal Bengal Tiger. You will stay on a premium cruise ship and enjoy guided jungle trails.',
    category: 'Nature',
    location: 'Sundarbans, Khulna',
    price: 25000,
    duration: 4,
    rating: 4.9,
    reviewsCount: 1,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      '3 Nights accommodation on a luxury cruise ship cabin',
      'All meals (Jungle seafood specialties)',
      'Forest department permits and armed forest guards',
      'Small boat canal cruises',
      'Guided jungle walking trails'
    ],
    highlights: [
      'Navigate narrow, silent canals on a quiet wooden rowboat',
      'Jungle walk at Kotka Wildlife Sanctuary to see wild deer herds',
      'Visit the pristine egg beach at Jamtola',
      'Chance of spotting Royal Bengal Tiger tracks and sightings'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Embarkation from Khulna & Sail South',
        activities: [
          'Board the ship at Khulna jail ghat early morning',
          'Begin cruising through the Rupsha and Shibsha rivers',
          'Forest briefing and safety instruction while sailing',
          'Anchor near Harbaria Eco Tourism center and take an evening walk'
        ]
      },
      {
        day: 2,
        title: 'Kotka Wildlife Trails & Beach Walk',
        activities: [
          'Early morning silent boat ride through narrow canals for bird watching',
          'Guided walk through the dense jungle of Kotka wildlife range',
          'Trek to Jamtola beach for swimming and enjoying wild dunes',
          'Watch deer and monkeys from the forest watchtower'
        ]
      },
      {
        day: 3,
        title: 'Kachikhali Wildlife Haven & Forest Walk',
        activities: [
          'Sail to Kachikhali (Tiger point)',
          'Jungle trail walk looking for tiger tracks and observing birds',
          'Visit the local fisherman village and see honey extraction demo',
          'Special BBQ and cultural presentation on the ship deck'
        ]
      },
      {
        day: 4,
        title: 'Karamjal Crocodile Breeding Center & Return',
        activities: [
          'Morning cruise to Karamjal Eco Center',
          'Walk the wooden footpaths to see crocodiles and spotted deer breeding cages',
          'Return cruise towards Khulna',
          'Arrival at Khulna city and disembark in the evening'
        ]
      }
    ],
    tags: ['mangrove', 'tiger', 'wildlife', 'cruise'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_bandarban_005',
    name: 'Bandarban Hill Adventure',
    description: 'Hike green peaks, see waterfalls like Amiakhum, and experience tribal lifestyles.',
    longDescription: 'Bandarban offers the most challenging and rewarding trekking terrains in Bangladesh. This trip takes you off the beaten path to scale remote hilltops, swim in cold natural water pools, stand under spectacular waterfalls, and learn about the lifestyle of different ethnic tribes (Bawm, Marma, Murong).',
    category: 'Adventure',
    location: 'Bandarban, Chittagong Hill Tracts',
    price: 16000,
    duration: 3,
    rating: 4.6,
    reviewsCount: 1,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Resort accommodation in Bandarban Sadar',
      'Local specialized mountain guides',
      'All local transport (Chander Gari & Boat)',
      'Tribal community homestay meals',
      'Permits and administrative fees'
    ],
    highlights: [
      'Exhilarating boat ride in Sangu River through narrow canyons',
      'Stand on top of Nilgiri Hill above the clouds',
      'Visit the Golden Temple (Buddha Dhatu Jadi)',
      'Hike to the breathtaking Amiakhum Waterfall'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Sangu River Cruise & Golden Temple',
        activities: [
          'Arrival in Bandarban and check-in to resort',
          'Visit the beautiful Golden Temple with its golden dome structures',
          'Scenic traditional boat ride down the winding Sangu River',
          'Watch sunset from Nilachal hill peak'
        ]
      },
      {
        day: 2,
        title: 'Nilgiri & Waterfalls Trek',
        activities: [
          'Drive to Nilgiri, the highest resort in Bangladesh, for cloud views',
          'Trek to Shoilo Propat Waterfall and buy local tribal handlooms',
          'Visit the Bawm tribal village and share lunch with a local family',
          'Return to resort for dinner'
        ]
      },
      {
        day: 3,
        title: 'Boga Lake Trek & Return',
        activities: [
          'Early morning drive to Boga Lake, a mysterious natural lake on a hilltop',
          'Walk around the lake and interact with local communities',
          'Return to Bandarban town for souvenir shopping',
          'Departure in the evening'
        ]
      }
    ],
    tags: ['waterfall', 'hiking', 'canyon', 'hills'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_stmartin_006',
    name: 'Saint Martin Island Getaway',
    description: 'Relax on the only coral island of Bangladesh, featuring coconut groves and turquoise waters.',
    longDescription: 'Escape the city rush to Saint Martin\'s Island, the only coral island in Bangladesh. With its crystal-clear blue waters, towering coconut trees, and serene marine atmosphere, it\'s the ultimate tropical haven. Cycle around the island, collect sea shells, snorkel among reefs, and visit the detached Chera Dwip island.',
    category: 'Beach',
    location: 'Saint Martin\'s Island, Teknaf',
    price: 18000,
    duration: 3,
    rating: 4.7,
    reviewsCount: 1,
    availability: {
      startDate: '2026-10-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Round-trip Cruise Ship ticket from Teknaf',
      'Beachside resort accommodation',
      'Daily breakfast, lunch, and dinner',
      'Chera Dwip boat cruise',
      'Snorkeling gear rental'
    ],
    highlights: [
      'Cruise ship voyage through the Naf River and Bay of Bengal',
      'Relax under coconut trees in the calm West Beach',
      'Boat cruise to Chera Dwip, the southernmost point of Bangladesh',
      'Delicious BBQ dinners featuring fresh coral fish, lobsters, and crabs'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Teknaf Cruise & Island Check-in',
        activities: [
          'Board the luxury cruise ship at Teknaf ghat and sail to Saint Martin',
          'Hotel check-in and fresh coconut water welcome drink',
          'Watch sunset from the West Beach and walk along the coral sands',
          'Fresh grilled red snapper dinner'
        ]
      },
      {
        day: 2,
        title: 'Chera Dwip & Snorkeling Adventure',
        activities: [
          'Take a speed boat or local engine boat to Chera Dwip coral island',
          'Explore live coral reefs and fossil structures',
          'Return to main beach for snorkeling and swimming',
          'Relax on beach hammocks in the evening'
        ]
      },
      {
        day: 3,
        title: 'Bicycle Tour & Return Cruise',
        activities: [
          'Rent a bicycle to explore the village and coconut groves of the island',
          'Checkout and board the afternoon cruise ship back to Teknaf',
          'Drop off for onward journey'
        ]
      }
    ],
    tags: ['coral', 'island', 'beach', 'seafood'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_olddhaka_007',
    name: 'Old Dhaka Heritage Walk',
    description: 'Explore historical Mughal architecture, vibrant narrow lanes, and delicious street food.',
    longDescription: 'Immerse yourself in the chaotic, historical charm of Old Dhaka. Walk through narrow alleys bustling with rikshaws, visit centuries-old Mughal palaces and forts, cruise on the busy Buriganga river, and taste the famous biryani that Old Dhaka is renowned for.',
    category: 'Cultural',
    location: 'Old Dhaka, Dhaka Sadar',
    price: 3000,
    duration: 1,
    rating: 4.5,
    reviewsCount: 1,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Professional historian guide',
      'All monument entrance fees',
      'Traditional Rickshaw rides',
      'Buriganga River boat ride',
      'Famous Old Dhaka Biryani Lunch & street food snacks'
    ],
    highlights: [
      'Visit the pink Lalbagh Fort built by the Mughals',
      'Explore Ahsan Manzil (The Pink Palace) overlooking the river',
      'Experience the bustling Sadarghat river port',
      'Savor authentic Kacchi Biryani and Bakarkhani'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Full Day Heritage & Food Tour',
        activities: [
          'Morning meetup and traditional breakfast with Bakarkhani and tea',
          'Visit Lalbagh Fort and the historical Star Mosque (Tara Masjid)',
          'Rickshaw ride through narrow lanes of Shankhari Bazar (Conch Shell street)',
          'Feast on legendary Kacchi Biryani for lunch',
          'Explore the Pink Palace (Ahsan Manzil) and take a wooden boat ride on the Buriganga River'
        ]
      }
    ],
    tags: ['history', 'food tour', 'mughal', 'culture'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'item_srimangal_008',
    name: 'Srimangal Eco Experience',
    description: 'Explore forest biodiversity, cycle in rubber estates, and experience local tribal tea cultures.',
    longDescription: 'Srimangal is the tea capital of Bangladesh. It is also an eco-tourism hub, offering pristine green hills and secondary rainforests. This package focuses on low-impact, ecologically conscious exploration of forest trails, wildlife, tea plantations, and rubber garden cycles.',
    category: 'Eco-tourism',
    location: 'Srimangal, Moulvibazar',
    price: 10000,
    duration: 2,
    rating: 4.6,
    reviewsCount: 0,
    availability: {
      startDate: '2026-07-01',
      endDate: '2026-12-31'
    },
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    ],
    included: [
      'Eco-lodge Accommodation',
      'Organic meals prepared with local ingredients',
      'Bicycle rental for estate rides',
      'Expert naturalist guide'
    ],
    highlights: [
      'Low carbon footprint travel using cycles',
      'Stay in an authentic eco-lodge built with mud and bamboo',
      'Learn about local tea plucking and processing sustainably',
      'Spot wild monkeys, squirrels, and owls on a guided night walk'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Bicycle Estate Ride & Eco Lodge Stay',
        activities: [
          'Arrive at Srimangal Eco Lodge and settle into your green room',
          'Cycle tour through surrounding rubber and tea estates',
          'Organic lunch at the lodge garden',
          'Guided evening forest walk to spot nocturnal mammals'
        ]
      },
      {
        day: 2,
        title: 'Hum Hum Waterfall Trek & Departure',
        activities: [
          'Early morning trek through deep forest to see the hidden Hum Hum Waterfall',
          'Picnic lunch by the streams',
          'Visit a local indigenous village to learn about traditional weaving',
          'Departure in the evening'
        ]
      }
    ],
    tags: ['eco-friendly', 'nature', 'cycling', 'waterfall'],
    managerId: 'manager_demo_123',
    createdAt: new Date().toISOString()
  }
];

export const demoReviews: Review[] = [
  {
    _id: 'rev_1',
    itemId: 'item_coxsbazar_001',
    userId: 'user_demo_123',
    userName: 'Moinul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The hotel was fantastic and the guide knew all the best spots for sunset photography. Highly recommended beach escape!',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_2',
    itemId: 'item_coxsbazar_001',
    userId: 'admin_demo_123',
    userName: 'Tasnim Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    comment: 'Great arrangement. The drive along Marine Drive was beautiful, though Inani Beach was a bit crowded.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_3',
    itemId: 'item_sylhet_002',
    userId: 'user_demo_123',
    userName: 'Moinul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Ratargul is absolutely magical! The boat ride through submerged trees felt like a dream. Local Sylhet lunch was superb.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_4',
    itemId: 'item_sajek_003',
    userId: 'user_demo_123',
    userName: 'Moinul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Waking up to the sea of clouds from the resort balcony was the best feeling ever. The Sajek tour is worth every penny.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const demoBookings: Booking[] = [
  {
    _id: 'book_1',
    itemId: 'item_coxsbazar_001',
    userId: 'user_demo_123',
    startDate: '2026-07-15',
    endDate: '2026-07-18',
    guests: 2,
    totalPrice: 30000,
    status: 'confirmed',
    contactName: 'Moinul Islam',
    contactEmail: 'user@travelmate.ai',
    contactPhone: '+8801711223344',
    notes: 'Please arrange a room with a direct sea view.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'book_2',
    itemId: 'item_sylhet_002',
    userId: 'user_demo_123',
    startDate: '2026-08-05',
    endDate: '2026-08-07',
    guests: 3,
    totalPrice: 36000,
    status: 'pending',
    contactName: 'Moinul Islam',
    contactEmail: 'user@travelmate.ai',
    contactPhone: '+8801711223344',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'book_3',
    itemId: 'item_sajek_003',
    userId: 'admin_demo_123',
    startDate: '2026-09-10',
    endDate: '2026-09-13',
    guests: 4,
    totalPrice: 56000,
    status: 'confirmed',
    contactName: 'Tasnim Ahmed',
    contactEmail: 'admin@travelmate.ai',
    contactPhone: '+8801911223344',
    notes: 'Require cottage helper services.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function runSeed() {
  console.log('Seeding database...');
  await dbService.connect();

  if (dbService.isUsingMongo()) {
    // Seed MongoDB
    try {
      await UserModel.deleteMany({});
      await ItemModel.deleteMany({});
      await BookingModel.deleteMany({});
      await ReviewModel.deleteMany({});

      await UserModel.insertMany(demoUsers);
      await ItemModel.insertMany(demoItems);
      await BookingModel.insertMany(demoBookings);
      await ReviewModel.insertMany(demoReviews);

      console.log('✅ MongoDB seeded successfully!');
    } catch (e) {
      console.error('❌ Failed to seed MongoDB:', e);
    }
  } else {
    // Seed JSON Database fallback
    dbService.seedDatabase({
      users: demoUsers,
      items: demoItems,
      bookings: demoBookings,
      reviews: demoReviews
    });
    console.log('✅ JSON Database seeded successfully!');
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
