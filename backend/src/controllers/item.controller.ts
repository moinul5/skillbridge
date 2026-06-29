import { Request, Response, NextFunction } from 'express';
import dbService from '../services/db.service';
import { Item } from '../types';

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, rating, location, sort, page = '1', limit = '10' } = req.query;

    const filters = {
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      location,
      sort
    };

    const allItems = await dbService.findItems(filters);

    // Manual Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginatedItems = allItems.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedItems,
      pagination: {
        total: allItems.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(allItems.length / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await dbService.findItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Travel package not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const itemData = req.body;
    
    // Auto-set the managerId to the logged in manager
    const newItem = await dbService.createItem({
      ...itemData,
      managerId: req.user.uid,
      rating: 5,
      reviewsCount: 0
    });

    res.status(201).json({ success: true, message: 'Travel package created successfully', data: newItem });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const existingItem = await dbService.findItemById(id);

    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Travel package not found' });
    }

    // Role protection: only item manager or admin can edit
    if (req.user.role !== 'admin' && existingItem.managerId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
    }

    const updatedItem = await dbService.updateItem(id, req.body);
    res.status(200).json({ success: true, message: 'Travel package updated successfully', data: updatedItem });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const existingItem = await dbService.findItemById(id);

    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Travel package not found' });
    }

    // Role protection: only item manager or admin can delete
    if (req.user.role !== 'admin' && existingItem.managerId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this listing' });
    }

    await dbService.deleteItem(id);
    res.status(200).json({ success: true, message: 'Travel package deleted successfully' });
  } catch (error) {
    next(error);
  }
};
