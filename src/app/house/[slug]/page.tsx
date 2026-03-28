"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { House, Task, Contractor } from "@/lib/types";
import AtAGlance from "@/components/AtAGlance";
import TaskSection from "@/components/TaskSection";
import ContractorsSection from "@/components/ContractorsSection";
import GuidanceSection from "@/components/GuidanceSection";

const FREQUENCY_ORDER = ["monthly", "bi_monthly", "six_monthly", "annual", "two_year", "five_year"];

export default function HouseDashboard() {
  const params = useParams();
  const slug = params.slug as string;

  const [house, setHouse] = useState<House | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/houses/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("House not found. Please check the URL.");
        } else {
          setError("Something went wrong loading this house.");
        }
        return;
      }
      const data = await res.json();
      setHouse(data.house);
      setTasks(data.tasks);
      setContractors(data.contractors);
      setError("");
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-brown-500 text-sm">Loading your home...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="text-center max-w-md">
          <svg className="mx-auto w-16 h-16 text-brown-300 mb-4" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="2">
            <path d="M32 6L4 28h8v26h16V38h8v16h16V28h8L32 6z" />
          </svg>
          <h1 className="text-2xl font-bold text-brown-800 mb-2">Hmm, we can&apos;t find that house</h1>
          <p className="text-brown-500 mb-6">{error}</p>
          <a href="/" className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (!house) return null;

  const tasksByFreq = FREQUENCY_ORDER.map((freq) => ({
    frequency: freq,
    tasks: tasks.filter((t) => t.frequency === freq),
  }));

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/house/${house.slug}` : `/house/${house.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-sand">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-brown-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="text-brown-400 hover:text-brown-600 transition-colors">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth="3">
                <path d="M32 6L4 28h8v26h16V38h8v16h16V28h8L32 6z" />
              </svg>
            </a>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-brown-900 truncate">{house.address}</h1>
              <p className="text-xs text-brown-400 truncate">{shareUrl}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-brown-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Anyone with this link can view and edit this house&apos;s maintenance list. There is no password.</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* At a Glance */}
        <section>
          <h2 className="text-sm font-semibold text-brown-500 uppercase tracking-wider mb-3">At a Glance</h2>
          <AtAGlance tasks={tasks} />
        </section>

        {/* Tasks by Frequency */}
        <section>
          <h2 className="text-sm font-semibold text-brown-500 uppercase tracking-wider mb-3">Maintenance Tasks</h2>
          <div className="space-y-4">
            {tasksByFreq.map(({ frequency, tasks: freqTasks }) => (
              <TaskSection
                key={frequency}
                slug={slug}
                frequency={frequency}
                tasks={freqTasks}
                contractors={contractors}
                onRefresh={fetchData}
              />
            ))}
          </div>
        </section>

        {/* Contractors */}
        <section>
          <h2 className="text-sm font-semibold text-brown-500 uppercase tracking-wider mb-3">Your Team</h2>
          <ContractorsSection slug={slug} contractors={contractors} onRefresh={fetchData} />
        </section>

        {/* Guidance */}
        <section>
          <h2 className="text-sm font-semibold text-brown-500 uppercase tracking-wider mb-3">Guidance</h2>
          <GuidanceSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-xs text-brown-300">
        House Maintenance Platform
      </footer>
    </div>
  );
}
