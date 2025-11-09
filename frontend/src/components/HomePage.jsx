import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="homepage-container">
      {/* Particle Background */}
      <div className="particle-background">
        {[...Array(100)].map((_, i) => (
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

      {/* Navigation Bar */}
      <nav className="homepage-nav">
        <div className="nav-content">
          <div className="nav-logo">
            <h1>CHUBB Claims</h1>
          </div>
          <div className="nav-buttons">
            <button onClick={() => navigate('/signin')} className="nav-btn nav-btn-secondary">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="nav-btn nav-btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Car Damage Detection
          </h1>
          <p className="hero-subtitle">
            Revolutionizing insurance claims with machine learning. 
            Instantly detect vehicle damage with precision and confidence.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="hero-btn hero-btn-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate('/signin')} className="hero-btn hero-btn-secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need for accurate and efficient damage detection
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Detection</h3>
              <p className="feature-description">
                Advanced machine learning models analyze car images to detect damage with high accuracy
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Results</h3>
              <p className="feature-description">
                Get real-time predictions in seconds. Upload an image and receive immediate analysis
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Confidence Scores</h3>
              <p className="feature-description">
                Detailed probability breakdowns show how confident the AI is in its predictions
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your images and data are encrypted and stored securely. User-specific authentication ensures privacy
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3 className="feature-title">Image History</h3>
              <p className="feature-description">
                Access your uploaded images and past predictions anytime. Complete audit trail
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Binary Classification</h3>
              <p className="feature-description">
                Clear distinction between damaged and not damaged vehicles with visual indicators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload Image</h3>
              <p className="step-description">
                Upload a clear image of the vehicle. Supports JPG, PNG, and other common formats
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">AI Analysis</h3>
              <p className="step-description">
                Our TensorFlow model processes the image and analyzes it for damage detection
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Results</h3>
              <p className="step-description">
                Receive instant results with confidence scores and detailed probability breakdowns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="section-container">
          <h2 className="section-title">Built With Modern Technology</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h4 className="tech-category">Frontend</h4>
              <ul className="tech-list">
                <li>React 18.x</li>
                <li>React Router</li>
                <li>Vite</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4 className="tech-category">Backend</h4>
              <ul className="tech-list">
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="tech-card">
              <h4 className="tech-category">Machine Learning</h4>
              <ul className="tech-list">
                <li>TensorFlow/Keras</li>
                <li>Flask API</li>
                <li>Image Processing</li>
                <li>CNN Models</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of users who trust CHUBB Claims for accurate damage detection
          </p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/signup')} className="cta-btn cta-btn-primary">
              Create Free Account
            </button>
            <button onClick={() => navigate('/signin')} className="cta-btn cta-btn-secondary">
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <p>&copy; 2024 CHUBB Claims. All rights reserved.</p>
          <p className="footer-tagline">AI-Powered Insurance Solutions</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

