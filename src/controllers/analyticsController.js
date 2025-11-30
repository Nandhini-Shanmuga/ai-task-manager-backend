const Task = require('../models/taskModel');
const { AppError } = require('../utils/appError');

class AnalyticsController {
  // Get Dashboard Summary
  static async getDashboardSummary(req, res, next) {
    try {
      const userId = req.user._id;

      // Get all tasks for user
      const allTasks = await Task.find({ user: userId });

      // Calculate statistics
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
      const todoTasks = allTasks.filter(t => t.status === 'todo').length;
      const pendingTasks = allTasks.filter(t => t.status === 'pending').length;

      
      // Priority breakdown
      const priorityBreakdown = {
        urgent: allTasks.filter(t => t.priority === 'urgent').length,
        high: allTasks.filter(t => t.priority === 'high').length,
        medium: allTasks.filter(t => t.priority === 'medium').length,
        low: allTasks.filter(t => t.priority === 'low').length
      };
       //  AI Suggested Priority 
       const aiSuggestedBreakdown = {
      urgent: allTasks.filter(t => t.aiInsights?.suggestedPriority === 'urgent').length,
      high: allTasks.filter(t => t.aiInsights?.suggestedPriority === 'high').length,
      medium: allTasks.filter(t => t.aiInsights?.suggestedPriority === 'medium').length,
      low: allTasks.filter(t => t.aiInsights?.suggestedPriority === 'low').length
    };
      // Overdue tasks
      const now = new Date();
      const overdueTasks = allTasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < now && 
        t.status !== 'completed'
      ).length;

      // Due soon (next 7 days)
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const dueSoonTasks = allTasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) >= now && 
        new Date(t.dueDate) <= weekFromNow &&
        t.status !== 'completed'
      ).length;

      // Completion rate
      const completionRate = totalTasks > 0 
        ? ((completedTasks / totalTasks) * 100).toFixed(1) 
        : 0;

      res.json({
        success: true,
        data: {
          summary: {
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            overdueTasks,
            dueSoonTasks,
            aiSuggestedBreakdown,
            completionRate: parseFloat(completionRate)
          },
          priorityBreakdown,
          statusBreakdown: {
            todo: todoTasks,
            'in-progress': inProgressTasks,
            completed: completedTasks
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Task Statistics by Date Range
  static async getTaskStatsByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user._id;

      const query = { user: userId };

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const tasks = await Task.find(query);

      // Group by date
      const tasksByDate = tasks.reduce((acc, task) => {
        const date = task.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, count: 0, completed: 0 };
        }
        acc[date].count++;
        if (task.status === 'completed') {
          acc[date].completed++;
        }
        return acc;
      }, {});

      res.json({
        success: true,
        data: Object.values(tasksByDate).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        )
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;
