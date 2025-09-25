import React from 'react';

export default function Modal({ open, title, message, onConfirm, onClose, confirmText = 'OK', showCancel = false }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        <div style={{ textAlign: 'right' }}>
          {showCancel && <button className="ghost small" onClick={onClose} style={{ marginRight: 8 }}>Cancel</button>}
          <button className="primary small" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
