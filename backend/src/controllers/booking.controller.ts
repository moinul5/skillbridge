import { Request, Response, NextFunction } from 'express';
import dbService from '../services/db.service';

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let bookings = [];

    if (req.user.role === 'admin') {
      // Admins see all bookings
      bookings = await dbService.findBookings();
    } else if (req.user.role === 'manager') {
      // Managers see bookings for their own items
      const items = await dbService.findItems();
      const managerItemIds = items.filter(i => i.managerId === req.user?.uid).map(i => i._id);
      
      const allBookings = await dbService.findBookings();
      bookings = allBookings.filter(b => managerItemIds.includes(b.itemId));
    } else {
      // Users see their own bookings
      bookings = await dbService.findBookings({ userId: req.user.uid });
    }

    // Populate item titles and basic details for frontend convenience
    const items = await dbService.findItems();
    const enrichedBookings = bookings.map(booking => {
      const item = items.find(i => i._id === booking.itemId);
      return {
        ...booking,
        itemDetails: item ? { name: item.name, location: item.location, image: item.images[0], price: item.price } : null
      };
    });

    res.status(200).json({ success: true, data: enrichedBookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const booking = await dbService.findBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const item = await dbService.findItemById(booking.itemId);

    // Permission check: admin, booking creator, or item manager
    const isCreator = booking.userId === req.user.uid;
    const isManager = item?.managerId === req.user.uid;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isManager && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to booking details' });
    }

    res.status(200).json({
      success: true,
      data: {
        ...booking,
        itemDetails: item ? { name: item.name, location: item.location, image: item.images[0] } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { itemId, startDate, endDate, guests, contactName, contactEmail, contactPhone, notes } = req.body;

    const item = await dbService.findItemById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Travel package not found' });
    }

    // Dynamic price calculation
    const guestCount = Number(guests) || 1;
    const totalPrice = item.price * guestCount;

    const booking = await dbService.createBooking({
      itemId,
      userId: req.user.uid,
      startDate,
      endDate,
      guests: guestCount,
      totalPrice,
      status: 'pending',
      contactName,
      contactEmail,
      contactPhone,
      notes
    });

    res.status(201).json({ success: true, message: 'Booking placed successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const booking = await dbService.findBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const item = await dbService.findItemById(booking.itemId);

    // Permission checks:
    // - Managers can confirm or cancel their listing bookings
    // - Users can cancel their own bookings (but not confirm them)
    // - Admins can do anything
    const isCreator = booking.userId === req.user.uid;
    const isManager = item?.managerId === req.user.uid;
    const isAdmin = req.user.role === 'admin';

    if (status === 'cancelled') {
      if (!isCreator && !isManager && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden: You cannot cancel this booking' });
      }
    } else {
      // e.g. confirming a booking
      if (!isManager && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden: Only managers/admins can modify booking status' });
      }
    }

    const updatedBooking = await dbService.updateBooking(id, { status });
    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, data: updatedBooking });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const booking = await dbService.findBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only administrators can delete bookings' });
    }

    await dbService.deleteBooking(id);
    res.status(200).json({ success: true, message: 'Booking record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
