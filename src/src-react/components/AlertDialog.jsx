import React from 'react';

const AlertDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar' }) => {
  if (!isOpen) return null;
  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog">
        <h3 className="alert-dialog-title">{title}</h3>
        <p className="alert-dialog-message">{message}</p>
        <div className="alert-dialog-actions">
          <button className="alert-dialog-btn cancel" onClick={onCancel}>{cancelText}</button>
          <button className="alert-dialog-btn confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog; 