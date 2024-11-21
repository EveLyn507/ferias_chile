import React, { useState } from "react";

const DropdownButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Botón que abre/cierra el dropdown */}
      <button
        onClick={toggleDropdown}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Dropdown
      </button>

      {/* Contenido del dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => alert("Option 1 selected")}
            >
              Option 1
            </li>
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => alert("Option 2 selected")}
            >
              Option 2
            </li>
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
              }}
              onClick={() => alert("Option 3 selected")}
            >
              Option 3
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
