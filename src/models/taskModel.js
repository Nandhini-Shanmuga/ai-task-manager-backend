const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed','pending'],
    default: 'todo',
    required: true
  },
  aiInsights: {
    suggestedPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    },
    reasoning: String,
    estimatedEffort: String,
    recommendations: [String],
    analyzedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Task', TaskSchema);

