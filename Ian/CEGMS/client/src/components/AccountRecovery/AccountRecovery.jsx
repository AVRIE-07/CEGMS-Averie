import React from 'react';
import './CustomModal.css'; 

function CustomModal({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                    {children}
            </div>
        </div>
    );
}

export default CustomModal;