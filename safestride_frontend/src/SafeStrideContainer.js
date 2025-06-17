import React, { useState } from 'react';
import './SafeStrideContainer.css';

// Static sample data for crime zones, routes, and weather
const CRIME_ZONES = [
  { id: 1, name: 'Central Park Alley', lat: 40.78509, lng: -73.968285, risk: 'high', description: 'Frequent reports of pickpocketing.' },
  { id: 2, name: '8th Ave & W 34th', lat: 40.7527, lng: -73.9943, risk: 'medium', description: 'Some unsafe incidents reported.' },
];

const ROUTES = [
  {
    id: 'safe',
    color: '#4CAF50', // Primary: safest route
    points: [
      { lat: 40.7856, lng: -73.9700 },
      { lat: 40.7835, lng: -73.9650 },
      { lat: 40.7820, lng: -73.9620 },
    ],
  },
  {
    id: 'medium',
    color: '#FFC107', // Secondary: ok route
    points: [
      { lat: 40.7856, lng: -73.9700 },
      { lat: 40.7840, lng: -73.9685 },
      { lat: 40.7825, lng: -73.9640 },
    ],
  },
  {
    id: 'risky',
    color: '#FF5252', // Red: risky
    points: [
      { lat: 40.7856, lng: -73.9700 },
      { lat: 40.7862, lng: -73.9670 },
      { lat: 40.7852, lng: -73.9639 },
    ],
  },
];

const WEATHER_ALERT = {
  type: 'Rain Warning',
  message: 'Heavy rain expected along the current route. You may want to try the alternate path (yellow).',
  active: true,
};

const SOS_SHARE_URL = 'https://maps.google.com/?q=Your+Current+Location';

