import { User } from '../models/User.js';
import { Teacher } from '../models/Teacher.js';

export const getStats = async (req, res, next) => {
  try {
    // Get all users and teachers
    const [users, teachers] = await Promise.all([
      User.find({ role: 'user' }),
      Teacher.find()
    ]);

    // Get monthly data (last 6 months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    // Calculate monthly stats
    const monthlyStats = last6Months.map((month, index) => {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - (5 - index));
      monthStart.setDate(1);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      return {
        month,
        teachers: teachers.filter(t => 
          new Date(t.createdAt) >= monthStart && 
          new Date(t.createdAt) < monthEnd
        ).length,
        students: users.filter(u => 
          new Date(u.createdAt) >= monthStart && 
          new Date(u.createdAt) < monthEnd
        ).length
      };
    });

    // Calculate status distribution
    const statusStats = {
      teachers: {
        active: teachers.filter(t => t.isApproved).length,
        pending: teachers.filter(t => !t.isApproved).length,
        total: teachers.length
      },
      students: {
        active: users.filter(u => u.isApproved).length,
        pending: users.filter(u => !u.isApproved).length,
        total: users.length
      }
    };

    res.status(200).json({
      success: true,
      data: {
        monthlyStats,
        statusStats
      }
    });
  } catch (error) {
    next(error);
  }
}; 