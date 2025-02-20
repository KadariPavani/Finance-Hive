import React from 'react';
import withGlobalLoading from './withGlobalLoading';

const CustomButton = (props) => {
  return (
    <button {...props} className={`custom-btn ${props.className}`}>
      {props.children}
    </button>
  );
};

export default withGlobalLoading(CustomButton);