import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-animation">
      <div className="loading-spinner"></div>
      <p>Processing...</p>
    </div>
  );
};

export default LoadingAnimation;