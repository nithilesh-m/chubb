import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Sending signup request:', { username, email, passwordLength: password.length })
      
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()
      console.log('Signup response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed')
      }

      // Auto sign in after successful signup
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('token', data.token)
      console.log('Signup successful, redirecting to prediction')
      
      // Force a full page reload to update authentication state
      window.location.href = '/prediction'
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <h1 className="auth-card-title">chubb claim insurance</h1>
            <div>
              <h2 className="auth-card-subtitle">Create Account</h2>
              <p className="auth-card-description">Sign up to access the prediction interface</p>
            </div>

            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
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

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Sign In Option */}
            <div className="auth-footer">
              <span className="auth-footer-text">Already have an account?</span>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
