
import React from "react";

/**
 * Generate UI based on intent
 */
export function generateUI(intent: string): JSX.Element {
  const lowerIntent = intent.toLowerCase();

  // 🔐 Login Form
  if (lowerIntent.includes("login")) {
    return (
      <div>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          aria-label="Username"
        />

        <input
          type="password"
          placeholder="Password"
          aria-label="Password"
        />

        <button aria-label="Login Button">Login</button>
      </div>
    );
  }

  // 📝 Contact Form
  if (lowerIntent.includes("contact")) {
    return (
      <div>
        <h2>Contact Us</h2>

        <input
          type="text"
          placeholder="Name"
          aria-label="Name"
        />

        <input
          type="email"
          placeholder="Email"
          aria-label="Email"
        />

        <textarea
          placeholder="Message"
          aria-label="Message"
        />

        <button aria-label="Submit Contact Form">
          Submit
        </button>
      </div>
    );
  }

  // ⭐ Default fallback
  return (
    <div>
      <p>{intent}</p>
    </div>
  );
}