import { useState } from "react";
import './PopUp.css';

export function PopUp({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}