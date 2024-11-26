/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Logout } from "./logout";
import { Link } from "react-router-dom";

export function Logeado() {
  const token = useSelector((state: any) => state.user.token);
  const role = useSelector((state: any) => state.user.role);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const closeDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", closeDropdown);
    } else {
      document.removeEventListener("click", closeDropdown);
    }

    return () => document.removeEventListener("click", closeDropdown);
  }, [isDropdownOpen]);

  return (

    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block"}}>
      {token && role ? (
        <>
          {/* Botón principal */}
          <li
            onClick={toggleDropdown}
            style={{
              backgroundColor: "transparent",
              color: "#f6e4e4",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
            }}
          >
            Mi Perfil
          </li>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                listStyle: "none",
                margin: 0,
                padding: "8px 0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
            >
              <li
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <a
                  href={`/private/${role}`}
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  Ir a Perfil
                </a>
              </li>
              <li
          
              >
                <Logout />
              </li>
            </ul>
          )}
        </>
      ) : (
        // Mostrar solo el enlace de Login cuando no hay token ni role
        <li><Link to="/login"> Login</Link></li>
      )}
    </div>

  );
}
