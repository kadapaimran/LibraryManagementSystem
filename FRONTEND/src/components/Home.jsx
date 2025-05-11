import  { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  BookMarked, 
  User,
} from 'lucide-react';
import './Home.css';

// Simple Navbar component with enhanced digital library logo
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <svg className="logo-icon" fill="url(#logoGradient)" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Enhanced logo: Open book with a digital screen effect */}
            <path 
              d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h12V5H6zm2 2h8v10H8V7zm2 2v6h4V9h-4z" 
              stroke="#1d4ed8" 
              strokeWidth="0.8" 
            />
            {/* Digital screen effect with glowing dots */}
            <path 
              d="M9 8h1v1H9zm0 2h1v1H9zm0 2h1v1H9zm4 0h1v1h-1zm0-2h1v1h-1zm0-2h1v1h-1z" 
              fill="#93c5fd" 
              opacity="0.9" 
            />
          </svg>
          <span className="logo-text">Librix Nexus</span>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link nav-link-blue">Home</Link>
          <Link to="/signup" className="nav-link nav-link-blue">Browse</Link>
          <Link to="/contact" className="nav-link nav-link-blue">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

function Home() {
  // State to manage the selected feature
  const [selectedFeature, setSelectedFeature] = useState('vast-collection');

  // Feature data
  const features = {
    'vast-collection': {
      title: 'Vast Collection',
      description: 'Thousands of books across genres',
      icon: <BookOpen className="feature-icon vast-collection-icon" size={28} />,
      iconBg: 'vast-collection-bg',
    },
    'access': {
      title: '24/7 Access',
      description: 'Access your books anytime, anywhere',
      icon: <Clock className="feature-icon access-icon" size={28} />,
      iconBg: 'access-bg',
    },
    'borrowing': {
      title: 'Easy Borrowing',
      description: 'Simple and quick book borrowing',
      icon: <BookMarked className="feature-icon borrowing-icon" size={28} />,
      iconBg: 'borrowing-bg',
    },
    'recommendations': {
      title: 'Personalized Recommendations',
      description: 'Book suggestions tailored for you',
      icon: <User className="feature-icon recommendations-icon" size={28} />,
      iconBg: 'recommendations-bg',
    },
  };

  return (
    <div className="landing-container">
      <Navbar />
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Librix Nexus</h1>
          <p className="hero-subtitle">Discover thousands of books at your fingertips</p>
          
          {/* Hero Buttons */}
          <div className="hero-buttons">
            <Link 
              to="/signup" 
              className="btn btn-primary"
            >
              Join Now
            </Link>
            <Link 
              to="/login" 
              className="btn btn-secondary"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        {/* Background Wave Pattern */}
        <svg className="features-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,170.7C672,149,768,107,864,112C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <div className="features-content">
          <h2 className="features-title">Why Choose Librix Nexus</h2>
          <div className="features-layout">
            {/* Left Side: Feature List */}
            <div className="features-list">
              {Object.keys(features).map((key) => (
                <div
                  key={key}
                  className={`feature-item ${selectedFeature === key ? 'active' : ''}`}
                  onClick={() => setSelectedFeature(key)}
                >
                  <h3 className="feature-item-title">{features[key].title}</h3>
                </div>
              ))}
            </div>

            {/* Right Side: Feature Details */}
            <div className="feature-details">
              <div className="feature-card">
                <div className={`icon-wrapper ${features[selectedFeature].iconBg}`}>
                  {features[selectedFeature].icon}
                </div>
                <h3 className="feature-title">{features[selectedFeature].title}</h3>
                <p className="feature-desc">{features[selectedFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <h2 className="cta-title">Ready to start reading?</h2>
        <p className="cta-subtitle">Join our community of readers today</p>
        <Link 
          to="/signup" 
          className="btn btn-primary cta-btn"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Home;