import app, { initApp } from '../src/app';

let isInitialized = false;

const handler = async (req: any, res: any) => {
  // Ensure the database connection and auto-seeding runs
  if (!isInitialized) {
    try {
      await initApp();
      isInitialized = true;
    } catch (err) {
      console.error('Error during database initialization on Vercel:', err);
    }
  }
  
  // Forward request to Express app
  return app(req, res);
};

export default handler;
