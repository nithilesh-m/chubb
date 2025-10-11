const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  imageData: {
    type: String, // Base64 encoded image
    required: true
  },
  predictionResult: {
    pathogenicityScore: String,
    insulinResistanceRisk: String,
    confidence: String,
    analysis: Object
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
imageSchema.index({ userId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
