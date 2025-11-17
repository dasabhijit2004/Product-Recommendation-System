"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      router.push("/");
    }, 500);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {success && <p className="text-emerald-400 text-sm mb-3">{success}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-sky-400 underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
