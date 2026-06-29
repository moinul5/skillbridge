import { Request, Response, NextFunction } from 'express';
import dbService from '../services/db.service';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin authorization required' });
    }

    const users = await dbService.findUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let user = await dbService.findUserById(req.user.uid);
    if (!user) {
      // If user profile is not found in database but auth token was verified,
      // create the user automatically in the local DB.
      user = await dbService.createUser({
        _id: req.user.uid,
        email: req.user.email,
        name: req.user.name || 'Traveler',
        role: req.user.role,
        createdAt: new Date().toISOString()
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { name, phoneNumber, avatarUrl, preferences } = req.body;

    const updatedUser = await dbService.updateUser(req.user.uid, {
      name,
      phoneNumber,
      avatarUrl,
      preferences
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin authorization required' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Do not allow updating own role to prevent lockout
    if (id === req.user.uid) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own administrative role' });
    }

    const updatedUser = await dbService.updateUser(id, { role });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
