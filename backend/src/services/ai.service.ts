import { GoogleGenerativeAI } from '@google/generative-ai';
import { Item } from '../types';

let genAI: GoogleGenerativeAI | null = null;
if (process.env.AI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
    console.log('Gemini AI Service initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Google Generative AI:', error);
  }
}

export class AIService {
  // AI Feature 1: AI Trip Planner
  public static async generateTripPlan(params: {
    destination: string;
    budget: string;
    startDate: string;
    endDate: string;
    guests: number;
    interests: string[];
    travelStyle: string;
  }) {
    const { destination, budget, startDate, endDate, guests, interests, travelStyle } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const prompt = `Act as an expert travel agent. Generate a detailed travel itinerary for a trip to "${destination}".
Trip Details:
- Duration: ${duration} Days
- Budget Profile: ${budget} (budget, moderate, or luxury)
- Travelers: ${guests}
- Interests: ${interests.join(', ')}
- Travel Style: ${travelStyle}

Return a JSON object matching this structure:
{
  "itinerary": [
    { "day": 1, "title": "Day 1 Title", "activities": ["Activity 1", "Activity 2"] },
    ...
  ],
  "recommendedDestinations": ["Spot A", "Spot B"],
  "budgetTips": ["Tip 1", "Tip 2"],
  "packingSuggestions": ["Item 1", "Item 2"],
  "safetyTips": ["Safety Tip 1", "Safety Tip 2"]
}
Only output the JSON object. Do not include any markdown formatting or extra text outside the JSON.`;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Clean markdown code blocks if any
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (error) {
        console.error('Gemini API call failed, using fallback trip planner:', error);
      }
    }

