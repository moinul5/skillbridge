import { Request, Response, NextFunction } from 'express';
import dbService from '../services/db.service';
import { Booking } from '../types';

export const getAnalyticsOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const allItems = await dbService.findItems();
    const allBookings = await dbService.findBookings();
    const allUsers = await dbService.findUsers();
    const allReviews = await dbService.findReviews();

    if (req.user.role === 'admin') {
      // Platform-wide analytics
      const totalRevenue = allBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const ratingSum = allItems.reduce((sum, item) => sum + item.rating, 0);
      const avgRating = allItems.length ? Number((ratingSum / allItems.length).toFixed(1)) : 5.0;

      res.status(200).json({
        success: true,
        data: {
          totalPackages: allItems.length,
          totalBookings: allBookings.length,
          totalUsers: allUsers.length,
          totalRevenue,
          avgRating,
          recentBookingsCount: allBookings.filter(b => {
            const bDate = new Date(b.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return bDate >= weekAgo;
          }).length
        }
      });
    } else if (req.user.role === 'manager') {
      // Manager-specific analytics
      const myItems = allItems.filter(i => i.managerId === req.user?.uid);
      const myItemIds = myItems.map(i => i._id);
      const myBookings = allBookings.filter(b => myItemIds.includes(b.itemId));
      
      const totalRevenue = myBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const ratingSum = myItems.reduce((sum, item) => sum + item.rating, 0);
      const avgRating = myItems.length ? Number((ratingSum / myItems.length).toFixed(1)) : 5.0;

      res.status(200).json({
        success: true,
        data: {
          totalPackages: myItems.length,
          totalBookings: myBookings.length,
          totalRevenue,
          avgRating,
          recentBookingsCount: myBookings.filter(b => {
            const bDate = new Date(b.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return bDate >= weekAgo;
          }).length
        }
      });
    } else {
      // Simple user analytics
      const myBookings = allBookings.filter(b => b.userId === req.user?.uid);
      const myTotalSpend = myBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      res.status(200).json({
        success: true,
        data: {
          totalBookings: myBookings.length,
          totalSpend: myTotalSpend,
          activeBookings: myBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getBookingCharts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const allItems = await dbService.findItems();
    const allBookings = await dbService.findBookings();

    let myBookings = allBookings;

    if (req.user.role === 'manager') {
      const myItemIds = allItems.filter(i => i.managerId === req.user?.uid).map(i => i._id);
      myBookings = allBookings.filter(b => myItemIds.includes(b.itemId));
    } else if (req.user.role === 'user') {
      myBookings = allBookings.filter(b => b.userId === req.user?.uid);
    }

    // Group bookings by category for Bar Chart
    const categoryStats: { [key: string]: { count: number; revenue: number } } = {};
    myBookings.forEach(booking => {
      const item = allItems.find(i => i._id === booking.itemId);
      const category = item?.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, revenue: 0 };
      }
      categoryStats[category].count += 1;
      if (booking.status === 'confirmed') {
        categoryStats[category].revenue += booking.totalPrice;
      }
    });

    const categoryChartData = Object.entries(categoryStats).map(([name, data]) => ({
      name,
      bookings: data.count,
      revenue: data.revenue
    }));

    // Group bookings by Month for Line Chart (Last 6 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: { [key: string]: { bookings: number; revenue: number } } = {};

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthlyStats[label] = { bookings: 0, revenue: 0 };
    }

    myBookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const label = `${months[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
      // Only record if month exists in our recent 6 months map
      if (monthlyStats[label] !== undefined) {
        monthlyStats[label].bookings += 1;
        if (booking.status === 'confirmed') {
          monthlyStats[label].revenue += booking.totalPrice;
        }
      }
    });

    const monthlyChartData = Object.entries(monthlyStats).map(([name, data]) => ({
      name,
      bookings: data.bookings,
      revenue: data.revenue
    }));

    res.status(200).json({
      success: true,
      data: {
        categoryChart: categoryChartData,
        monthlyChart: monthlyChartData
      }
    });
  } catch (error) {
    next(error);
  }
};
