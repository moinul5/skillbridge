# TravelMate AI

TravelMate AI is a production-quality, AI-powered travel discovery, planning, and booking platform. The system leverages Next.js App Router for the client-side experience and Node.js/Express for API operations. It features responsive analytics dashboards, Zod form validations, and role-based access controls (RBAC) across three distinct groups: User, Manager, and Admin.

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS (with Class-based Dark Mode support)
- **State Management**: Zustand
- **Data Fetching**: Axios & TanStack React Query (v5)
- **Forms & Validation**: React Hook Form with Zod Resolvers
- **Data Visualizations**: Recharts
- **Authentication**: Firebase Client SDK integration (with mock account override for instant local testing)

### Backend
- **Server Runtime**: Node.js & Express
- **Programming Language**: TypeScript
- **Database**: MongoDB with Mongoose (automatically falls back to local JSON file storage if MongoDB credentials are unconfigured)
- **AI Integrations**: Google Generative AI (Gemini SDK) with deterministic itinerary adapters
- **Security Middlewares**: CORS, Helmet (headers shielding), Express JSON sanitization, in-memory rate limiting, and RBAC guards

---

## Features

1. **AI Trip Itinerary Planner**: Takes destination keywords, budget caps, guest counts, and styles to generate daily activities, packaging guides, and safety warnings.
2. **AI Smart Recommendations**: Suggests travel packages matching the user's saved profile preferences, using Gemini models or offline scoring fallback logic.
3. **AI Listing copy generator**: Empowers Managers to type a listing name and auto-draft SEO-friendly titles, bullet point highlights, tag strings, and daily plans.
4. **Role-Based Access Control Dashboards**:
   - **User**: Manage ongoing bookings, run AI itinerary planning, read custom suggestions, and modify profiles.
   - **Manager**: Manage listing CRUD details, run AI description text generation, inspect reservation requests (Approve/Reject), and track category booking charts.
   - **Admin**: Audit system-wide user listings and bookings, toggle administrative roles, delete booking logs, and review customer feedback comments.
5. **Interactive Explore Search**: Features debounced search inputs, price slider controls, star rating filters, location dropdowns, and pagination controls.
6. **Dual Mode Contrast**: Light and Dark mode options.

---

## Project Structure

```
d:/prompt eng/
  ├── backend/
  │   ├── src/
  │   │   ├── config/       # DB config, Firebase Admin setup, Seed data script
  │   │   ├── controllers/  # REST route controllers (Items, Bookings, Users, AI)
  │   │   ├── middlewares/  # Auth checking, role validation, error handlers
  │   │   ├── models/       # Mongoose schemas & types
  │   │   ├── services/     # AI service client, unified database service
  │   │   ├── routes/       # Express route mappings
  │   │   ├── types/        # TypeScript interfaces
  │   │   ├── app.ts        # App setup
  │   │   └── server.ts     # Main listening entry point
  │   ├── package.json
  │   └── tsconfig.json
  │
  ├── frontend/
  │   ├── app/              # Next.js App Router (pages & layouts)
  │   ├── components/       # Reusable components (ui, tables, charts, sections)
  │   ├── hooks/            # Custom hooks (useAuth, useTheme, useToast)
  │   ├── lib/              # Firebase client, Axios configuration
  │   ├── package.json
  │   ├── tailwind.config.js
  │   └── tsconfig.json
  │
  └── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- NPM or PNPM

### 1. Configure Environment Variables
Create `.env` files in both directories.

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/travelmate
FRONTEND_URL=http://localhost:3000
AI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini
# Optional Firebase Service Account credentials for verifying tokens:
# FIREBASE_PROJECT_ID=
# FIREBASE_PRIVATE_KEY=
# FIREBASE_CLIENT_EMAIL=
```