    // Fallback deterministic trip planner
    return this.getFallbackTripPlan(destination, duration, budget, interests, travelStyle);
  }

  // AI Feature 2: Smart Recommendations
  public static async getRecommendations(params: {
    userId: string;
    preferences: { interests?: string[]; budget?: string; travelStyle?: string };
    availableItems: Item[];
  }) {
    const { preferences, availableItems } = params;
    const interests = preferences.interests || [];
    const budget = preferences.budget || 'moderate';

    // Simple scoring mechanism for fallback/primary
    const scoredItems = availableItems.map(item => {
      let score = 0;

      // Category matching
      if (interests.some(interest => item.category.toLowerCase().includes(interest.toLowerCase()) || item.tags.some(t => t.toLowerCase() === interest.toLowerCase()))) {
        score += 10;
      }

      // Budget matching
      if (budget === 'budget' && item.price < 12000) score += 5;
      else if (budget === 'moderate' && item.price >= 12000 && item.price <= 18000) score += 5;
      else if (budget === 'luxury' && item.price > 18000) score += 5;

      // Rating bonus
      score += item.rating * 2;

      return { item, score };
    });

    // Sort by score descending and return items
    scoredItems.sort((a, b) => b.score - a.score);
    const recommendedList = scoredItems.slice(0, 3).map(si => si.item);

    const prompt = `You are a travel recommender system. We have the following travel packages:
${JSON.stringify(recommendedList.map(i => ({ id: i._id, name: i.name, category: i.category, price: i.price })))}

For a user who likes: Interests: ${interests.join(', ')}, Budget: ${budget}.
Generate personalized descriptions explaining why each of these 3 specific packages is perfect for them.
Return a JSON object in this format:
{
  "recommendations": [
    { "itemId": "item_id", "reason": "Reason why this package fits your style." },
    ...
  ]
}
Only output the JSON object. Do not include markdown code blocks.`;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        // Merge AI reasons with the items
        return recommendedList.map(item => {
          const aiRec = parsed.recommendations?.find((r: any) => r.itemId === item._id);
          return {
            ...item,
            recommendationReason: aiRec?.reason || `This fits your interest in ${item.category} and budget range.`
          };
        });
      } catch (error) {
        console.error('Gemini API call failed for recommendations, using fallback reasoning:', error);
      }
    }

    // Fallback: merge static reasons with item metadata
    return recommendedList.map(item => ({
      ...item,
      recommendationReason: `This high-rated (${item.rating}★) ${item.category} package in ${item.location} perfectly fits your preference for ${interests.join('/') || 'nature & adventure'} within a ${budget} travel budget.`
    }));
  }

  // AI Feature 3: Listing Description Generator
  public static async generateListingDescription(params: {
    name: string;
    category: string;
    location: string;
    duration: number;
  }) {
    const { name, category, location, duration } = params;

    const prompt = `Act as a creative copywriter for a travel booking platform.
Generate listing copy for a travel package:
- Name: "${name}"
- Category: "${category}"
- Location: "${location}"
- Duration: ${duration} Days

Return a JSON object in this format:
{
  "seoTitle": "SEO-friendly Title",
  "shortDescription": "One-line catchy description.",
  "longDescription": "Detailed multi-paragraph description of the experience.",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "tags": ["tag1", "tag2", "tag3"],
  "suggestedItinerary": [
    { "day": 1, "title": "Day 1 Activity Focus", "activities": ["Activity 1", "Activity 2"] },
    ... (total ${duration} days)
  ]
}
Only output the JSON object. Do not include markdown code blocks.`;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (error) {
        console.error('Gemini API call failed for listing generator, using fallback:', error);
      }
    }

    // Fallback deterministic listing generator
    return this.getFallbackListingDescription(name, category, location, duration);
  }

  // --- DETAILED FALLBACK GENERATION LOGIC ---

  private static getFallbackTripPlan(destination: string, duration: number, budget: string, interests: string[], travelStyle: string) {
    const itinerary = [];
    for (let i = 1; i <= duration; i++) {
      if (i === 1) {
        itinerary.push({
          day: 1,
          title: `Arrival and Local Exploration in ${destination}`,
          activities: [
            `Arrive and check in to your accommodations`,
            `Brief orientation and meet with your local coordinator`,
            `Evening walk around the main central hub of ${destination} followed by dinner`
          ]
        });
      } else if (i === duration) {
        itinerary.push({
          day: i,
          title: `Souvenir Shopping and Departure`,
          activities: [
            `Early morning photography or relaxation session`,
            `Visit local traditional craft and food markets for souvenirs`,
            `Checkout and heading to departure transit station`
          ]
        });
      } else {
        itinerary.push({
          day: i,
          title: `Highlight Day: Exploring Major Attractions`,
          activities: [
            `Guided sightseeing tour focusing on ${interests.join(', ') || 'cultural landmarks'}`,
            `Enjoy a local traditional meal at a top-rated local venue`,
            `Interactive activity matching ${travelStyle} style (e.g. trekking, museum visit, boat cruise)`
          ]
        });
      }
    }

    return {
      itinerary,
      recommendedDestinations: [
        `${destination} Historic Quarter`,
        `Scenic Lookout Point near ${destination}`,
        `Local Artisan Marketplace`
      ],
      budgetTips: [
        budget === 'budget' ? 'Utilize local rickshaws and public buses instead of hiring private rentals.' : 'Consider hiring a professional private guide to gain inside access.',
        `Eat at authentic local diners rather than tourist-targeted resort restaurants to save 50% on food costs.`,
        `Book group-based boat or vehicle hire to split costs with fellow travelers.`
      ],
      packingSuggestions: [
        `Breathable light clothing suitable for humid weather`,
        `Comfortable trekking shoes and sandals`,
        `Power bank, universal adapter, and protective waterproof dry bag`,
        `Repellent, sunblock, and personal first-aid medications`
      ],
      safetyTips: [
        `Always check local weather warnings before booking boats or hikes.`,
        `Keep digital backups of your passport and identification securely saved on your phone.`,
        `Avoid walking in unlit remote alleys late at night; hire registered transport.`
      ]
    };
  }

  private static getFallbackListingDescription(name: string, category: string, location: string, duration: number) {
    const itinerary = [];
    for (let i = 1; i <= duration; i++) {
      itinerary.push({
        day: i,
        title: `Day ${i}: Exploring ${location}`,
        activities: [
          `Morning guided exploration of prominent landmarks`,
          `Traditional lunch featuring authentic local delicacies`,
          `Afternoon leisure or specialized activity based on ${category} theme`
        ]
      });
    }

    return {
      seoTitle: `Unforgettable ${duration}-Day ${name} in ${location}`,
      shortDescription: `Escape to the ultimate ${category} adventure in ${location} with curated itineraries and experienced guides.`,
      longDescription: `Experience the trip of a lifetime with our premium ${name} tour package. Located in the beautiful ${location}, this ${duration}-day package is designed to offer a perfect balance of excitement, cultural enrichment, and relaxation. Whether you are looking to scale green hills, explore cultural monuments, or unwind near beautiful views, our expert local guides will make sure your journey is comfortable, safe, and memorable.`,
      highlights: [
        `Fully guided tour of the best highlights in ${location}`,
        `Handpicked high-quality accommodations with scenic views`,
        `Delicious daily meals featuring authentic local cuisines`,
        `Hassle-free local transport and permit arrangements included`
      ],
      tags: [category.toLowerCase(), location.split(',')[0].toLowerCase().trim(), 'travel', 'holiday'],
      suggestedItinerary: itinerary
    };
  }
}
