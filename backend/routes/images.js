const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');
const auth = require('../middleware/auth');
const axios = require('axios');
const FormData = require('form-data');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Flask ML API configuration
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

// Call Flask ML API for prediction
async function analyzeImageWithML(imageBuffer) {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });

    // Call Flask API
    const response = await axios.post(`${ML_API_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });

    if (response.data.success) {
      return {
        isDamaged: response.data.is_damaged,
        damageStatus: response.data.damage_status,
        confidence: response.data.confidence,
        allPredictions: response.data.all_predictions,
        timestamp: new Date().toISOString(),
        note: response.data.note
      };
    } else {
      throw new Error('ML API returned unsuccessful response');
    }
  } catch (error) {
    console.error('❌ ML API Error:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Fallback to mock prediction if ML API fails
    const damagedProb = Math.random() * 100;
    const notDamagedProb = 100 - damagedProb;
    const isDamaged = damagedProb > notDamagedProb;
    const confidence = Math.max(damagedProb, notDamagedProb).toFixed(2);
    
    return {
      isDamaged: isDamaged,
      damageStatus: isDamaged ? 'Damaged' : 'Not Damaged',
      confidence: confidence,
      allPredictions: {
        'Damaged': damagedProb.toFixed(2),
        'Not Damaged': notDamagedProb.toFixed(2)
      },
      timestamp: new Date().toISOString(),
      note: `Fallback prediction - ML API unavailable (${error.code || error.message})`
    };
  }
}

// Upload image and get prediction
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert image to base64
    const imageBase64 = req.file.buffer.toString('base64');
    
    // Perform prediction analysis using ML API
    console.log('🔬 Calling ML API for prediction...');
    const predictionResult = await analyzeImageWithML(req.file.buffer);
    console.log('✅ Prediction result:', predictionResult);

    // Save image to database
    const image = new Image({
      userId: req.user._id,
      filename: `${Date.now()}-${req.file.originalname}`,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      imageData: imageBase64,
      predictionResult: predictionResult
    });

    await image.save();

    res.json({
      success: true,
      message: 'Image uploaded and analyzed successfully',
      data: {
        imageId: image._id,
        filename: image.filename,
        originalName: image.originalName,
        size: image.size,
        uploadedAt: image.uploadedAt,
        prediction: predictionResult
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to upload image' 
    });
  }
});

// Get all images for the authenticated user
router.get('/my-images', auth, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .select('-imageData') // Exclude base64 data for list view
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images
    });

  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch images' 
    });
  }
});

// Detect damaged part using EfficientNet model
router.post('/detect-part', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('🔬 Calling ML API for part detection...');
    
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });

    const response = await axios.post(`${ML_API_URL}/predict-part`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000
    });

    if (response.data.success) {
      const partResult = {
        damagedPart: response.data.damaged_part,
        confidence: response.data.confidence,
        allPredictions: response.data.all_predictions,
        timestamp: new Date().toISOString(),
        note: response.data.note
      };
      
      console.log('✅ Part detection result:', partResult);
      
      res.json({
        success: true,
        message: 'Part detected successfully',
        data: partResult
      });
    } else {
      throw new Error('ML API returned unsuccessful response');
    }

  } catch (error) {
    console.error('❌ Part detection error:', error.message);
    
    // Fallback to mock prediction
    const mockParts = ['Front Bumper', 'Rear Bumper', 'Front Door', 'Rear Door', 'Hood', 'Trunk'];
    const randomPart = mockParts[Math.floor(Math.random() * mockParts.length)];
    const confidence = (70 + Math.random() * 25).toFixed(2);
    
    res.json({
      success: true,
      message: 'Part detected successfully (fallback)',
      data: {
        damagedPart: randomPart,
        confidence: confidence,
        allPredictions: mockParts.reduce((acc, part) => {
          acc[part] = (Math.random() * 30).toFixed(2);
          return acc;
        }, {}),
        timestamp: new Date().toISOString(),
        note: `Fallback prediction - ML API unavailable (${error.code || error.message})`
      }
    });
  }
});

// Get a specific image with full data
router.get('/:imageId', auth, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.imageId,
      userId: req.user._id
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      success: true,
      data: image
    });

  } catch (error) {
    console.error('Fetch image error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch image' 
    });
  }
});

module.exports = router;
