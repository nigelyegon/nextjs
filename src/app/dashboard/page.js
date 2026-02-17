"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me"); // your endpoint to get logged-in user info
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

  return (
    <div className="container">
      <Navbar user={user} />
      <h2>Dashboard</h2>
      {user ? (
        <p>Welcome back, {user.name} ({user.email})!</p>
      ) : (
        <p>Loading...</p>
      )}
      <p style={{ marginTop: "20px", color: "#aaa" }}>
        This is your minimal modern dark dashboard. Add charts, stats, or components here.
      </p>
    </div>
  );
}
