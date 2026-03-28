"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doorOpen, setDoorOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter your property address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const { slug } = await res.json();
      setDoorOpen(true);

      setTimeout(() => {
        router.push(`/house/${slug}`);
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-cream to-sand">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in max-w-2xl">
        <div className="mb-6">
          <svg className="mx-auto w-16 h-16 text-brown-600" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="2">
            <path d="M32 6L4 28h8v26h16V38h8v16h16V28h8L32 6z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-4">
          House Maintenance Platform
        </h1>
        <p className="text-lg text-brown-600 leading-relaxed">
          Keep your home in top shape. Create a personalized maintenance checklist for your property,
          track tasks, and never miss a seasonal check again.
        </p>
      </div>

      {/* Door Entry */}
      <div className={`relative w-72 md:w-80 ${doorOpen ? "door-open" : ""}`}>
        {/* Door Frame */}
        <div className="bg-brown-800 rounded-t-xl p-3 pb-0 shadow-2xl">
          {/* Transom */}
          <div className="bg-blue-100/30 h-8 rounded-t-lg mb-2 flex items-center justify-center">
            <span className="text-brown-200 text-xs tracking-widest uppercase font-medium">Welcome Home</span>
          </div>

          {/* Door */}
          <div className="door-panel bg-gradient-to-b from-brown-600 to-brown-700 rounded-t-sm min-h-[340px] relative flex flex-col items-center justify-center px-6">
            {/* Door panels decorative */}
            <div className="absolute top-4 left-4 right-4 bottom-4 flex flex-col gap-3">
              <div className="border-2 border-brown-500/40 rounded-sm flex-1"></div>
              <div className="border-2 border-brown-500/40 rounded-sm flex-1"></div>
            </div>

            {/* Doorknob */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 rounded-full bg-yellow-600 shadow-lg border border-yellow-500"></div>
              <div className="w-3 h-1 rounded-full bg-yellow-700 mx-auto mt-0.5"></div>
            </div>

            {/* Form on door */}
            <form onSubmit={handleSubmit} className="relative z-10 w-full space-y-4">
              <div>
                <label className="block text-brown-100 text-sm font-medium mb-1.5">
                  Enter your property address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Anytown, VA"
                  className="w-full px-3 py-2.5 rounded-lg bg-cream/95 text-brown-900 placeholder-brown-400 text-sm border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-inner"
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-red-300 text-xs">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
              >
                {loading ? "Opening door..." : "Open the Door"}
              </button>
            </form>
          </div>
        </div>

        {/* Doorstep */}
        <div className="bg-brown-900 h-3 rounded-b-lg shadow-md"></div>
        <div className="bg-brown-800/50 h-2 rounded-b-lg mx-2"></div>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-brown-400 text-sm text-center max-w-md">
        No account needed. Your house gets a unique URL — share it with anyone who should see the maintenance plan.
      </p>
    </div>
  );
}
