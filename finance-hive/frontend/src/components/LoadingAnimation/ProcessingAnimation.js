import React from 'react';
import './ProcessingAnimation.css';

const ProcessingAnimation = () => {
  return (
    <div className="processing-animation">
      <div className="processing-spinner"></div>
      <p>Processing...</p>
    </div>
  );
};

export default ProcessingAnimation;