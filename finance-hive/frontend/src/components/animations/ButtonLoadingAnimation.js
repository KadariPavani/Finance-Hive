import React from 'react';
import './ButtonLoadingAnimation.css';

const ButtonLoadingAnimation = ({ color = '#fff', size = 'sm' }) => {
  return (
    <div className={`button-loading-container ${size}`}>
      <div className="button-dot" style={{ backgroundColor: color, animationDelay: '0s' }}></div>
      <div className="button-dot" style={{ backgroundColor: color, animationDelay: '0.16s' }}></div>
      <div className="button-dot" style={{ backgroundColor: color, animationDelay: '0.32s' }}></div>
    </div>
  );
};

export default ButtonLoadingAnimation;