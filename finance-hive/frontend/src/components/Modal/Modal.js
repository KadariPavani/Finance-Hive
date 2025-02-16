import React from 'react';
import './Modal.css';

const Modal = ({ show, message, onClose, isError }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isError ? 'Error' : 'Success'}</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-btn">Close</button>
      </div>
    </div>
  );
};

export default Modal;