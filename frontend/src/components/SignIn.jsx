import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Sending signin request:', { username })
      
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log('Signin response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed')
      }

      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('token', data.token)
      console.log('Sign in successful, navigating to /prediction')
      
      // Force a full page reload to update authentication state
      window.location.href = '/prediction'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', 'Google User')
    localStorage.setItem('token', 'google-mock-token')
    console.log('Google sign-in, navigating to /prediction')
    window.location.href = '/prediction'
  }

  const handleMobileSignIn = () => {
    // Simulate mobile sign-in
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', 'Mobile User')
    localStorage.setItem('token', 'mobile-mock-token')
    console.log('Mobile sign-in, navigating to /prediction')
    window.location.href = '/prediction'
  }

  return (
    <div className="auth-container">
      {/* Enhanced Particle Background */}
      <div className="particle-background">
        {[...Array(80)].map((_, i) => (
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

      {/* Hamburger Menu */}
      <div className="hamburger-menu">
        <div className="hamburger-icon">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
      </div>

      {/* Centered Content Container */}
      <div className="auth-content-wrapper">
        <div className="auth-card-container">
          <div className="auth-card">
            <h1 className="auth-card-title">Chubb Claim insurance</h1>
            <div>
              <h2 className="auth-card-subtitle">Welcome Back</h2>
              <p className="auth-card-description">Sign in to access the prediction interface</p>
            </div>

            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter username"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Alternative Sign In Options */}
            <div className="auth-options">
              <button onClick={handleGoogleSignIn} className="auth-option-btn">
                <div className="auth-option-icon">
                  <span style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '1.125rem' }}>G</span>
                </div>
                <span className="auth-option-text">Continue with Google</span>
              </button>

              <button onClick={handleMobileSignIn} className="auth-option-btn">
                <div className="auth-option-icon">
                  <div style={{ width: '1rem', height: '1.5rem', backgroundColor: '#1f2937', borderRadius: '0.125rem' }}></div>
                </div>
                <span className="auth-option-text">Continue with Mobile</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Sign Up Option */}
            <div className="auth-footer">
              <span className="auth-footer-text">Don't have an account?</span>
              <button onClick={() => navigate('/signup')} className="btn-secondary">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
