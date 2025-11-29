const express = require('express');
const TaskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { taskValidation } = require('../middleware/validators');

const router = express.Router();

  // All routes are protected
  router.use(protect);

  // Create task - /api/task/create 
  router.post('/create', taskValidation, TaskController.createTask);

  // Get all tasks - /api/task/ 
  router.get('/', TaskController.getAllTasks);

  // Get single task -/api/task/:id 
  router.get('/:id', TaskController.getTaskById);

  // Update task - /api/task/update/:id 
  router.put('/update/:id', TaskController.updateTask);

  // Delete task - /api/task/delete/:id 
  router.delete('/delete/:id', TaskController.deleteTask);

  // Get AI insights - /api/task/:id/ai-insights
  router.get('/:id/ai-insights', TaskController.getAIInsights);

module.exports = router;
