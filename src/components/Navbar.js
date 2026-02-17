"use client";
import { useState, useEffect } from "react";

export default function Navbar({ brand = "MyApp" }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  // Apply dark/light mode globally
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f5f5";
    document.body.style.color = darkMode ? "#f5f5f5" : "#121212";
  }, [darkMode]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        backgroundColor: darkMode ? "#1a1a1a" : "#e5e5e5",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        marginBottom: "20px",
        position: "relative",
      }}
    >
      {/* Brand */}
      <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: darkMode ? "#fff" : "#000" }}>
        {brand}
      </div>

      {/* Desktop Menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
        className="desktop-menu"
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 12px",
            backgroundColor: darkMode ? "#4f46e5" : "#6366f1",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {!user && (
          <>
            <a href="/login" style={{ color: "#4f46e5" }}>Login</a>
            <a href="/register" style={{ color: "#4f46e5" }}>Register</a>
          </>
        )}

        {user && (
          <>
            <span style={{ color: darkMode ? "#ccc" : "#333" }}>Hi, {user.name}</span>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f87171",
                color: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "24px",
          height: "18px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        className="mobile-menu-button"
      >
        <span
          style={{
            height: "3px",
            width: "100%",
            background: "#fff",
            borderRadius: "2px",
            transition: "0.3s",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }}
        />
        <span
          style={{
            height: "3px",
            width: "100%",
            background: "#fff",
            borderRadius: "2px",
            opacity: menuOpen ? 0 : 1,
            transition: "0.3s",
          }}
        />
        <span
          style={{
            height: "3px",
            width: "100%",
            background: "#fff",
            borderRadius: "2px",
            transition: "0.3s",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "24px",
            backgroundColor: darkMode ? "#1a1a1a" : "#e5e5e5",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            zIndex: 50,
          }}
          className="mobile-menu"
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "6px 12px",
              backgroundColor: darkMode ? "#4f46e5" : "#6366f1",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {!user && (
            <>
              <a href="/login" style={{ color: "#4f46e5" }}>Login</a>
              <a href="/register" style={{ color: "#4f46e5" }}>Register</a>
            </>
          )}

          {user && (
            <>
              <span style={{ color: darkMode ? "#ccc" : "#333" }}>Hi, {user.name}</span>
              <button
                onClick={logout}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#f87171",
                  color: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .desktop-menu {
            display: none;
          }
          .mobile-menu-button {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
