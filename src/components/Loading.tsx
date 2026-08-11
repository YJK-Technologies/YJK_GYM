// import "./Loading.css";

// const Loading = () => {
//   return (
//     <div id="overlay-loader">
//       <div id="container">
//         <div className="ring"></div>
//         <div className="ring"></div>
//         <div className="ring"></div>
//         <div className="ring"></div>

//         <div id="loading-text">Loading...</div>
//       </div>
//     </div>
//   );
// };

// export default Loading;

import React, { useState, useEffect } from "react";
import "./Loading.css";

// Gym-themed dynamic status messages
const GYM_STATUSES = [
  "Setting up your workout...",
  "Loading workout routines...",
  "Tracking your fitness goals...",
  "Preparing rep counters...",
  "Warming up the equipment..."
];

// SVG Icon set for rotating center icons
const GymIcons = [
  // Dumbbell Icon
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" key="dumbbell">
    <path d="m6.5 6.5 11 11"/>
    <path d="m21 21-1-1"/>
    <path d="m3 3 1 1"/>
    <path d="m18 22 4-4"/>
    <path d="m2 6 4-4"/>
    <path d="m3 10 7-7"/>
    <path d="m14 21 7-7"/>
  </svg>,
  // Kettlebell Icon
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" key="kettlebell">
    <path d="M12 2a5 5 0 0 0-5 5v1h10V7a5 5 0 0 0-5-5z"/>
    <path d="M6 11a6 6 0 0 0-3 5.2c0 3.8 4 5.8 9 5.8s9-2 9-5.8A6 6 0 0 0 18 11H6z"/>
  </svg>,
  // Flame / Energy Icon
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" key="flame">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>,
  // Heart Rate / Pulse Icon
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" key="pulse">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
];

const Loading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GYM_STATUSES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="gym-loader-overlay">
      <div className="gym-loader-box">
        {/* Loader Graphics Container */}
        <div className="gym-visual-wrapper">
          {/* Animated Energy Rings */}
          <div className="ring ring-outer-glow"></div>
          <div className="ring ring-segmented"></div>

          {/* Floating Static Gym Decor Icons */}
          <div className="orbit-icon icon-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
          </div>
          <div className="orbit-icon icon-right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          </div>
          <div className="orbit-icon icon-bottom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div className="orbit-icon icon-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a5 5 0 0 0-5 5v1h10V7a5 5 0 0 0-5-5z"/><path d="M6 11a6 6 0 0 0-3 5.2c0 3.8 4 5.8 9 5.8s9-2 9-5.8A6 6 0 0 0 18 11H6z"/></svg>
          </div>

          {/* Central Active Changing Gym Icon */}
          <div className="gym-active-icon">
            {GymIcons[index % GymIcons.length]}
          </div>
        </div>

        {/* Text Section */}
        <div className="gym-text-section">
          <h2 className="gym-app-title">GYM <span>APP</span></h2>
          <p className="gym-status-msg">{GYM_STATUSES[index]}</p>
        </div>

        {/* Fitness Progress Indicator */}
        <div className="gym-loader-bar">
          <div className="bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;