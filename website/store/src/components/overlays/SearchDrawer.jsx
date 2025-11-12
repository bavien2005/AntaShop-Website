import React from "react";
import "./overlays.css";

export default function SearchDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="overlay-root" onClick={onClose}>
      <div className="drawer top" onClick={(e) => e.stopPropagation()}>
        <input className="search-input" placeholder="Tìm kiếm sản phẩm..." autoFocus />
      </div>
    </div>
  );
}


