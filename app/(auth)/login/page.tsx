"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@saviregency.com");
  const [password, setPassword] = useState("Savi@2307");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    const data = await res.json();
    router.push(data.role === "ADMIN" ? "/owner/dashboard" : "/staff/reports");
  }

  return (
    <main className="container narrow">
      <h1>Secure Login</h1>
      <form onSubmit={submit} className="card form-grid">
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit">Sign In</button>
      </form>
    </main>
  );
}
