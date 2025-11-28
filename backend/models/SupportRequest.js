const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 255
  },
  type: {
    type: String,
    required: true,
    enum: ['counseling', 'legal', 'medical', 'emergency', 'other'],
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    author: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
supportRequestSchema.index({ createdAt: -1 });
supportRequestSchema.index({ status: 1, priority: -1 });
supportRequestSchema.index({ type: 1 });
supportRequestSchema.index({ email: 1 });

// Virtual for response time
supportRequestSchema.virtual('responseTime').get(function() {
  if (this.resolvedAt && this.createdAt) {
    return this.resolvedAt - this.createdAt;
  }
  return null;
});

// Methods
supportRequestSchema.methods.markAsResolved = function(assignedTo) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  if (assignedTo) {
    this.assignedTo = assignedTo;
  }
  return this.save();
};

supportRequestSchema.methods.addNote = function(content, author) {
  this.notes.push({
    content,
    author: author || 'System'
  });
  return this.save();
};

// Static methods
supportRequestSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        urgent: {
          $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('SupportRequest', supportRequestSchema);