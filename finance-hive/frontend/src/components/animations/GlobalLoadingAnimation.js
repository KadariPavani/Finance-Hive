import React, { useEffect, useState } from 'react';
import './GlobalLoadingAnimation.css';

const GlobalLoadingAnimation = ({ onComplete }) => {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          onComplete();
        }, 200); // Match fadeOut animation duration
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className={`global-loading-container ${isHiding ? 'hide' : ''}`}>
      <div className="global-loading-spinner">
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default GlobalLoadingAnimation;