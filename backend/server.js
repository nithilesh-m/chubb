const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample protein sequence analysis function
function analyzeProteinSequence(sequence) {
  // This is a mock analysis - in a real app, you'd use ML models
  const aminoAcids = sequence.toUpperCase();
  const length = aminoAcids.length;
  
  // Basic analysis
  const hydrophobic = (aminoAcids.match(/[AILMFWYV]/g) || []).length;
  const hydrophilic = (aminoAcids.match(/[RNDQEHKST]/g) || []).length;
  const aromatic = (aminoAcids.match(/[FWY]/g) || []).length;
  const charged = (aminoAcids.match(/[RKDE]/g) || []).length;
  
  // Calculate percentages
  const hydrophobicPercent = (hydrophobic / length) * 100;
  const hydrophilicPercent = (hydrophilic / length) * 100;
  const aromaticPercent = (aromatic / length) * 100;
  const chargedPercent = (charged / length) * 100;
  
  // Mock pathogenicity score (0-100)
  const pathogenicityScore = Math.min(100, Math.max(0, 
    (hydrophobicPercent * 0.3) + 
    (aromaticPercent * 0.4) + 
    (chargedPercent * 0.2) + 
    (Math.random() * 10)
  ));
  
  // Mock insulin resistance prediction
  const insulinResistanceRisk = pathogenicityScore > 70 ? 'High' : 
                               pathogenicityScore > 40 ? 'Medium' : 'Low';
  
  return {
    sequence: aminoAcids,
    length: length,
    analysis: {
      hydrophobic: {
        count: hydrophobic,
        percentage: hydrophobicPercent.toFixed(2)
      },
      hydrophilic: {
        count: hydrophilic,
        percentage: hydrophilicPercent.toFixed(2)
      },
      aromatic: {
        count: aromatic,
        percentage: aromaticPercent.toFixed(2)
      },
      charged: {
        count: charged,
        percentage: chargedPercent.toFixed(2)
      }
    },
    pathogenicityScore: pathogenicityScore.toFixed(2),
    insulinResistanceRisk: insulinResistanceRisk,
    confidence: (95 + Math.random() * 5).toFixed(2),
    timestamp: new Date().toISOString()
  };
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/images', require('./routes/images'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'T2D Insulin Prediction API',
    version: '1.0.0',
    status: 'running'
  });
});

app.post('/api/predict', (req, res) => {
  try {
    const { sequence } = req.body;
    
    if (!sequence) {
      return res.status(400).json({ 
        error: 'Protein sequence is required' 
      });
    }
    
    // Validate sequence (only amino acid letters)
    const validAminoAcids = /^[ACDEFGHIKLMNPQRSTVWY]+$/i;
    if (!validAminoAcids.test(sequence)) {
      return res.status(400).json({ 
        error: 'Invalid protein sequence. Only standard amino acid letters are allowed.' 
      });
    }
    
    if (sequence.length < 10) {
      return res.status(400).json({ 
        error: 'Protein sequence must be at least 10 amino acids long' 
      });
    }
    
    if (sequence.length > 10000) {
      return res.status(400).json({ 
        error: 'Protein sequence is too long (max 10,000 amino acids)' 
      });
    }
    
    // Analyze the sequence
    const result = analyzeProteinSequence(sequence);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Internal server error during prediction' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 T2D Insulin Prediction API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔬 Prediction endpoint: http://localhost:${PORT}/api/predict`);
});
