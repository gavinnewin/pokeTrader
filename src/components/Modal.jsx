import React from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const hasCard = React.Children.toArray(children).some(
    child => React.isValidElement(child) && child.type.name === 'Card'
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${hasCard ? 'modal-content--transparent' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-body">
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type.name === 'Card') {
              return React.cloneElement(child, { transparent: true });
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
} 