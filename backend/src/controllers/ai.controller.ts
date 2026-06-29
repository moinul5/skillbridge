import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import dbService from '../services/db.service';

export const generateTripPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destination, budget, startDate, endDate, guests, interests, travelStyle } = req.body;

    if (!destination || !budget || !startDate || !endDate || !guests) {
      return res.status(400).json({ success: false, message: 'Missing required trip planner parameters' });
    }

    const tripPlan = await AIService.generateTripPlan({
      destination,
      budget,
      startDate,
      endDate,
      guests: Number(guests),
      interests: Array.isArray(interests) ? interests : [],
      travelStyle: travelStyle || 'Standard'
    });

    res.status(200).json({ success: true, data: tripPlan });
  } catch (error) {
    next(error);
  }
};

export const getSmartRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await dbService.findUserById(req.user.uid);
    const availableItems = await dbService.findItems();

    const preferences = user?.preferences || { interests: [], budget: 'moderate', travelStyle: 'Relaxing' };

    const recommendations = await AIService.getRecommendations({
      userId: req.user.uid,
      preferences,
      availableItems
    });

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

export const generateListingDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Forbidden: Managers or Admins only' });
    }

    const { name, category, location, duration } = req.body;

    if (!name || !category || !location || !duration) {
      return res.status(400).json({ success: false, message: 'Missing required listing parameters' });
    }

    const listingDescription = await AIService.generateListingDescription({
      name,
      category,
      location,
      duration: Number(duration)
    });

    res.status(200).json({ success: true, data: listingDescription });
  } catch (error) {
    next(error);
  }
};
