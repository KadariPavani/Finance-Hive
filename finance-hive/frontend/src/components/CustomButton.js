import React from 'react';
import withGlobalLoading from './withGlobalLoading';

const CustomButton = ({ onClick, onAction, ...props }) => {
  const handleClick = (event) => {
    if (onAction) {
      onAction(onClick, event);
    } else if (onClick) {
      onClick(event);
    }
  };

  return (
    <button {...props} className={`custom-btn ${props.className}`} onClick={handleClick}>
      {props.children}
    </button>
  );
};

export default withGlobalLoading(CustomButton);