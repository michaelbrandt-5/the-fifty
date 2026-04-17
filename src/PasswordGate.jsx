import React, { useState, useEffect } from "react";

const STORAGE_KEY = "fifty-unlocked";
const PASSWORD = "cities";

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "yes") {
        setUnlocked(true);
      }
    } catch (e) {
      // sessionStorage unavailable — fall through to showing gate
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "yes");
      } catch (err) {
        // ignore storage errors
      }
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (unlocked) return children;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F4EE",
        color: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#B8864E",
            marginBottom: 24,
          }}
        >
          The Fifty
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 42,
            lineHeight: 1.1,
            fontWeight: 500,
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}
        >
          Private preview
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: "#555",
            margin: "0 0 32px",
          }}
        >
          This site isn&rsquo;t public yet. Enter the password to take a look.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Password"
            autoFocus
            aria-label="Password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              fontSize: 16,
              fontFamily: "'Inter', system-ui, sans-serif",
              border: error ? "1px solid #A83C32" : "1px solid #D9D3C6",
              borderRadius: 4,
              background: "#FFFDF9",
              color: "#1A1A1A",
              outline: "none",
              marginBottom: 12,
            }}
          />
          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#A83C32",
                marginBottom: 12,
                textAlign: "left",
              }}
            >
              That&rsquo;s not the password. Try again.
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "'Inter', system-ui, sans-serif",
              background: "#1A1A1A",
              color: "#F7F4EE",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </form>
        <div
          style={{
            marginTop: 40,
            fontSize: 12,
            color: "#888",
            letterSpacing: "0.04em",
          }}
        >
          &copy; The Fifty
        </div>
      </div>
    </div>
  );
}
