"use client";

import { useState, FormEvent } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      setLoading(false);
      return;
    }

    setSuccess("Signup successful! Redirecting to login...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm mb-3">{success}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            placeholder="Name"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-sky-500 text-black py-2 rounded hover:bg-sky-400"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-sky-400 underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
