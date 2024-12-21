// Modal.js
import React from 'react';
import './Modal.css'; // Add styling for the modal

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // If not open, don't render anything

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