// PUBLIC_INTERFACE
function SafeStrideContainer() {
  const [showCrimeZones, setShowCrimeZones] = useState(true);
  const [showWeatherModal, setShowWeatherModal] = useState(WEATHER_ALERT.active);
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([
    { message: 'Route B feels unsafe at night due to poor lighting.', time: '2024-06-13 21:00' },
  ]);
  const [showSOS, setShowSOS] = useState(false);

  // PUBLIC_INTERFACE
  function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (feedback.trim()) {
      setFeedbackList([{ message: feedback, time: new Date().toLocaleString() }, ...feedbackList]);
      setFeedback('');
    }
  }

  // PUBLIC_INTERFACE
  function handleSOS() {
    setShowSOS(true);
    setTimeout(() => setShowSOS(false), 3500);
  }

  // PUBLIC_INTERFACE
  function toggleCrimeZones() {
    setShowCrimeZones((prev) => !prev);
  }

  // Mock "Map" as SVG for visual demo - would be replaced by a real map (e.g., Leaflet/Google Maps) in production
  const renderMap = () => (
    <div className="stride-map" aria-label="SafeStride walking map">
      {/* Map background */}
      <svg width="100%" height="400" viewBox="0 0 800 400">
        <rect width="800" height="400" fill="#eaf4fa" rx="28" />
        {/* Paths for routes */}
        {ROUTES.map((route, idx) => (
          <polyline
            key={route.id}
            points={route.points.map(p => `${120 + (p.lng + 74)*110},${220 - (p.lat - 40.78)*4200}`).join(' ')}
            fill="none"
            stroke={route.color}
            strokeWidth={route.id === 'safe' ? 7 : 5}
            strokeDasharray={route.id === 'risky' ? '6,8' : undefined}
            opacity={route.id === 'safe' ? 0.96 : 0.65}
            style={{ filter: route.id === 'safe' ? 'drop-shadow(0 0 8px #4caf50aa)' : undefined }}
          />
        ))}
        {/* Crime zones */}
        {showCrimeZones &&
          CRIME_ZONES.map(z => (
            <g key={z.id}>
              <circle
                cx={120 + (z.lng + 74) * 110}
                cy={220 - (z.lat - 40.78) * 4200}
                r="16"
                fill={z.risk === 'high' ? '#FF5252' : '#FFC107'}
                opacity="0.72"
              />
              <text
                x={120 + (z.lng + 74) * 110}
                y={220 - (z.lat - 40.78) * 4200}
                fontSize="11"
                textAnchor="middle"
                fill="#fff"
                dy={4}
                style={{pointerEvents: 'none'}}
              >!
              </text>
            </g>
          ))
        }
        {/* Start and End Points */}
        <circle cx="164" cy="204" r="10" fill="#2196F3" />
        <circle cx="330" cy="165" r="10" fill="#4CAF50" />
        <text x="154" y="200" fontSize="10" fill="#1976d2">Start</text>
        <text x="350" y="165" fontSize="10" fill="#388e3c">Destination</text>
      </svg>
      {/* Controls overlay */}
      <button className="map-btn" onClick={toggleCrimeZones}>
        {showCrimeZones ? 'Hide' : 'Show'} Crime Zones
      </button>
    </div>
  );

  // PUBLIC_INTERFACE
  function closeWeatherModal() { setShowWeatherModal(false); }

  // PUBLIC_INTERFACE
  function closeSOSModal() { setShowSOS(false); }

  return (
    <div className="safestride-main">
      {/* Header */}
      <header className="ss-header">
        <span className="ss-logo" aria-label="SafeStride logo">🚶‍♀️</span>
        <span className="ss-title">SafeStride</span>
        <span className="ss-subtag">Walk Smart, Walk Safe</span>
      </header>
      {/* Main content grid */}
      <div className="ss-content-area">
        <section className="ss-map-section" tabIndex="0">
          {renderMap()}
          {showCrimeZones &&
            <div className="ss-crime-alertbox">
              <span className="ss-crime-title">
                <span role="img" aria-label="alert">&#9888;&#65039;</span>
                Crime Zone Alerts
              </span>
              <ul className="ss-crime-list">
                {CRIME_ZONES.map(z =>
                  <li key={z.id}>
                    <span className={`ss-crime-dot ${z.risk}`}></span>
                    <strong>{z.name}:</strong> {z.description}
                  </li>
                )}
              </ul>
            </div>
          }
          {showWeatherModal && (
            <div className="ss-modal-outer" role="dialog" aria-modal="true">
              <div className="ss-modal">
                <h3>
                  <span className="ss-modal-icon" style={{color: '#2196F3'}}>☔</span>
                  Weather Alert
                </h3>
                <p>{WEATHER_ALERT.message}</p>
                <button className="btn btn-accent" onClick={closeWeatherModal}>Dismiss</button>
              </div>
            </div>
          )}
        </section>

        {/* Feedback & SOS area */}
        <aside className="ss-feedback-sos" aria-label="Report, Suggest or Call for Help">
          {/* Feedback Form */}
          <form className="ss-feedback-form" onSubmit={handleFeedbackSubmit}>
            <h4>Report / Suggestion</h4>
            <textarea
              value={feedback}
              placeholder="Report an unsafe spot or share suggestions…"
              onChange={e => setFeedback(e.target.value)}
              rows={2}
              minLength={5}
              required
              aria-label="User feedback input"
            />
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
          <div className="ss-feedback-list">
            <span className="ss-feedback-title">Community Feedback</span>
            <ul>
              {feedbackList.map((f, i) => (
                <li key={i}><span className="ss-feedback-dot"></span>{f.message}<span className="ss-feedback-time">{f.time}</span></li>
              ))}
            </ul>
          </div>
          {/* SOS Button & Modal */}
          <button
            className="ss-sos-btn"
            aria-label="Send SOS location alert"
            onClick={handleSOS}
            tabIndex="0"
            style={{backgroundColor: '#FF5252'}}
          >
            <span role="img" aria-label="sos">🆘</span> SOS
          </button>
          {showSOS && (
            <div className="ss-modal-outer" role="dialog" aria-modal="true">
              <div className="ss-modal">
                <h3 style={{color: '#FF5252'}}>SOS Sent</h3>
                <p>Your (demo) location has been shared! Copy this link to share your live location:</p>
                <input className="ss-sos-url" value={SOS_SHARE_URL} readOnly />
                <button className="btn btn-accent" onClick={closeSOSModal}>Close</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SafeStrideContainer;
