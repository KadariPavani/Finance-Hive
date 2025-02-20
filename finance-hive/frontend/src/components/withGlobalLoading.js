import React, { useState } from 'react';
import GlobalLoadingAnimation from './animations/GlobalLoadingAnimation';

const withGlobalLoading = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (event) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000); // 1 minute loading animation

      if (props.onClick) {
        await props.onClick(event);
      }
    };

    return (
      <>
        {loading && <GlobalLoadingAnimation />}
        <WrappedComponent {...props} onClick={handleClick} />
      </>
    );
  };
};

export default withGlobalLoading;