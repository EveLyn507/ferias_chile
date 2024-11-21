/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { Logout } from "./logout";

export function Logeado() {
  const token = useSelector((state: any) => state.user.token);
  const role = useSelector((state: any) => state.user.role);



  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Botón principal */}
      <li
        onClick={toggleDropdown}
        style={{
       
          backgroundColor: "transparent",
          color: "#646CFF",
          cursor: "pointer"
        }}
      >
        {token && role ? "Mi Perfil" : "Login"}
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
            borderRadius: "4px",
            listStyle: "none",
            margin: 0,
            padding: "10px 0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {token && role ? (
            <>
              <li
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <a
                  href={`/private/${role}`}
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Ir a Perfil
                </a>
              </li>
                <Logout/>
            </>
          ) : (
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              <a
                href="/login"
                style={{ textDecoration: "none", color: "#000000" }}
              >
                Login
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
