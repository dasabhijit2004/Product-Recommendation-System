import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-5xl font-bold text-white mb-4">
          AI Product Recommendation System
        </h1>

        <p className="text-slate-400 mb-12">
          Choose your recommendation experience
        </p>

        <div className="flex gap-8 justify-center">

          <Link
            href="/recommend/new"
            className="px-10 py-5 rounded-xl bg-sky-500 text-black text-xl font-semibold hover:bg-sky-400"
          >
            New User
          </Link>

          <Link
            href="/recommend/existing"
            className="px-10 py-5 rounded-xl bg-emerald-500 text-black text-xl font-semibold hover:bg-emerald-400"
          >
            Existing User
          </Link>

        </div>

      </div>
    </main>
  );
}