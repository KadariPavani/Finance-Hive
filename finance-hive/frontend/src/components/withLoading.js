import React, { useState } from 'react';
import LoadingAnimation from './LoadingAnimation/LoadingAnimation';
import './withLoading.css'; // Import the CSS file for modal styling

const withLoading = (WrappedComponent, successMessage, errorMessage) => {
  return (props) => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClick = async (event) => {
      setLoading(true);
      try {
        if (props.onClick) {
          await props.onClick(event);
        }
        setIsSuccess(true);
        setModalMessage(successMessage || "Process completed successfully!");
      } catch (error) {
        setIsSuccess(false);
        setModalMessage(error.message || errorMessage || "Process failed. Please try again.");
      } finally {
        setLoading(false);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          if (isSuccess) {
            window.location.reload();
          }
        }, 2000); // Show modal for 2 seconds before refreshing
      }
    };

    return (
      <>
        {loading && <LoadingAnimation />}
        {showModal && (
          <div className="modal">
            <div className={`modal-content ${isSuccess ? 'success' : 'error'}`}>
              <div className="modal-icon">{isSuccess ? '✔️' : '❌'}</div>
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
        <WrappedComponent {...props} onClick={handleClick} />
      </>
    );
  };
};

export default withLoading;