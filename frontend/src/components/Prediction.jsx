import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'

function Prediction() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
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

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
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
    setResult(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
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
      fetchUploadedImages()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="prediction-module">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{uploadedImages.length}</div>
              <div className="stat-label">Total Images</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {uploadedImages.filter(img => !img.predictionResult?.isDamaged).length}
              </div>
              <div className="stat-label">Not Damaged</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-danger">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {uploadedImages.filter(img => img.predictionResult?.isDamaged).length}
              </div>
              <div className="stat-label">Damaged</div>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="module-card">
          <div className="card-header">
            <h2 className="card-title">Upload Car Image</h2>
            <p className="card-subtitle">Upload an image to detect vehicle damage using AI</p>
          </div>

          {/* Drag and Drop Area */}
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={loading}
              className="file-input"
              id="image-upload"
            />
            
            {!imagePreview ? (
              <label htmlFor="image-upload" className="upload-label">
                <div className="upload-icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="upload-text">
                  <span className="upload-primary">Click to upload</span> or drag and drop
                </div>
                <div className="upload-hint">PNG, JPG, JPEG up to 10MB</div>
              </label>
            ) : (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="preview-image" />
                <button 
                  className="remove-image-btn"
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    setResult(null)
                    setError('')
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="card-actions">
            <button
              onClick={handleUploadAndPredict}
              disabled={loading || !selectedImage}
              className="btn-primary btn-large"
            >
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Damage
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="results-section">
              <div className={`result-banner ${result.isDamaged ? 'result-damaged' : 'result-safe'}`}>
                <div className="result-icon">
                  {result.isDamaged ? (
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="result-content">
                  <h3 className="result-title">{result.damageStatus}</h3>
                  <p className="result-confidence">Confidence: {result.confidence}%</p>
                </div>
              </div>

              {/* Detailed Analysis */}
              {result.allPredictions && Object.keys(result.allPredictions).length === 2 && (
                <div className="analysis-section">
                  <h4 className="analysis-title">Detailed Analysis</h4>
                  <div className="prediction-bars">
                    {Object.entries(result.allPredictions)
                      .filter(([className]) => className === 'Damaged' || className === 'Not Damaged')
                      .map(([className, confidence]) => (
                        <div key={className} className="prediction-bar">
                          <div className="bar-header">
                            <span className="bar-label">{className}</span>
                            <span className="bar-value">{confidence}%</span>
                          </div>
                          <div className="bar-container">
                            <div 
                              className={`bar-fill ${className === 'Damaged' ? 'bar-danger' : 'bar-success'}`}
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Next Step Button */}
              {result && imagePreview && (() => {
                const damagedConfidence = result.allPredictions?.['Damaged'] 
                  ? parseFloat(result.allPredictions['Damaged']) 
                  : 0;
                const isDamagedEnough = damagedConfidence > 10;
                
                return isDamagedEnough ? (
                  <div className="next-step">
                    <button
                      onClick={() => navigate('/part', { 
                        state: { 
                          imagePreview: imagePreview,
                          damageResult: result 
                        } 
                      })}
                      className="btn-secondary btn-large"
                    >
                      <span>Detect Damaged Part</span>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Image History */}
        {uploadedImages.length > 0 && (
          <div className="module-card">
            <div className="card-header">
              <h2 className="card-title">Recent Images</h2>
              <p className="card-subtitle">Your uploaded images and their analysis results</p>
            </div>
            <div className="images-grid">
              {uploadedImages.slice(0, 6).map((img) => (
                <div key={img._id} className="image-history-card">
                  <div className="history-card-header">
                    <span className="history-image-name">{img.originalName}</span>
                    <span className={`history-badge ${img.predictionResult?.isDamaged ? 'badge-danger' : 'badge-success'}`}>
                      {img.predictionResult?.damageStatus || 'N/A'}
                    </span>
                  </div>
                  <div className="history-card-content">
                    <div className="history-confidence">
                      Confidence: {img.predictionResult?.confidence || 'N/A'}%
                    </div>
                    <div className="history-date">
                      {new Date(img.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Prediction
