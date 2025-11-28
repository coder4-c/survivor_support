const mongoose = require('mongoose');
const crypto = require('crypto');

const evidenceSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  filename: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  mimetype: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  hash: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  encryptionKey: {
    type: String,
    required: true,
    trim: true
  },
  uploadToken: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  accessCode: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  uploadedBy: {
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    }
  },
  metadata: {
    uploaderName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    uploaderEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 255
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 50
    }]
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAccessed: {
    type: Date
  },
  accessLog: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      trim: true
    },
    action: {
      type: String,
      enum: ['upload', 'download', 'view', 'delete'],
      required: true
    },
    userAgent: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.encryptionKey;
      delete ret.accessCode;
      delete ret.uploadToken;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better performance
evidenceSchema.index({ hash: 1 });
evidenceSchema.index({ uploadToken: 1 });
evidenceSchema.index({ status: 1, createdAt: -1 });
evidenceSchema.index({ 'metadata.uploaderEmail': 1 });
evidenceSchema.index({ 'metadata.tags': 1 });

// Virtual for file extension
evidenceSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Virtual for formatted size
evidenceSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for age
evidenceSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Methods
evidenceSchema.methods.generateDownloadToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

evidenceSchema.methods.logAccess = function(action, ipAddress, userAgent) {
  this.accessLog.push({
    timestamp: new Date(),
    ipAddress,
    action,
    userAgent
  });
  
  if (action === 'download') {
    this.downloadCount += 1;
  }
  
  this.lastAccessed = new Date();
  return this.save();
};

evidenceSchema.methods.encryptFile = function() {
  // In a real implementation, this would encrypt the actual file
  // For now, we'll just generate a hash and encryption key
  this.hash = crypto.createHash('sha256').update(this.uploadToken + Date.now()).digest('hex');
  this.encryptionKey = crypto.randomBytes(32).toString('hex');
  return this.save();
};

evidenceSchema.methods.markAsDeleted = function() {
  this.status = 'deleted';
  this.uploadToken = crypto.randomBytes(32).toString('hex');
  return this.save();
};

// Static methods
evidenceSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$size' },
        avgFileSize: { $avg: '$size' },
        uniqueUploaders: { $addToSet: '$metadata.uploaderEmail' }
      }
    },
    {
      $addFields: {
        uniqueUploaderCount: { $size: '$uniqueUploaders' }
      }
    }
  ]);
};

evidenceSchema.statics.findByUploadToken = function(token) {
  return this.findOne({ uploadToken: token, status: 'active' });
};

// Pre-save middleware
evidenceSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate unique filename if not provided
    if (!this.filename) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const extension = this.originalName.split('.').pop();
      this.filename = `evidence_${timestamp}_${random}.${extension}`;
    }
  }
  next();
});

module.exports = mongoose.model('Evidence', evidenceSchema);