**Frontend (`frontend/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# Optional Firebase Client Config:
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=
```

*Note: If no MONGODB_URI is supplied, the database will automatically initialize as a local file: `backend/src/data/db.json`.*
*Note: If no Firebase configuration is supplied, the auth client will automatically run in local mock mode.*

### 2. Install and Run Backend
```bash
cd backend
npm install
npm run seed     # Seeds local JSON database or MongoDB
npm run dev      # Starts development server on port 5000
```

### 3. Install and Run Frontend
```bash
cd ../frontend
npm install
npm run dev      # Starts Next.js on port 3000
```

Open [http://localhost:3000](http://localhost:3000) on your browser to test the platform.

---

## Demo Credentials (Mock Auth Mode)

When utilizing local mock mode, you can log in instantly with the following credentials, or click the **One-click Demo Login** buttons on the `/login` screen:

### 1. User Account
- **Email**: `user@travelmate.ai`
- **Password**: `DemoUser123!`
- **Capabilities**: View dashboard, place bookings, edit profile, request cancellation, execute AI planning queries.

### 2. Manager Account
- **Email**: `manager@travelmate.ai`
- **Password**: `DemoManager123!`
- **Capabilities**: Create and edit own listings, generate descriptions using AI copywriters, approve or reject bookings made on own listings, review charts.

### 3. Admin Account
- **Email**: `admin@travelmate.ai`
- **Password**: `DemoAdmin123!`
- **Capabilities**: Change user roles, edit/delete all listings, delete bookings from database logs, delete customer reviews.

---

## API Endpoints

### Items (Packages)
- `GET /api/items` - Get all packages (supports pagination, search, category, location, rating, and sorting filters)
- `GET /api/items/:id` - Retrieve a single package by ID
- `POST /api/items` - Create a travel package listing (requires Manager/Admin)
- `PATCH /api/items/:id` - Edit listing details (requires Manager/Admin owners)
- `DELETE /api/items/:id` - Remove listing package (requires Manager/Admin owners)

### Bookings (Reservations)
- `GET /api/bookings` - List user reservations (Admin sees all, Manager sees owned items, User sees own)
- `POST /api/bookings` - Place a booking request
- `PATCH /api/bookings/:id` - Update status to Cancelled (User/Manager) or Confirmed (Manager/Admin)
- `DELETE /api/bookings/:id` - Delete booking record permanently (requires Admin)

### AI
- `POST /api/ai/trip-planner` - Generates custom day-by-day travel plans
- `POST /api/ai/recommendations` - Generates package recommendations based on profile interests
- `POST /api/ai/listing-description` - Autodrafts SEO copies and itineraries for package editors (requires Manager/Admin)

---

## Deployment Guidelines

### Frontend: Vercel / Firebase Hosting
1. If deploying to static Firebase Hosting, execute `next build` inside the `frontend` directory. Ensure `output: 'export'` is set in `next.config.js` if deploying fully static.
2. If deploying to dynamic Vercel, link the repository, specify the root directory as `frontend`, and configure `NEXT_PUBLIC_API_URL` pointing to your deployed Render backend.

### Backend: Vercel / Render / Railway
#### Deploying to Vercel (Recommended)
1. Link your GitHub repository in the Vercel dashboard.
2. Select the `backend` folder as the root directory of your project.
3. Vercel will automatically read [backend/vercel.json](file:///d:/prompt%20eng/backend/vercel.json) and compile the Express app via the [backend/api/index.ts](file:///d:/prompt%20eng/backend/api/index.ts) entry point.
4. Add the following Environment Variables in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string (highly recommended, as Vercel serverless runs on a read-only filesystem).
   - `AI_API_KEY`: Your Gemini API key.
   - `AI_PROVIDER`: `gemini`
   - `FRONTEND_URL`: Your deployed frontend Vercel URL.
   - `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`: Your Firebase Admin SDK keys (for live ID token verification).

#### Deploying to Render / Railway
1. Set the root build command to `npm run build` and start command to `npm start`.
2. Configure environment variables (`MONGODB_URI`, `AI_API_KEY`, etc.) inside the hosting settings.

---

## Known Limitations
1. AI generators operate in deterministic fallbacks in local offline mode if the Gemini API Key is missing.
2. In-memory rate limiting resets if the Node server restarts.
