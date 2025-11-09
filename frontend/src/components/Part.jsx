import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'

function Part() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [partResult, setPartResult] = useState(null)
  
  const imagePreview = location.state?.imagePreview
  const damageResult = location.state?.damageResult

  useEffect(() => {
    if (!imagePreview) {
      navigate('/prediction')
    }
  }, [imagePreview, navigate])

  const handleDetectPart = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(imagePreview)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append('image', blob, 'car-image.jpg')

      const apiResponse = await fetch('http://localhost:5000/api/images/detect-part', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Part detection failed')
      }

      setPartResult(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/prediction')
  }

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      doc.setFont('helvetica')
      
      // Header
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text('CHUBB CLAIMS', 105, 20, { align: 'center' })
      doc.setFontSize(12)
      doc.text('Vehicle Damage Assessment Report', 105, 30, { align: 'center' })
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50)
      doc.text(`Report Time: ${new Date().toLocaleTimeString()}`, 20, 56)
      doc.text(`User: ${localStorage.getItem('username') || 'N/A'}`, 20, 62)
      
      // Damage Detection Result
      doc.setFontSize(16)
      doc.setTextColor(59, 130, 246)
      doc.text('Damage Detection Result', 20, 75)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      
      if (damageResult) {
        doc.text(`Status: ${damageResult.damageStatus}`, 20, 85)
        doc.text(`Confidence: ${damageResult.confidence}%`, 20, 92)
      }
      
      // Part Detection Result
      if (partResult) {
        doc.setFontSize(16)
        doc.setTextColor(59, 130, 246)
        doc.text('Damaged Part Detection', 20, 110)
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(12)
        
        doc.text(`Damaged Part: ${partResult.damagedPart}`, 20, 120)
        doc.text(`Confidence: ${partResult.confidence}%`, 20, 127)
        
        doc.setFontSize(14)
        doc.setTextColor(59, 130, 246)
        doc.text('All Part Predictions:', 20, 145)
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        
        let yPos = 155
        if (partResult.allPredictions) {
          const sortedPredictions = Object.entries(partResult.allPredictions)
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
            .slice(0, 10)
          
          sortedPredictions.forEach(([part, confidence]) => {
            doc.text(`${part}: ${confidence}%`, 25, yPos)
            yPos += 7
          })
        }
      }
      
      if (imagePreview) {
        try {
          doc.addPage()
          doc.setFontSize(16)
          doc.setTextColor(59, 130, 246)
          doc.text('Vehicle Image', 20, 20)
          doc.addImage(imagePreview, 'JPEG', 20, 30, 170, 120)
        } catch (imgError) {
          console.error('Error adding image to PDF:', imgError)
        }
      }
      
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
        doc.text('Group 301 - Confidential Report', 105, 285, { align: 'center' })
      }
      
      const fileName = `Damage_Report_${new Date().getTime()}.pdf`
      doc.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <DashboardLayout>
      <div className="part-module">
        {/* Previous Result Summary */}
        {damageResult && (
          <div className="summary-banner">
            <div className="summary-content">
              <div className="summary-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="summary-text">
                <h3>Vehicle Damage Detected</h3>
                <p>Confidence: {damageResult.confidence}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="module-card">
          <div className="card-header">
            <h2 className="card-title">Detect Damaged Part</h2>
            <p className="card-subtitle">Identify the specific part of the vehicle that is damaged</p>
          </div>

          {/* Image Display */}
          {imagePreview && (
            <div className="image-display-section">
              <div className="image-container">
                <img src={imagePreview} alt="Car" className="display-image" />
              </div>
            </div>
          )}

          {/* Detect Button */}
          {!partResult && (
            <div className="card-actions">
              <button
                onClick={handleDetectPart}
                disabled={loading}
                className="btn-primary btn-large"
              >
                {loading ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Detecting Part...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Detect Damaged Part
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Part Detection Results */}
          {partResult && (
            <div className="results-section">
              <div className="result-banner result-part">
                <div className="result-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="result-content">
                  <h3 className="result-title">{partResult.damagedPart}</h3>
                  <p className="result-confidence">Confidence: {partResult.confidence}%</p>
                </div>
              </div>

              {/* Detailed Predictions */}
              {partResult.allPredictions && (
                <div className="analysis-section">
                  <h4 className="analysis-title">All Detected Parts</h4>
                  <div className="prediction-bars">
                    {Object.entries(partResult.allPredictions)
                      .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                      .map(([partName, confidence]) => (
                        <div key={partName} className="prediction-bar">
                          <div className="bar-header">
                            <span className="bar-label">{partName}</span>
                            <span className="bar-value">{confidence}%</span>
                          </div>
                          <div className="bar-container">
                            <div 
                              className="bar-fill bar-info"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={handleBack} className="btn-outline btn-large">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Upload
                </button>
                <button onClick={handleDownloadPDF} className="btn-success btn-large">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Part
