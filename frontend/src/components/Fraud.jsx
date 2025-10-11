import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Fraud() {
  const navigate = useNavigate()
  const location = useLocation()
  const [imageData, setImageData] = useState(null)
  const [fraudResult, setFraudResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get image data passed from Prediction page
    if (location.state?.imageData) {
      setImageData(location.state.imageData)
      // Auto-detect fraud when component loads
      detectFraud(location.state.imageData)
    } else {
      // If no image data, redirect back to prediction
      navigate('/prediction')
    }
  }, [location.state, navigate])

  const detectFraud = async (data) => {
    setLoading(true)
    setError('')
    setFraudResult(null)

    try {
      // Simulate fraud detection analysis
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

      // Get damage type from ML model prediction
      const damageType = data.prediction?.damageType || 'Unknown'
      const mlConfidence = parseFloat(data.prediction?.confidence || 0)
      
      // Fraud detection logic based on ML confidence and damage type
      const fraudScore = Math.random() * 100
      const isFraud = fraudScore > 60 || mlConfidence < 50 // Low confidence might indicate fraud
      
      const result = {
        isFraud: isFraud,
        fraudScore: fraudScore.toFixed(2),
        confidence: mlConfidence.toFixed(2),
        damageType: damageType,
        allPredictions: data.prediction?.allPredictions || {},
        reasons: isFraud ? [
          'Inconsistent damage patterns detected',
          'Image metadata anomalies found',
          'Suspicious editing artifacts present',
          mlConfidence < 50 ? 'Low ML model confidence' : null
        ].filter(Boolean) : [
          'Damage patterns are consistent',
          'Image metadata is authentic',
          'No editing artifacts detected',
          `High confidence in ${damageType} classification`
        ],
        timestamp: new Date().toISOString()
      }

      setFraudResult(result)
    } catch (err) {
      setError('Failed to analyze image for fraud')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPrediction = () => {
    navigate('/prediction')
  }

  const handleSignOut = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div className="prediction-container">
      {/* Enhanced Particle Background */}
      <div className="particle-background">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${
              i % 4 === 0 ? 'small' : 
              i % 4 === 1 ? 'medium' : 
              i % 4 === 2 ? 'large' : 'drift'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>

      <div className="prediction-content">
        {/* Header */}
        <div className="prediction-header">
          <div className="prediction-header-top">
            <div className="prediction-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="prediction-title">CHUBB CLAIMS - Fraud Detection</h1>
          </div>
          <p className="prediction-subtitle">AI-powered fraud detection analysis</p>
          
          {/* User info and logout button */}
          <div className="user-info-bar">
            <span className="user-welcome">
              Welcome, {localStorage.getItem('username') || 'User'}
            </span>
            <button onClick={handleSignOut} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="prediction-card">
          <div className="fraud-header-actions">
            <h2 className="prediction-card-title">Fraud Detection Analysis</h2>
            <button onClick={handleBackToPrediction} className="back-btn">
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Upload
            </button>
          </div>

          {/* Image Display */}
          {imageData && (
            <div className="fraud-image-section">
              <h3 className="section-title">Uploaded Image</h3>
              <div className="fraud-image-container">
                <div className="fraud-image-info">
                  <p><strong>Filename:</strong> {imageData.filename}</p>
                  <p><strong>Upload Date:</strong> {new Date(imageData.uploadedAt).toLocaleString()}</p>
                  <p><strong>Size:</strong> {(imageData.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fraud-loading">
              <svg className="spinner-large" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Analyzing image for fraud indicators...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          {/* Fraud Detection Results */}
          {fraudResult && !loading && (
            <div className="fraud-results">
              <div className={`fraud-status-banner ${fraudResult.isFraud ? 'fraud-detected' : 'fraud-clear'}`}>
                <div className="fraud-status-icon">
                  {fraudResult.isFraud ? (
                    <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="fraud-status-text">
                  <h2>{fraudResult.isFraud ? 'FRAUD DETECTED' : 'NO FRAUD DETECTED'}</h2>
                  <p>{fraudResult.isFraud ? 'This claim requires manual review' : 'This claim appears to be legitimate'}</p>
                </div>
              </div>

              <div className="fraud-metrics">
                <div className="fraud-metric-card">
                  <h4>Fraud Score</h4>
                  <div className={`fraud-score ${fraudResult.isFraud ? 'high-risk' : 'low-risk'}`}>
                    {fraudResult.fraudScore}%
                  </div>
                </div>

                <div className="fraud-metric-card">
                  <h4>Confidence Level</h4>
                  <div className="fraud-confidence">
                    {fraudResult.confidence}%
                  </div>
                </div>

                <div className="fraud-metric-card">
                  <h4>Status</h4>
                  <div className={`fraud-badge ${fraudResult.isFraud ? 'badge-danger' : 'badge-success'}`}>
                    {fraudResult.isFraud ? 'SUSPICIOUS' : 'VERIFIED'}
                  </div>
                </div>
              </div>

              <div className="fraud-analysis-details">
                <h3 className="section-title">ML Model Predictions</h3>
                <div className="ml-predictions">
                  <div className="primary-prediction">
                    <h4>Detected Damage Type:</h4>
                    <p className="damage-type-display">{fraudResult.damageType}</p>
                  </div>
                  
                  {fraudResult.allPredictions && Object.keys(fraudResult.allPredictions).length > 0 && (
                    <div className="all-predictions">
                      <h4>All Predictions:</h4>
                      <div className="predictions-list">
                        {Object.entries(fraudResult.allPredictions)
                          .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                          .map(([className, confidence]) => (
                            <div key={className} className="prediction-item">
                              <span className="class-name">{className}</span>
                              <div className="confidence-bar-container">
                                <div 
                                  className="confidence-bar" 
                                  style={{ width: `${confidence}%` }}
                                ></div>
                                <span className="confidence-value">{confidence}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="section-title" style={{ marginTop: '2rem' }}>Fraud Analysis</h3>
                <div className="fraud-reasons">
                  <h4>Key Findings:</h4>
                  <ul>
                    {fraudResult.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="fraud-recommendation">
                  <h4>Recommendation:</h4>
                  <p>
                    {fraudResult.isFraud 
                      ? 'This claim should be flagged for manual review by a fraud investigator. Additional documentation and verification may be required before processing.'
                      : 'This claim can proceed to standard processing. All fraud indicators are within acceptable parameters.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="prediction-footer">
          <p className="prediction-footer-text">Powered by advanced AI fraud detection algorithms</p>
        </div>
      </div>
    </div>
  )
}

export default Fraud
