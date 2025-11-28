const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const Evidence = require('../models/Evidence');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const ensureUploadsDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
};

// Configure multer for secure file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `evidence_${uniqueSuffix}_${basename}${extension}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];

  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: fileFilter
});

// Upload evidence files
router.post('/upload-evidence', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded'
      });
    }

    const uploadedEvidence = [];
    const { ip, headers } = req;

    // Process each uploaded file
    for (const file of req.files) {
      try {
        // Generate file hash for integrity
        const fileBuffer = await fs.readFile(file.path);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        // Create evidence record
        const evidence = new Evidence({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          hash: hash,
          uploadedBy: {
            ipAddress: ip,
            userAgent: headers['user-agent']
          },
          metadata: {
            description: req.body.description || '',
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
          }
        });

        await evidence.save();

        // Log access
        await evidence.logAccess('upload', ip, headers['user-agent']);

        uploadedEvidence.push({
          id: evidence._id,
          originalName: evidence.originalName,
          size: evidence.formattedSize,
          uploadToken: evidence.uploadToken,
          status: evidence.status
        });

      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        
        // Clean up file if database save failed
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting failed upload:', unlinkError);
        }
      }
    }

    if (uploadedEvidence.length === 0) {
      return res.status(500).json({
        error: 'Failed to process any files. Please try again.'
      });
    }

    console.log(`Evidence upload: ${uploadedEvidence.length} file(s) from ${ip}`);

    res.json({
      success: true,
      message: `${uploadedEvidence.length} file(s) uploaded securely. Your evidence is now protected.`,
      uploadedFiles: uploadedEvidence
    });

  } catch (error) {
    console.error('Error uploading evidence:', error);
    res.status(500).json({
      error: 'Failed to upload files. Please try again later.'
    });
  }
});

// Get evidence by upload token (for download/access)
router.get('/download/:uploadToken', async (req, res) => {
  try {
    const { uploadToken } = req.params;
    const { ip, headers } = req;

    const evidence = await Evidence.findByUploadToken(uploadToken);
    
    if (!evidence || evidence.status !== 'active') {
      return res.status(404).json({
        error: 'Evidence not found or access denied'
      });
    }

    // Log access
    await evidence.logAccess('download', ip, headers['user-agent']);

    // Check if file still exists
    try {
      await fs.access(evidence.path);
    } catch (error) {
      return res.status(404).json({
        error: 'File not found on server'
      });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${evidence.originalName}"`);
    res.setHeader('Content-Type', evidence.mimetype);
    res.setHeader('Content-Length', evidence.size);

    // Stream the file
    const fileStream = require('fs').createReadStream(evidence.path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading evidence:', error);
    res.status(500).json({
      error: 'Failed to download file'
    });
  }
});

// Get evidence metadata (without file)
router.get('/metadata/:uploadToken', async (req, res) => {
  try {
    const { uploadToken } = req.params;

    const evidence = await Evidence.findByUploadToken(uploadToken);
    
    if (!evidence || evidence.status !== 'active') {
      return res.status(404).json({
        error: 'Evidence not found or access denied'
      });
    }

    res.json({
      id: evidence._id,
      originalName: evidence.originalName,
      size: evidence.formattedSize,
      mimetype: evidence.mimetype,
      uploadDate: evidence.createdAt,
      downloadCount: evidence.downloadCount,
      status: evidence.status
    });

  } catch (error) {
    console.error('Error fetching evidence metadata:', error);
    res.status(500).json({
      error: 'Failed to fetch evidence metadata'
    });
  }
});

// Get evidence statistics (admin route)
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await Evidence.getStats();
    
    res.json({
      stats: stats[0] || {
        totalFiles: 0,
        totalSize: 0,
        avgFileSize: 0,
        uniqueUploaderCount: 0
      }
    });

  } catch (error) {
    console.error('Error fetching evidence stats:', error);
    res.status(500).json({
      error: 'Failed to fetch evidence statistics'
    });
  }
});

// Delete evidence (admin route)
router.delete('/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    
    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence not found'
      });
    }

    // Mark as deleted instead of immediate deletion
    await evidence.markAsDeleted();

    res.json({
      success: true,
      message: 'Evidence marked as deleted'
    });

  } catch (error) {
    console.error('Error deleting evidence:', error);
    res.status(500).json({
      error: 'Failed to delete evidence'
    });
  }
});

// Clean up orphaned files (admin route)
router.post('/admin/cleanup', async (req, res) => {
  try {
    const deletedEvidence = await Evidence.find({ status: 'deleted' });
    let cleanedFiles = 0;

    for (const evidence of deletedEvidence) {
      try {
        await fs.unlink(evidence.path);
        cleanedFiles++;
      } catch (error) {
        console.warn(`Could not delete file ${evidence.path}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: `Cleaned up ${cleanedFiles} orphaned files`
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({
      error: 'Failed to clean up orphaned files'
    });
  }
});

module.exports = router;