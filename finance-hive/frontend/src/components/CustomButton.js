import React from 'react';
import withLoading from './withLoading';

const CustomButton = withLoading((props) => (
  <button {...props} className={`custom-btn ${props.className}`}>
    {props.children}
  </button>
));

export default CustomButton;