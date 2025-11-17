"use client";

import { useState } from "react";
import jwt from "jsonwebtoken";

export default function SearchBar() {
  const [term, setTerm] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    // Get token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    let userId = null;
    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        userId = decoded?.id;
      } catch {}
    }

    if (userId) {
      await fetch("/api/user/track/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, term }),
      });
    }

    // 👉 Navigate to search results page
    window.location.href = `/search?query=${encodeURIComponent(term)}`;
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search for products..."
        className="p-2 rounded bg-slate-800 border border-slate-700 w-full"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        required
      />
      <button className="bg-sky-500 px-4 text-black rounded">
        Search
      </button>
    </form>
  );
}
