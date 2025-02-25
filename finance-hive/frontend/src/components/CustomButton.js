import React from 'react';

const CustomButton = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false
}) => {
  const handleClick = async (e) => {
    if (!onClick || disabled) return;
    onClick(e);
  };

  return (
    <button
      type={type}
      className={`custom-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;