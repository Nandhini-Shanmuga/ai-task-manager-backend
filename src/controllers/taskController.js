const { validationResult } = require('express-validator');
const Task = require('../models/taskModel');
const { AppError } = require('../utils/appError');
const { OpenAIService } = require('../services/openaiService');

class TaskController {
  // Create Task
  static async createTask(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { title, description, priority, dueDate, status } = req.body;

      // Create task
      const task = await Task.create({
        user: req.user._id,
        title,
        description,
        priority,
        dueDate,
        status: status || 'todo'
      });

      // Get AI insights 
      OpenAIService.analyzeTask(title, description)
        .then(aiInsights => {
          task.aiInsights = {
            ...aiInsights,
            analyzedAt: new Date()
          };
          return task.save();
        })
        .catch(err => console.error('AI analysis failed:', err.message));

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Tasks details
 static async getAllTasks(req, res, next) {
  try {
    const { status, priority, sortBy, order, search } = req.query;
    
    // Build query
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOption = sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : { createdAt: -1 };

    const tasks = await Task.find(query).sort(sortOption);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
}


  // Get Single Task
  static async getTaskById(req, res, next) {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Task
  static async updateTask(req, res, next) {
    try {
      const { title, description, priority, dueDate, status } = req.body;

      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      // Update fields
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (status !== undefined) task.status = status;

      await task.save();

      // Re-analyze with AI if title or description changed
      if (title !== undefined || description !== undefined) {
        OpenAIService.analyzeTask(task.title, task.description)
          .then(aiInsights => {
            task.aiInsights = {
              ...aiInsights,
              analyzedAt: new Date()
            };
            return task.save();
          })
          .catch(err => console.error('AI re-analysis failed:', err.message));
      }

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Task
  static async deleteTask(req, res, next) {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get AI Insights for a specific task
  static async getAIInsights(req, res, next) {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      // Generate fresh AI insights
      const aiInsights = await OpenAIService.analyzeTask(task.title, task.description);
      
      // Update task with new insights
      task.aiInsights = {
        ...aiInsights,
        analyzedAt: new Date()
      };
      await task.save();

      res.json({
        success: true,
        data: aiInsights
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
