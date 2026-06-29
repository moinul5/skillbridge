import { Request, Response, NextFunction } from 'express';
import dbService from '../services/db.service';

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.query;
    const reviews = await dbService.findReviews({ itemId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { itemId, rating, comment } = req.body;

    if (!itemId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Missing required review fields' });
    }

    const item = await dbService.findItemById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Travel package not found' });
    }

    // Retrieve active user info to grab avatar if available
    const userDetail = await dbService.findUserById(req.user.uid);

    const newReview = await dbService.createReview({
      itemId,
      userId: req.user.uid,
      userName: req.user.name || userDetail?.name || 'Anonymous Traveler',
      userAvatar: userDetail?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: Number(rating),
      comment
    });

    res.status(201).json({ success: true, message: 'Review posted successfully', data: newReview });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const review = await dbService.findReviews();
    const targetReview = review.find(r => r._id === id);

    if (!targetReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Auth check: creator or admin
    if (targetReview.userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete this review' });
    }

    await dbService.deleteReview(id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
