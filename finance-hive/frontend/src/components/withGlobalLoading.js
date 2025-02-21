import React, { useState } from 'react';
import GlobalLoadingAnimation from './animations/GlobalLoadingAnimation';

const withGlobalLoading = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (event) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Increase loading animation duration to 2 seconds

      if (props.onClick) {
        await props.onClick(event);
      }
    };

    return (
      <>
        {loading && <GlobalLoadingAnimation onComplete={() => setLoading(false)} />}
        <WrappedComponent {...props} onClick={handleClick} />
      </>
    );
  };
};

export default withGlobalLoading;