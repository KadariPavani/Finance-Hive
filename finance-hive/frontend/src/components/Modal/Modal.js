import React from 'react';
import './Modal.css';

const Modal = ({ show, message, onClose, isError }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isError ? 'error' : 'success'}`}>
        <div className="modal-header">
          <h2>{isError ? 'Error' : 'Success'}</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;