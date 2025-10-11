import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Prediction() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchUploadedImages()
  }, [])

  const fetchUploadedImages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/images/my-images', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUploadedImages(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch images:', err)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB')
        return
      }
      setSelectedImage(file)
      setError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadAndPredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('http://localhost:5000/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data.data.prediction)
      fetchUploadedImages() // Refresh the list
      
      // Keep the image preview visible after upload
      // Don't clear selectedImage and imagePreview
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="prediction-title">CHUBB CLAIMS</h1>
          </div>
          <p className="prediction-subtitle">AI-powered car damage detection</p>
          
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
          <h2 className="prediction-card-title">Upload Car image</h2>
          
          {/* Image Upload Section */}
          <div className="input-section">
            <label className="input-label">
              Select Image for Analysis
            </label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={loading}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="file-input-label">
                <svg style={{ width: '2rem', height: '2rem', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedImage ? selectedImage.name : 'Click to select image'}</span>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          {/* Upload & Predict Button */}
          <div className="predict-btn-wrapper">
            <button
              onClick={handleUploadAndPredict}
              disabled={loading || !selectedImage}
              className="predict-btn"
            >
              {loading ? (
                <>
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Predict
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="results-container">
              <h3 className="results-title">Damage Detection Results</h3>
              
              {/* Main Result Banner */}
              <div className={`damage-result-banner ${result.isDamaged ? 'damaged' : 'not-damaged'}`}>
                <div className="damage-icon">
                  {result.isDamaged ? (
                    <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="damage-result-text">
                  <h2>{result.damageStatus}</h2>
                  <p style={{
                      color: 'black !important',
                      fontWeight: '600',
  }}>Confidence: {result.confidence}%</p>
                </div>
              </div>

              {/* Detailed Predictions - Only show Damaged/Not Damaged */}
              {result.allPredictions && Object.keys(result.allPredictions).length === 2 && (
                <div className="predictions-detail">
                  <h4>Detailed Analysis:</h4>
                  <div className="predictions-bars">
                    {Object.entries(result.allPredictions)
                      .filter(([className]) => className === 'Damaged' || className === 'Not Damaged')
                      .map(([className, confidence]) => (
                        <div key={className} className="prediction-bar-item">
                          <div className="prediction-bar-header">
                            <span className="prediction-class">{className}</span>
                            <span className="prediction-confidence">{confidence}%</span>
                          </div>
                          <div className="prediction-bar-bg">
                            <div 
                              className="prediction-bar-fill"
                              style={{ width: `${confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Note if using fallback */}
              {result.note && (
                <div className="prediction-note">
                  <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{result.note}</span>
                </div>
              )}

              {/* Next Button - Show if "Damaged" confidence > 10% */}
              {result && imagePreview && (() => {
                const damagedConfidence = result.allPredictions?.['Damaged'] 
                  ? parseFloat(result.allPredictions['Damaged']) 
                  : 0;
                const isDamagedEnough = damagedConfidence > 10;
                
                return (
                  <div className="next-btn-wrapper">
                    {isDamagedEnough ? (
                      <button
                        onClick={() => navigate('/part', { 
                          state: { 
                            imagePreview: imagePreview,
                            damageResult: result 
                          } 
                        })}
                        className="next-btn"
                      >
                        <span>Next: Detect Damaged Part</span>
                        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    ) : (
                      <div className="info-message">
                        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {damagedConfidence > 0 
                            ? `Damage confidence too low (${damagedConfidence}%). Part detection requires at least 10% confidence.`
                            : 'No damage detected. Part detection is only available for damaged vehicles.'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Previously Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="uploaded-images-section">
              <h3 className="results-title">Your Uploaded Images</h3>
              <div className="images-grid">
                {uploadedImages.slice(0, 6).map((img) => (
                  <div key={img._id} className="image-card">
                    <div className="image-card-header">
                      <span className="image-name">{img.originalName}</span>
                      <span className="image-date">
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="image-card-result">
                      <span className={`risk-badge ${
                        img.predictionResult?.isDamaged ? 'risk-high' : 'risk-low'
                      }`}>
                        {img.predictionResult?.damageStatus || 'N/A'}
                      </span>
                      <span
                        className="score-text"
                          style={{
                          color: 'black !important',
                          fontWeight: '600',
                        }}
                      >
                      Confidence: {img.predictionResult?.confidence || 'N/A'}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="prediction-footer">
          <p className="prediction-footer-text">Group 301</p>
        </div>
      </div>
    </div>
  )
}

export default Prediction
