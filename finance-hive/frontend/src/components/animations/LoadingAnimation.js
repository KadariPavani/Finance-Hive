import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ color = '#0ea5e9', size = 'md', text = ' ' }) => {
  return (
    <div className="loading-container">
      {/* Dots container */}
      <div className="dots-wrapper">
        <div className="dot" style={{ backgroundColor: color, animationDelay: '0s' }}></div>
        <div className="dot" style={{ backgroundColor: color, animationDelay: '0.16s' }}></div>
        <div className="dot" style={{ backgroundColor: color, animationDelay: '0.32s' }}></div>
      </div>

      {/* Loading text */}
      {text && <div className="loading-text" style={{ color }}>{text}</div>}
    </div>
  );
};

export default LoadingAnimation;
