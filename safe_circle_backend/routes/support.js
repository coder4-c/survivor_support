const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportRequest = require('../models/SupportRequest');

const router = express.Router();

// Validation rules
const supportRequestValidation = [
  body('type')
    .isIn(['counseling', 'legal', 'medical', 'emergency', 'other'])
    .withMessage('Invalid support type'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address')
];

// Create support request
router.post('/support-request', supportRequestValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, type, message } = req.body;
    const { ip, headers } = req;

    // Create new support request
    const supportRequest = new SupportRequest({
      name: name || null,
      email: email || null,
      type,
      message,
      ipAddress: ip,
      userAgent: headers['user-agent']
    });

    await supportRequest.save();

    // Log the request (for security monitoring)
    console.log(`New support request: ${type} from ${email || 'anonymous'} at ${new Date().toISOString()}`);

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully. We will contact you soon.',
      requestId: supportRequest._id
    });

  } catch (error) {
    console.error('Error creating support request:', error);
    res.status(500).json({
      error: 'Failed to submit support request',
      message: 'Please try again later'
    });
  }
});

// Get support requests (admin route - would need authentication in production)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, sort = '-createdAt' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const supportRequests = await SupportRequest.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-ipAddress -userAgent'); // Hide sensitive data

    const total = await SupportRequest.countDocuments(query);

    res.json({
      supportRequests,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching support requests:', error);
    res.status(500).json({
      error: 'Failed to fetch support requests'
    });
  }
});

// Get specific support request (admin route)
router.get('/:id', async (req, res) => {
  try {
    const supportRequest = await SupportRequest.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({
        error: 'Support request not found'
      });
    }

    res.json(supportRequest);

  } catch (error) {
    console.error('Error fetching support request:', error);
    res.status(500).json({
      error: 'Failed to fetch support request'
    });
  }
});

// Update support request status (admin route)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const supportRequest = await SupportRequest.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({
        error: 'Support request not found'
      });
    }

    if (status) supportRequest.status = status;
    if (priority) supportRequest.priority = priority;
    if (assignedTo) supportRequest.assignedTo = assignedTo;
    
    if (status === 'resolved') {
      supportRequest.resolvedAt = new Date();
    }

    await supportRequest.save();

    res.json({
      success: true,
      message: 'Support request updated successfully',
      supportRequest
    });

  } catch (error) {
    console.error('Error updating support request:', error);
    res.status(500).json({
      error: 'Failed to update support request'
    });
  }
});

// Add note to support request (admin route)
router.post('/:id/notes', async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: 'Note content is required'
      });
    }

    const supportRequest = await SupportRequest.findById(req.params.id);
    
    if (!supportRequest) {
      return res.status(404).json({
        error: 'Support request not found'
      });
    }

    supportRequest.addNote(content, author);

    res.json({
      success: true,
      message: 'Note added successfully',
      supportRequest
    });

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      error: 'Failed to add note'
    });
  }
});

// Get support request statistics (admin route)
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await SupportRequest.getStats();
    
    res.json({
      stats: stats[0] || {
        total: 0,
        pending: 0,
        resolved: 0,
        urgent: 0
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;